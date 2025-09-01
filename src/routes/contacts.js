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
import { authorize } from '../middlewares/authorize.js';
import { upload } from '../middlewares/upload.js';
import * as contactsController from '../controllers/contacts.js';
// import mongoose from 'mongoose';
// import createError from 'http-errors';

const router = express.Router();
router.use(authenticate);

router.get('/', authorize('admin', 'moderator'), getContactsController);

router.get('/:contactId', ctrlWrapper(getContactByIdController));

// router.post('/', ctrlWrapper(createContactController));
router.post(
  '/',
  upload.single('photo'),
  authorize('admin', 'moderator', 'user'),
  validateBody(createContactSchema),

  contactsController.createContactController
);

// router.patch('/:contactId', ctrlWrapper(updateContactController));
router.patch(
  '/:contactId',
  upload.single('photo'),

  authorize('admin', 'moderator'),
  isValidId,
  validateBody(updateContactSchema),
  contactsController.updateContactController
);

// router.delete('/:contactId', ctrlWrapper(deleteContactController));
router.delete(
  '/:contactId',
  authorize('admin'),
  isValidId,
  deleteContactController
);

export default router;
