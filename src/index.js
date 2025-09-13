import { setupServer } from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { transporter } from './utils/sendMail.js';
import { TEMP_UPLOAD_DIR } from './constant/index.js';
import { verifyTransport } from './utils/verifyTransport.js';
const startServer = async () => {
  try {
    await initMongoConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await verifyTransport(transporter);
    setupServer();
  } catch (error) {
    console.error('Error during server startup:', error);
    process.exit(1); // Exit the process with an error code
  }
};

startServer();
