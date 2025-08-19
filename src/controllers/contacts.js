import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContactsController = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavorite,
    } = req.query;

    const data = await getAllContacts({
      page: parseInt(page),
      perPage: parseInt(perPage),
      sortBy,
      sortOrder,
      type,
      isFavorite,
    });
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      next(createHttpError(404, 'Contact not found'));
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  const contactData = req.body;
  console.log('Creating contact with data:', contactData);

  try {
    const result = await createContact(contactData);
    if (!result) {
      return next(createHttpError(400, 'Failed to create contact'));
    }
    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error creating contact:', error.message);
    next(createHttpError(400, 'Contact creation failed'));
  }
  console.log('REQ BODY:', req.body);
};
export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const pContact = await updateContact(contactId, req.body);
    if (!pContact) {
      next(createHttpError(404, 'Contact not found'));
    }
    res.status(200).json({
      status: 200,
      message: `Successfully updated contact with id ${contactId}!`,
      data: pContact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  await deleteContact(contactId);
  try {
    return res.status(204).json({
      status: 204,
      message: `Successfully deleted contact with id ${contactId}!`,
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    next(error);
  }
};
