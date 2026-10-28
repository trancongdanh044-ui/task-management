const nodemailer = require('nodemailer');

module.exports.sendMail = async (email, subject, html) => {
  const nodemailer = require("nodemailer");

  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_PASSWORD,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: email, // list of recipients
      subject: subject, // subject line
      // text: "Hello world?", // plain text body
      html: html, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}