import AWS from "aws-sdk";
const ses = new AWS.SES({ apiVersion: "2010-12-01", region: process.env.AWS_REGION || "eu-west-2" });

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body || "{}");
    if (!name || !email || !subject || !message) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "All fields are required" }) };
    }

    const html = `<strong>From:</strong> ${name} (${email})<br><br>${String(message).replace(/\n/g,"<br>")}`;

    const result = await ses.sendEmail({
      Source: process.env.FROM_EMAIL,
      Destination: { ToAddresses: [process.env.TO_EMAIL] },
      ReplyToAddresses: [email],
      Message: { Subject: { Data: subject }, Body: { Html: { Data: html } } }
    }).promise();

    console.log("SES success:", result.MessageId);
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: "Email sent" }) };
  } catch (e) {
    console.error("SES error:", e.message, e.code, e.statusCode);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Failed to send" }) };
  }
};
