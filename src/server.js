// import express from 'express';
// import cors from 'cors';
// import contactsRouter from './routes/contacts.js';
// import { env } from './utils/env.js';
// import { notFoundHandler } from './middlewares/notFoundHandler.js';
// import { errorHandler } from './middlewares/errorHandler.js';
// import authRouter from './routes/auth.js';
// import cookieParser from 'cookie-parser';

// const PORT = env('PORT') || 3000;

// export function setupServer() {
//   const app = express();

//   app.use(express.json());
//   app.use(cors());
//   app.use(cookieParser());

//   app.use('/contacts', contactsRouter);
//   app.use('/auth', authRouter);
//   app.use('*', notFoundHandler);
//   app.use(errorHandler);

//   app.listen(PORT, () => {
//     console.log(`✅ | Server running on port ${PORT}`);
//   });
// }
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import contactsRouter from './routes/contacts.js';
// import { authenticate } from './middlewares/authenticate.js';
import { upload } from './middlewares/upload.js';
import { authorize } from './middlewares/authorize.js';

export const setupServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;

  // Middleware
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());

  // Routes
  app.use('/auth', authRouter);
  app.use('/contacts', authorize('admin', 'moderator'), contactsRouter);

  // Error handler
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';

    res.status(status).json({
      status,
      message,
    });
  });

  app.post('/contacts', upload.single('avatar'), (req, res) => {
    // Handle the uploaded file and other form data here
    res.json({ message: 'File uploaded successfully', file: req.file });
  });

  app.post('/contacts', upload.array('photo', 10), (req, res) => {
    res.json({ message: 'Files uploaded successfully', files: req.files });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};
