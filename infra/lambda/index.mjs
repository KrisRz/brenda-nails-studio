import AWS from "aws-sdk";

const ses = new AWS.SES({ apiVersion: "2010-12-01", region: process.env.AWS_REGION || "eu-west-2" });
const sns = new AWS.SNS({ apiVersion: "2010-03-31", region: process.env.AWS_REGION || "eu-west-2" });

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
        phone: "+447511201840",
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
