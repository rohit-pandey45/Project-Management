import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, body) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.SENDER_EMAIL, 
      to,
      subject,  
      html: body, 
    });
    console.log("Message sent: %s", response.messageId);
    return response
    
    // Preview URL is only available when using an Ethereal test account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
    throw err;
  }
};

export default sendEmail
