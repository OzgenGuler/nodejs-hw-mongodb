import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import contactsRouter from './routes/contacts.js';
import docsRouter from './routes/docs.js';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import yaml from 'js-yaml';
import { upload } from './middlewares/upload.js';
import { UPLOAD_DIR } from './constant/index.js';

export const setupServer = () => {
  const app = express();
  const port = process.env.PORT || 3000;
  const swaggerDocument = yaml.load(path.join(process.cwd(), 'swagger.yaml'));
  // Middleware
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('✅ Swagger UI mounted at /api-docs');

  // Routes
  app.use(docsRouter);

  // Routes
  app.use('/auth', authRouter);
  app.use(
    '/contacts',
    // checkRoles(ROLES.ADMIN, ROLES.MODERATOR),
    contactsRouter
  );

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
