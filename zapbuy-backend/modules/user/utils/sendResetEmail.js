const nodemailer = require('nodemailer');

const sendResetEmail = async (to, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlContent = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 5px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background-color: #212529; padding: 20px; text-align: center;">
                <img src="https://res.cloudinary.com/dy8pyq0if/image/upload/v1754585513/ZapBuy_Logo_p69ibf.png" alt="ZapBuy Logo" width="120" style="display: block; margin: 0 auto;" />
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px; font-family: Arial, sans-serif; color: #333333;">
                <h2 style="margin-top: 0; text-align: center;">Reset Your Password</h2>
                <p style="font-size: 16px; text-align: center;">We received a request to reset your <strong>ZapBuy</strong> password.</p>
                <p style="font-size: 16px; text-align: center;">Click the button below to proceed:</p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" target="_blank" style="background-color: #ffc107; color: #212529; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
                    Reset Password
                  </a>
                </div>

                <p style="font-size: 14px; text-align: center; color: #777777;">If the button doesn’t work, copy and paste the following link into your browser:</p>
                <p style="font-size: 14px; word-break: break-all; text-align: center; color: #555555;"><a href="${resetLink}" target="_blank" style="color: #007bff;">${resetLink}</a></p>
                <p style="font-size: 14px; text-align: center; color: #777777;">This link will expire in 10 minutes.</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f1f1f1; padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 12px; color: #666666;">
                <img src="https://res.cloudinary.com/dy8pyq0if/image/upload/v1754585443/ZapBuy_favicon_gtr0wk.png" alt="ZapBuy Favicon" width="24" style="vertical-align: middle; margin-right: 8px;" />
                &copy; 2025 ZapBuy. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  `;
  
  const mailOptions = {
    from: `"ZapBuy" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset Request',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
