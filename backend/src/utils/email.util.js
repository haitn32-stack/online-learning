const nodemailer = require('nodemailer');
const config = require('../configs');

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML email body
 */
const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: config.smtp.from,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

module.exports = {
  sendEmail
};
