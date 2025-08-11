const nodemailer = require('nodemailer');

const sendVerificationCode = async (email, code) => {
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
              <h2 style="margin-top: 0; text-align: center;">Email Verification</h2>
              <p style="font-size: 16px; text-align: center;">Thanks for signing up with <strong>ZapBuy</strong>!</p>
              <p style="font-size: 16px; text-align: center;">Please use the verification code below to complete your registration:</p>
              <p style="font-size: 32px; font-weight: bold; text-align: center; color: #ffc107;">${code}</p>
              <p style="font-size: 14px; text-align: center; color: #777777;">This code will expire in 10 minutes.</p>
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
    to: email,
    subject: 'ZapBuy Email Verification Code',
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationCode;
