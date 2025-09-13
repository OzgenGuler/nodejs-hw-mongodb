export const verifyTransport = async (transporter) => {
  transporter.verify(function (error, success) {
    success;
    if (error) {
      console.log('❌ | Nodemailer | Connection error:', error.response);
      console.error(error);
    } else {
      console.log('✅ | Nodemailer | Server is ready to take our messages');
    }
  });
};
