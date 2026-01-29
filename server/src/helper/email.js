const { model } = require("mongoose");
const nodemailer = require("nodemailer");
const { smtpUserName, smtpPassword } = require("../private");

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: smtpUserName,
    pass: smtpPassword,
  },
});


const emailWithNodeMailer = async (emailData) => {
  try {
    const mailOptions = {
      from: smtpUserName,
      to: emailData.email,
      subject: emailData.subject,

      html: emailData.html, // HTML version of the message
    }
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent : %s', info.response)
  }catch(error){
    console.error('error occured ',error)
  }

}

module.exports = emailWithNodeMailer