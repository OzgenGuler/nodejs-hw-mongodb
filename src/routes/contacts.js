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
// import { authorize } from '../middlewares/authorize.js';
import { upload } from '../middlewares/upload.js';
// import * as contactsController from '../controllers/contacts.js';
// import { ROLES } from '../constant/index.js';
// import { checkRoles } from '../middlewares/checkRoles.js';
// import mongoose from 'mongoose';
// import createError from 'http-errors';

const router = express.Router();
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

export default router;
