const nodemailer = require('nodemailer');
const config = require('../configs');

let transporter = null;

const smtpUser = config.smtp.user ? config.smtp.user.trim() : '';
const smtpPass = config.smtp.pass ? config.smtp.pass.replace(/\s+/g, '') : '';

if (smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: config.smtp.host || 'smtp.gmail.com',
    port: config.smtp.port || 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
  console.log(`[Email Service] Initialized for ${smtpUser}`);
} else {
  console.log(`[Email Service] Running in MOCK mode (missing credentials)`);
}

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML email body
 */
const sendEmail = async (to, subject, html) => {
  if (!transporter) {
    console.log(`\n================= [MOCK EMAIL SERVICE] =================`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (Preview): ${html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim()}`);
    console.log(`[Tip] Configure SMTP_USER and SMTP_PASS in backend/.env to send real emails.`);
    console.log(`========================================================\n`);
    return { messageId: 'mock-email-id' };
  }

  try {
    const info = await transporter.sendMail({
      from: config.smtp.from || `"Online Learning" <${smtpUser}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email Sent] Successfully delivered to ${to} (Message ID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`[Email Error] Failed to send to ${to}:`, error.message);
    return null;
  }
};

module.exports = {
  sendEmail
};
