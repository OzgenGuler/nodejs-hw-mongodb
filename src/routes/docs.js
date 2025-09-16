import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const docsRouter = Router();

// Load swagger.json
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'docs/swagger.json'), 'utf8')
);

// Swagger UI options
const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Contacts API Documentation',
};

docsRouter.use('/api-docs', swaggerUi.serve);
docsRouter.get('/api-docs', swaggerUi.setup(swaggerDocument, options));

export default docsRouter;
