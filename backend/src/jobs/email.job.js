const { sendEmail } = require('../utils/email.util');
const config = require('../configs');

/**
 * Send email verification link
 */
const sendVerificationEmail = async (user, token) => {
  const email = typeof user === 'string' ? user : user.email;
  const name = typeof user === 'object' && user.fullName ? user.fullName : 'Learner';
  const verifyUrl = `${config.clientUrl}/verify-code?email=${encodeURIComponent(email)}&code=${token}`;
  const subject = `[EduLearn] Mã xác thực tài khoản của bạn: ${token}`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4361ee; margin: 0; font-size: 26px;">EduLearn</h2>
        <p style="color: #718096; margin-top: 5px;">Hệ thống học trực tuyến</p>
      </div>
      <hr style="border: none; border-top: 1px solid #edf2f7; margin: 20px 0;" />
      <p style="font-size: 16px; color: #2d3748;">Xin chào <strong>${name}</strong>,</p>
      <p style="font-size: 15px; color: #4a5568; line-height: 1.6;">
        Cảm ơn bạn đã đăng ký tài khoản tại <strong>EduLearn</strong>. Vui lòng sử dụng mã xác thực (OTP) dưới đây để kích hoạt tài khoản của bạn:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4361ee; background-color: #f0f4ff; padding: 14px 28px; border-radius: 10px; border: 2px dashed #4361ee;">
          ${token}
        </div>
      </div>
      <p style="font-size: 14px; color: #718096; text-align: center;">
        Hoặc bạn có thể bấm trực tiếp vào liên kết bên dưới để xác thực tự động:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${verifyUrl}" style="background-color: #4361ee; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Xác thực tài khoản ngay</a>
      </div>
      <p style="font-size: 13px; color: #a0aec0; margin-top: 25px; line-height: 1.5;">
        * Mã OTP có hiệu lực trong vòng 15 phút. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.
      </p>
    </div>
  `;
  return sendEmail(email, subject, html);
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
