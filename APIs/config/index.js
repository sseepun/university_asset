module.exports = {
  frontendUrl: process.env.FRONTEND_URL,
  
  tokenSecret: process.env.TOKEN_SECRET,
  tokenLife: process.env.TOKEN_LIFE,
  
  tokenRefreshSecret: process.env.TOKEN_REFRESH_SECRET,
  tokenRefreshLife: process.env.TOKEN_REFRESH_LIFE,
  
  tokenVerifySecret: process.env.TOKEN_VERIFY_SECRET,
  tokenVerifyLife: process.env.TOKEN_VERIFY_LIFE,
  
  tokenPasswordSecret: process.env.TOKEN_PASSWORD_SECRET,
  tokenPasswordLife: process.env.TOKEN_PASSWORD_LIFE,

  emailFrom: process.env.EMAIL_FROM,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
};