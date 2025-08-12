import express from 'express';
import cors from 'cors';
import contactsRouter from './routes/contacts.js';
import { env } from './utils/env.js';

const PORT = env('PORT') || 3000;

export function setupServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/contacts', contactsRouter);

  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`✅ | Server running on port ${PORT}`);
  });
}
