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
  return await transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log('Nodemailer Transport - SendMail - Error:' + error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });
};
export default sendMail;
