import nodemailer from 'nodemailer';

import { SMTP } from '../constant/index.js';
import { env } from '../utils/env.js';

export const transporter = nodemailer.createTransport({
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

const sendMail = async (options) => {
  // return await transporter.sendMail(options, function (error, info) {
  try {
    const info = await transporter.sendMail(options);
    console.log('Message sent: ' + info.response);
    return info;
  } catch (error) {
    console.log('Nodemailer Transport - SendMail - Error:' + error);
    throw error;
  }
};
// };
export default sendMail;
