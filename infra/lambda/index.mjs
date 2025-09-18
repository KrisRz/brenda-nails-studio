import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const ses = new AWS.SES({ apiVersion: "2010-12-01", region: process.env.AWS_REGION || "eu-west-2" });
const sns = new AWS.SNS({ apiVersion: "2010-03-31", region: process.env.AWS_REGION || "eu-west-2" });
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || "eu-west-2" });

const TABLE_NAME = process.env.DYNAMODB_TABLE;

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*", // Allow all origins for development
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    const path = event.requestContext?.http?.path;
    const method = event.requestContext?.http?.method;

    console.log(`${method} ${path}`);

    // Route to appropriate handler
    if (path === "/contact" && method === "POST") {
      return await handleContact(event, headers);
    } else if (path === "/booking" && method === "POST") {
      return await handleBooking(event, headers);
    } else if (path === "/availability" && method === "GET") {
      return await handleAvailability(event, headers);
    } else if (path === "/cms-data" && method === "GET") {
      return await handleCmsData(event, headers);
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: "Endpoint not found" }) };
  } catch (error) {
    console.error("Handler error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Internal server error" }) };
  }
};

// Original contact form handler
async function handleContact(event, headers) {
  try {
    const { name, email, subject, message } = JSON.parse(event.body || "{}");
    if (!name || !email || !subject || !message) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "All fields are required" }) };
    }

    // Email to Brenda (original functionality)
    const brendaHtml = `<strong>From:</strong> ${name} (${email})<br><br>${String(message).replace(/\n/g, "<br>")}`;

    const brendaResult = await ses.sendEmail({
      Source: process.env.FROM_EMAIL,
      Destination: { ToAddresses: [process.env.TO_EMAIL] },
      ReplyToAddresses: [email],
      Message: { Subject: { Data: subject }, Body: { Html: { Data: brendaHtml } } }
    }).promise();

    console.log("Email sent to Brenda:", brendaResult.MessageId);

    // Send confirmation email to customer
    await sendContactConfirmation({ name, email, subject, message });

    // Send SMS notification to Brenda about contact form
    await sendContactSmsNotification({ name, email, subject, message });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: "Message sent successfully! You'll receive a confirmation email shortly." }) };
  } catch (e) {
    console.error("Contact error:", e.message, e.code, e.statusCode);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to send" }) };
  }
}

// PHASE 2 - Booking handler
async function handleBooking(event, headers) {
  try {
    const { action, data } = JSON.parse(event.body || "{}");
    
    switch (action) {
      case "check_availability":
        return await checkAvailability(data, headers);
      case "create_booking":
        return await createBooking(data, headers);
      case "get_customer":
        return await getCustomer(data, headers);
      default:
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid action" }) };
    }
  } catch (error) {
    console.error("Booking error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Booking failed" }) };
  }
}

// PHASE 2 - Availability handler
async function handleAvailability(event, headers) {
  try {
    const queryParams = event.queryStringParameters || {};
    const { date, service } = queryParams;

    if (!date) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Date parameter required" }) };
    }

    const availability = await getAvailabilityForDate(date, service);
    return { statusCode: 200, headers, body: JSON.stringify(availability) };
  } catch (error) {
    console.error("Availability error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to check availability" }) };
  }
}

// Helper functions for booking system
async function checkAvailability(data, headers) {
  const { date, service } = data;
  
  if (!date) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Date is required" }) };
  }

  try {
    const availability = await getAvailabilityForDate(date, service);
    return { statusCode: 200, headers, body: JSON.stringify(availability) };
  } catch (error) {
    console.error("Check availability error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to check availability" }) };
  }
}

async function createBooking(data, headers) {
  const { firstName, lastName, email, phone, service, date, time, message } = data;

  if (!firstName || !lastName || !email || !phone || !service || !date || !time) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "All booking fields are required" }) };
  }

  try {
    const bookingId = uuidv4();
    const customerId = email;
    
    // Get service details - find by name or key
    const services = await getBusinessConfig("services");
    let serviceDetails = services.config[service]; // Try direct key lookup first
    
    // If not found by key, try to find by name
    if (!serviceDetails) {
      const serviceKey = Object.keys(services.config).find(key => 
        services.config[key].name === service
      );
      if (serviceKey) {
        serviceDetails = services.config[serviceKey];
      }
    }
    
    if (!serviceDetails) {
      console.log(`Service not found: ${service}. Available services:`, Object.keys(services.config));
      return { statusCode: 400, headers, body: JSON.stringify({ error: `Invalid service selected: ${service}` }) };
    }

    // Create booking record
    const booking = {
      entityType: "BOOKING",
      entityId: `${date}#${bookingId}`,
      bookingId,
      customerId,
      date,
      startTime: time,
      endTime: addMinutesToTime(time, serviceDetails.duration),
      service,
      serviceDetails,
      customerDetails: { firstName, lastName, email, phone },
      message: message || "",
      status: "confirmed",
      createdAt: new Date().toISOString()
    };

    await dynamodb.put({ TableName: TABLE_NAME, Item: booking }).promise();
    
    // Send notifications
    await sendBookingConfirmation(booking); // Email to customer
    await notifyBrendaNewBooking(booking);  // Email + SMS to Brenda

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        bookingId,
        message: "Booking confirmed! You'll receive a confirmation email shortly."
      })
    };

  } catch (error) {
    console.error("Create booking error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to create booking" }) };
  }
}

async function getCustomer(data, headers) {
  const { email } = data;
  
  if (!email) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Email is required" }) };
  }

  try {
    const result = await dynamodb.query({
      TableName: TABLE_NAME,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email AND entityType = :entityType",
      ExpressionAttributeValues: { ":email": email, ":entityType": "CUSTOMER" }
    }).promise();

    return { statusCode: 200, headers, body: JSON.stringify({ customer: result.Items[0] || null }) };
  } catch (error) {
    console.error("Get customer error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to get customer" }) };
  }
}

// Business logic helpers
async function getAvailabilityForDate(date, service = null) {
  const businessHours = await getBusinessConfig("business_hours");
  const services = await getBusinessConfig("services");
  
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const dayConfig = businessHours.config[dayOfWeek];
  
  if (!dayConfig || !dayConfig.enabled) {
    return {
      date,
      available: false,
      reason: dayConfig?.note || "Closed on this day"
    };
  }

  const existingBookings = await getBookingsForDate(date);
  const duration = service ? services.config[service]?.duration || 60 : 60;
  const slots = generateTimeSlots(dayConfig.open, dayConfig.close, duration);

  const availableSlots = slots.filter(slot => {
    return !existingBookings.some(booking => {
      return slot.time >= booking.startTime && slot.time < booking.endTime;
    });
  });

  return {
    date,
    available: availableSlots.length > 0,
    availableSlots: availableSlots.map(slot => slot.time),
    businessHours: { open: dayConfig.open, close: dayConfig.close }
  };
}

async function getBusinessConfig(configKey) {
  try {
    const result = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { entityType: "CONFIG", entityId: configKey }
    }).promise();
    return result.Item || { config: {} };
  } catch (error) {
    console.error(`Failed to get config ${configKey}:`, error);
    return { config: {} };
  }
}

async function getBookingsForDate(date) {
  try {
    const result = await dynamodb.query({
      TableName: TABLE_NAME,
      IndexName: "DateIndex",
      KeyConditionExpression: "#date = :date AND entityType = :entityType",
      ExpressionAttributeNames: { "#date": "date" },
      ExpressionAttributeValues: { ":date": date, ":entityType": "BOOKING" }
    }).promise();
    return result.Items || [];
  } catch (error) {
    console.error("Failed to get bookings:", error);
    return [];
  }
}

async function sendBookingConfirmation(booking) {
  try {
    const { customerDetails, serviceDetails, date, startTime } = booking;
    
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #ff80b5, #9089fc); color: white; padding: 20px; text-align: center;">
          <h1>💅 Brenda Nails Studio</h1>
          <p>Your appointment is confirmed!</p>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>Hi ${customerDetails.firstName}!</h2>
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3>Appointment Details</h3>
            <ul>
              <li><strong>Service:</strong> ${serviceDetails.name}</li>
              <li><strong>Date:</strong> ${date}</li>
              <li><strong>Time:</strong> ${startTime}</li>
              <li><strong>Duration:</strong> ${serviceDetails.duration} minutes</li>
              <li><strong>Price:</strong> £${serviceDetails.price}</li>
            </ul>
          </div>
          <p><strong>📍 Address:</strong><br>11 Bevington Close, Midsomer Norton, BA3 2FD</p>
          <p><strong>🚗 Parking:</strong> FREE parking right outside</p>
          <p>Looking forward to seeing you! ✨</p>
        </div>
      </div>
    `;

    await ses.sendEmail({
      Source: process.env.FROM_EMAIL,
      Destination: { ToAddresses: [customerDetails.email] },
      Message: {
        Subject: { Data: `💅 Appointment Confirmed - ${serviceDetails.name}` },
        Body: { Html: { Data: html } }
      }
    }).promise();

  } catch (error) {
    console.error("Failed to send booking confirmation:", error);
  }
}

// Send notification to Brenda about new booking (Email + SMS)
async function notifyBrendaNewBooking(booking) {
  try {
    const { customerDetails, serviceDetails, date, startTime, bookingId } = booking;
    
    // 1. Send EMAIL to Brenda
    const emailHtml = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 20px; text-align: center;">
          <h1>🚨 NEW BOOKING ALERT</h1>
          <p>You have a new appointment booking!</p>
        </div>
        <div style="padding: 20px; background: #f0f8ff;">
          <h2>Booking Details</h2>
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff6b35;">
            <h3>Customer Information</h3>
            <ul>
              <li><strong>Name:</strong> ${customerDetails.firstName} ${customerDetails.lastName}</li>
              <li><strong>Email:</strong> ${customerDetails.email}</li>
              <li><strong>Phone:</strong> ${customerDetails.phone}</li>
            </ul>
          </div>
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f7931e;">
            <h3>Appointment Details</h3>
            <ul>
              <li><strong>Service:</strong> ${serviceDetails.name}</li>
              <li><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</li>
              <li><strong>Time:</strong> ${startTime}</li>
              <li><strong>Duration:</strong> ${serviceDetails.duration} minutes</li>
              <li><strong>Price:</strong> £${serviceDetails.price}</li>
            </ul>
          </div>
          ${booking.message ? `
            <div style="background: #fff9c4; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3>Special Requests</h3>
              <p><em>"${booking.message}"</em></p>
            </div>
          ` : ''}
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3>Action Required</h3>
            <p>✅ Customer has been sent a confirmation email</p>
            <p>📅 Add this appointment to your calendar</p>
            <p>📞 Consider calling customer to confirm special requests</p>
          </div>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><em>This booking was made through the website chatbot.</em></p>
        </div>
      </div>
    `;

    await ses.sendEmail({
      Source: process.env.FROM_EMAIL,
      Destination: { ToAddresses: [process.env.TO_EMAIL] },
      Message: {
        Subject: { Data: `🚨 NEW BOOKING: ${customerDetails.firstName} ${customerDetails.lastName} - ${serviceDetails.name}` },
        Body: { Html: { Data: emailHtml } }
      }
    }).promise();

    // 2. Send SMS to Brenda
    const smsMessage = `🚨 NEW BOOKING ALERT! 💅

👤 ${customerDetails.firstName} ${customerDetails.lastName}
📧 ${customerDetails.email}
📞 ${customerDetails.phone}

💅 Service: ${serviceDetails.name}
📅 Date: ${new Date(date).toLocaleDateString('en-GB')}
🕐 Time: ${startTime}
💰 Price: £${serviceDetails.price}

${booking.message ? `💬 Note: "${booking.message}"` : ''}

✅ Customer confirmation sent
📋 Booking ID: ${bookingId}

Brenda Nails Studio`;

    console.log(`🔔 Sending SMS to SNS Topic: ${process.env.SNS_TOPIC_ARN}`);
    console.log(`📱 SMS Message: ${smsMessage}`);
    
    const smsResult = await sns.publish({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: smsMessage,
      Subject: `New Booking: ${customerDetails.firstName} ${customerDetails.lastName}`
    }).promise();

    console.log(`✅ SMS sent successfully! MessageId: ${smsResult.MessageId}`);
    console.log(`Brenda notified about booking ${bookingId} via email and SMS`);

  } catch (error) {
    console.error("Failed to notify Brenda about new booking:", error);
    // Don't throw error - customer booking should still succeed even if Brenda notification fails
  }
}

// Utility functions
function generateTimeSlots(openTime, closeTime, duration) {
  const slots = [];
  let current = openTime;
  
  while (current < closeTime) {
    const endTime = addMinutesToTime(current, duration);
    if (endTime <= closeTime) {
      slots.push({ time: current, endTime });
    }
    current = addMinutesToTime(current, 30);
  }
  
  return slots;
}

function addMinutesToTime(timeString, minutes) {
  const [hours, mins] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}

// Send confirmation email to customer after contact form submission
async function sendContactConfirmation({ name, email, subject, message }) {
  try {
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #ff80b5, #9089fc); color: white; padding: 20px; text-align: center;">
          <h1>💅 Brenda Nails Studio</h1>
          <p>Thank you for contacting us!</p>
        </div>
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>Hi ${name}!</h2>
          <p>Thank you for reaching out to Brenda Nails Studio. We've received your message and will get back to you as soon as possible.</p>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff80b5;">
            <h3>Your Message Summary</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin-top: 10px;">
              <p><strong>Message:</strong></p>
              <p style="margin: 5px 0; font-style: italic;">"${message.replace(/\n/g, '<br>')}"</p>
            </div>
          </div>

          <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3>📍 Studio Information</h3>
            <p><strong>Address:</strong><br>11 Bevington Close, Midsomer Norton, BA3 2FD</p>
            <p><strong>🚗 Parking:</strong> FREE parking right outside</p>
            <p><strong>📞 Phone:</strong> Available on our website</p>
          </div>

          <div style="background: linear-gradient(135deg, #e8f5e8, #d4edda); padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3>✨ What's Next?</h3>
            <p>• We typically respond within 24 hours</p>
            <p>• For urgent appointments, feel free to call us directly</p>
            <p>• Check out our services and gallery on our website</p>
          </div>

          <p>Looking forward to helping you achieve beautiful nails! ✨</p>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            <em>This is an automated confirmation. Please don't reply to this email - we'll respond to your original message soon!</em>
          </p>
        </div>
        
        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>💅 Brenda Nails Studio - Professional Nail Care Services</p>
          <p style="margin: 5px 0;">Midsomer Norton, Bath & North East Somerset</p>
        </div>
      </div>
    `;

    await ses.sendEmail({
      Source: process.env.FROM_EMAIL,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: `✅ Message Received - Brenda Nails Studio` },
        Body: { Html: { Data: html } }
      }
    }).promise();

    console.log(`Contact confirmation sent to ${email}`);

  } catch (error) {
    console.error("Failed to send contact confirmation:", error);
    // Don't throw error - original message to Brenda should still succeed
  }
}

// CMS Data handler - proxy to Webiny with fallback to DynamoDB
async function handleCmsData(event, headers) {
  try {
    const queryParams = event.queryStringParameters || {};
    const { type } = queryParams;

    // Hardcoded data definition
    const cmsData = {
      services: [
        {
          id: "gel_manicure",
          name: "Gel Manicure", 
          description: "Professional gel manicure with long-lasting shine and durability",
          price: 30,
          duration: 70,
          image: "/images/services/1_Gel_Manicure.jpg",
          bgGradient: "from-rose-400 to-pink-500",
          size: "large"
        },
        {
          id: "gel_acrylic",
          name: "Gel Acrylic Nails",
          description: "Extension on form with gel acrylic for strength and custom shapes", 
          price: 45,
          duration: 120,
          image: "/images/services/2_Gel_Acrylic_Nails.jpg",
          bgGradient: "from-purple-400 to-rose-500",
          size: "large"
        },
        {
          id: "gel_infill_early",
          name: "Gel Infill (≤3 weeks)",
          description: "Maintenance and refresh for existing gel manicure",
          price: 30,
          duration: 60,
          image: "/images/services/3.jpg",
          bgGradient: "from-pink-400 to-rose-500",
          size: "small"
        },
        {
          id: "french_manicure",
          name: "French Manicure",
          description: "Timeless elegant French tips with perfect precision",
          price: 30,
          duration: 50,
          image: "/images/services/4_French_Manicure.jpg",
          bgGradient: "from-rose-300 to-pink-400",
          size: "small"
        },
        {
          id: "gel_infill_late", 
          name: "Gel Infill (>3 weeks)",
          description: "Extended maintenance for gel manicures requiring more work",
          price: 35,
          duration: 90,
          image: "/images/services/5.jpg",
          bgGradient: "from-purple-300 to-rose-400",
          size: "small"
        },
        {
          id: "cartoon_art",
          name: "Cartoon Art (per nail)",
          description: "Custom cartoon designs and artistic elements on individual nails",
          price: 5,
          duration: 20,
          image: "/images/services/6_Cartoon.jpg",
          bgGradient: "from-indigo-400 to-purple-500",
          size: "small"
        },
        {
          id: "removal_only",
          name: "Removal Only", 
          description: "Professional nail polish or gel removal service",
          price: 10,
          duration: 30,
          image: "/images/services/7.jpg",
          bgGradient: "from-gray-400 to-slate-500",
          size: "large"
        },
        {
          id: "nail_repair",
          name: "Nail Repair (per nail)",
          description: "Professional repair for damaged or broken nails", 
          price: 5,
          duration: 15,
          image: "/images/services/8.jpg",
          bgGradient: "from-amber-400 to-orange-500",
          size: "large"
        }
      ],
      testimonials: [
        {
          id: "sarah_mitchell",
          authorName: "Sarah Mitchell",
          rating: 5,
          text: "Brenda transformed not just my nails, but my confidence. I walk into every meeting feeling powerful and polished. It's not just a manicure - it's a complete transformation.",
          service: "Executive Manicure"
        }
      ],
      studioInfo: {
        heroTitle: "NAILS. REINVENTED.",
        tagline: "Where artistry meets excellence. Professional nail care crafted with passion and precision.",
        address: "11 Bevington Close, Midsomer Norton, BA3 2FD",
        phone: "+447511120184",
        email: "beniahaker@interia.eu",
        hours: "Monday - Friday: 10:00 - 17:00\nSaturday: By appointment\nSunday: By appointment"
      }
    };

    // Combine Webiny services with hardcoded services
    if (type === 'services') {
      try {
        const webinyServices = await getWebinyServices() || [];
        const hardcodedServices = cmsData.services;
        
        // Combine both arrays - Webiny first, then hardcoded
        const allServices = [...webinyServices, ...hardcodedServices];
        
        console.log(`Returning ${allServices.length} services (${webinyServices.length} from Webiny + ${hardcodedServices.length} hardcoded)`);
        return { statusCode: 200, headers, body: JSON.stringify(allServices) };
      } catch (error) {
        console.log("Failed to fetch from Webiny, using fallback:", error.message);
        return { statusCode: 200, headers, body: JSON.stringify(cmsData.services) };
      }
    }

    if (type && cmsData[type]) {
      return { statusCode: 200, headers, body: JSON.stringify(cmsData[type]) };
    }

    return { statusCode: 200, headers, body: JSON.stringify(cmsData) };

  } catch (error) {
    console.error("CMS data error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to fetch CMS data" }) };
  }
}

// Send SMS notification to Brenda about contact form
async function sendContactSmsNotification({ name, email, subject, message }) {
  try {
    const smsMessage = `📞 NOWY KONTAKT! 
    
👤 ${name}
📧 ${email}
📝 ${subject}

💬 "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"

Sprawdź email dla pełnych szczegółów!

Brenda Nails Studio`;

    console.log(`🔔 Sending contact SMS to SNS Topic: ${process.env.SNS_TOPIC_ARN}`);
    console.log(`📱 Contact SMS Message: ${smsMessage}`);
    
    const smsResult = await sns.publish({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: smsMessage,
      Subject: `New Contact: ${name}`
    }).promise();

    console.log(`✅ Contact SMS sent successfully! MessageId: ${smsResult.MessageId}`);

  } catch (error) {
    console.error("Failed to send contact SMS:", error);
    // Don't throw error - contact form should still succeed
  }
}

// Get services from Webiny GraphQL API
async function getWebinyServices() {
  try {
    const readApiUrl = process.env.WEBINY_READ_API_URL;
    const apiKey = process.env.WEBINY_API_KEY;
    
    if (!readApiUrl || !apiKey) {
      throw new Error("WEBINY_READ_API_URL or WEBINY_API_KEY not configured");
    }

    // GraphQL query for services (only existing fields)
    const query = {
      query: `
        query {
          listService {
            data {
              id
              title
              category  
              priceFrom
              description
            }
          }
        }
      `
    };

    console.log(`Calling Webiny API: ${readApiUrl} with token: ${apiKey.substring(0, 10)}...`);

    // Call Webiny GraphQL API with API Key
    const response = await fetch(readApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(query)
    });

    const responseText = await response.text();
    console.log(`Webiny API response status: ${response.status}, body: ${responseText}`);

    if (!response.ok) {
      throw new Error(`Webiny API error: ${response.status} ${response.statusText} - ${responseText}`);
    }

    const result = JSON.parse(responseText);

    if (result.error) {
      throw new Error(`Webiny GraphQL error: ${result.error.message}`);
    }

    const services = result.data?.listService?.data || [];
    console.log(`Found ${services.length} services from Webiny GraphQL`);

    if (services.length === 0) {
      console.log("No services found in Webiny GraphQL");
      return null;
    }

    // Transform Webiny data to frontend format with proper field mapping
    const transformedServices = services.map(service => {
      const transformed = {
        id: service.id,
        name: service.title || 'Unknown Service',
        description: service.description || 'Professional service',
        price: service.priceFrom || 0,
        duration: 60, // Default duration since field doesn't exist in model
        image: '/images/services/1_Gel_Manicure.jpg',
        bgGradient: 'from-rose-400 to-pink-500',
        size: 'large'
      };
      
      console.log(`Transformed service: ${transformed.name}, price: ${transformed.price}, duration: ${transformed.duration}`);
      return transformed;
    });

    return transformedServices;

  } catch (error) {
    console.error("Error fetching from Webiny GraphQL:", error);
    return null;
  }
}
