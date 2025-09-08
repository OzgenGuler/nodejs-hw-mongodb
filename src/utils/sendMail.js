import nodemailer from 'nodemailer';

import { SMTP } from '../constant/index.js';
import { env } from '../utils/env.js';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  secure: false,
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendEmail = async (options) => {
  try {
    const result = await transporter.sendMail(options);
    return result;
  } catch (error) {
    console.log('Email gönderme hatası', error);
    throw error;
  }
};

// export const sendEmail = async (to, subject, html) => {
//   const mailOptions = {
//     from: process.env.SMTP_FROM,
//     to,
//     subject,
//     html,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent:', info.response);
//     return info;
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send the email, please try again later.');
//   }
// };
