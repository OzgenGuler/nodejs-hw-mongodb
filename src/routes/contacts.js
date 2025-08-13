import express from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import mongoose from 'mongoose';
import createError from 'http-errors';

const router = express.Router();
router.param('contactId', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createError(400, 'Invalid contact ID format'));
  }
  next();
});
router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(createContactController));
router.patch('/:contactId', ctrlWrapper(updateContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;

// router.get('/', async (req, res) => {
//   try {
//     const contacts = await getAllContacts();
//     res.status(200).json({
//       status: 200,
//       message: 'Successfully found contacts',
//       data: contacts,
//     });
//   } catch (error) {
//     console.error('Error fetching contacts:', error);
//     res.status(500).json({ status: 500, message: 'Internal Server Error' });
//   }
// });

// router.get('/:contactId', async (req, res) => {
//   const { contactId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(contactId)) {
//     return res.status(400).json({ message: 'Invalid contact ID format' });
//   }

//   try {
//     const contact = await getContactById(contactId);

//     if (!contact) {
//       return res.status(404).json({ message: 'Contact not found' });
//     }
//     res.status(200).json({
//       status: 200,
//       message: `Successfully found contact with id ${contactId}!`,
//       data: contact,
//     });
//   } catch (error) {
//     console.error('Error fetching contact by ID:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// router.post('/', async (req, res) => {
//   try {
//     const { name, phoneNumber, email, isFavourite, contactType } = req.body;

//     if (!name || !phoneNumber) {
//       return res.status(400).json({
//         message: 'Name and phone number are required.',
//       });
//     }

//     const newContact = await Contact.create({
//       name,
//       phoneNumber,
//       email,
//       isFavourite,
//       contactType,
//     });

//     res.status(201).json({
//       status: 201,
//       message: 'Contact created successfully',
//       data: newContact,
//     });
//   } catch (error) {
//     console.error('Error creating contact:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// router.put('/:contactId', async (req, res) => {
//   const { contactId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(contactId)) {
//     return res.status(400).json({ message: 'Invalid contact ID format' });
//   }

//   try {
//     const updatedContact = await Contact.findByIdAndUpdate(
//       contactId,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updatedContact) {
//       return res.status(404).json({ message: 'Contact not found' });
//     }

//     res.status(200).json({
//       status: 200,
//       message: 'Contact updated successfully!',
//       data: updatedContact,
//     });
//   } catch (error) {
//     console.error('Error updating contact:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// router.delete('/:contactId', async (req, res) => {
//   const { contactId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(contactId)) {
//     return res.status(400).json({ message: 'Invalid contact ID format' });
//   }

//   try {
//     const deletedContact = await Contact.findByIdAndDelete(contactId);

//     if (!deletedContact) {
//       return res.status(404).json({ message: 'Contact not found' });
//     }

//     res.status(200).json({
//       status: 200,
//       message: 'Contact deleted successfully!',
//     });
//   } catch (error) {
//     console.error('Error deleting contact:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
