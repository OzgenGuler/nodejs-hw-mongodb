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
// import mongoose from 'mongoose';
// import createError from 'http-errors';

const router = express.Router();
router.use(authenticate);

router.get('/', getContactsController);

router.get('/:contactId', ctrlWrapper(getContactByIdController));

// router.post('/', ctrlWrapper(createContactController));
router.post('/', validateBody(createContactSchema), createContactController);

// router.patch('/:contactId', ctrlWrapper(updateContactController));
router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  updateContactController
);

// router.delete('/:contactId', ctrlWrapper(deleteContactController));
router.delete('/:contactId', isValidId, deleteContactController);

export default router;
