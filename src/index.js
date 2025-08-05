import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

dotenv.config();

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

const startServer = async () => {
  await initMongoConnection();
  setupServer();
};
startServer();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
