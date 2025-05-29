const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, subject, message }) => {
  try {
    const response = await resend.emails.send({
      from: 'Talak Kinash <info@talakkinash.live>', 
      to: email,
      subject,
      html: message,
    });

    console.log("Email sent:", response);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error(error.message);
  }
};

module.exports = sendEmail;
