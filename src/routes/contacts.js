import express from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contactsSchemas.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'docs/swagger.json'), 'utf8')
);
const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Contacts API Documentation',
};
router.use(authenticate);

router.get('/', isValidId, ctrlWrapper(getContactsController));

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  isValidId,
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController)
);

router.patch(
  '/:contactId',
  upload.single('photo'),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController)
);

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument, options));

export default router;
