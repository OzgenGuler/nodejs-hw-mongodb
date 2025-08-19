import Contact from '../db/models/contacts.js';
import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  type,
  isFavorite,
}) => {
  const skip = (page - 1) * perPage;

  const filter = {};
  if (type) {
    filter.contactType = type;
  }
  if (isFavorite !== undefined) {
    filter.isFavorite = isFavorite === 'true';
  }

  const totalItems = await Contact.countDocuments();
  const sortOptions = { [sortBy]: sortOrder === 'desc' ? 1 : -1 };

  const contacts = await Contact.find()
    .skip(skip)
    .limit(perPage)
    .sort(sortOptions);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

// export const getAllContacts = async () => {
//   const contacts = await Contact.find();
//   console.log('Contacts found:', contacts);
//   if (!contacts) {
//     return null;
//   }
//   return contacts;
// };

export const getContactById = async (contactId) => {
  if (!isValidObjectId(contactId)) return null;

  const contact = await Contact.findById(contactId);
  console.log('Contact found:', contact);
  if (!contact) {
    console.log(`Contact with ID ${contactId} not found`);
    return null;
  }
  console.log('Contact retrived successfully:', contact);
  return contact;
};

export const createContact = async (contactData) => {
  try {
    const result = await Contact.create(contactData);
    // if (!result) {
    //   return null;
    // }
    console.log('Contact created successfully:', result);

    return result;
  } catch (error) {
    console.error('Error creating contact:', error.message);
    return error;
  }
};

export const updateContact = async (contactId, contactData) => {
  if (!isValidObjectId(contactId)) return null;

  const result = await Contact.findByIdAndUpdate(
    {
      _id: contactId,
    },
    contactData,
    { runValidators: false }
  );
  if (!result) {
    console.log(`Contact with ID ${contactId} not found for update`);
    return null;
  }
  return result;
};

export const deleteContact = async (contactId) => {
  if (!isValidObjectId(contactId)) {
    return createHttpError(400, `Invalid contact id`);
  }

  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    console.log(`Contact with ID ${contactId} not found for deletion`);
    // return null;
  }
  console.log('Contact deleted successfully:', result);
  return result;
};
