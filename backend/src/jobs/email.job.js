const { sendEmail } = require('../utils/email.util');
const config = require('../configs');

/**
 * Send email verification link
 */
const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${config.clientUrl}/verify-email?token=${token}`;
  const subject = 'Please Verify Your Email';
  const html = `
    <h1>Email Verification</h1>
    <p>Hello ${user.fullName},</p>
    <p>Please verify your email address by clicking the link below:</p>
    <a href="${verifyUrl}">Verify Email</a>
    <p>If you did not request this, please ignore this email.</p>
  `;
  return sendEmail(user.email, subject, html);
};

/**
 * Send password reset link
 */
const sendResetPasswordEmail = async (user, token) => {
  const resetUrl = `${config.clientUrl}/reset-password?token=${token}`;
  const subject = 'Password Reset Request';
  const html = `
    <h1>Reset Password</h1>
    <p>Hello ${user.fullName},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
  `;
  return sendEmail(user.email, subject, html);
};

/**
 * Send welcome email with credentials for accounts created by admin
 */
const sendAccountCreatedEmail = async (user, password) => {
  const loginUrl = `${config.clientUrl}/login`;
  const subject = 'Your Account Has Been Created';
  const html = `
    <h1>Welcome to Online Learning System</h1>
    <p>Hello ${user.fullName},</p>
    <p>An account has been created for you. Here are your login credentials:</p>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>Password:</strong> ${password}</p>
    <p>Please log in and change your password immediately.</p>
    <a href="${loginUrl}">Login Now</a>
  `;
  return sendEmail(user.email, subject, html);
};

/**
 * Send payment success notification
 */
const sendPaymentSuccessEmail = async (user, registration) => {
  const subject = 'Payment Successful - Registration Confirmed';
  const html = `
    <h1>Registration Confirmed</h1>
    <p>Hello ${user.fullName},</p>
    <p>Your payment for registration #${registration.id} was successful.</p>
    <p>Amount paid: $${registration.totalCost}</p>
    <p>Thank you for choosing our platform!</p>
  `;
  return sendEmail(user.email, subject, html);
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendAccountCreatedEmail,
  sendPaymentSuccessEmail
};
