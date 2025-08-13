import Contact from '../db/models/contacts.js';
import { isValidObjectId } from 'mongoose';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  console.log('Contacts found:', contacts);
  if (!contacts) {
    return null;
  }
  return contacts;
};
export const getContactById = async (id) => {
  if (!isValidObjectId(id)) return null;

  const contact = await Contact.findById(id);
  console.log('Contact found:', contact);
  if (!contact) {
    console.log(`Contact with ID ${id} not found`);
    return null;
  }
  console.log('Contact retrived successfully:', contact);
  return contact;
};

export const createContact = async (contactData) => {
  try {
    const result = await Contact.create(contactData);
    if (!result) {
      console.log('Contact created successfully:', result);
      return null;
    }
    return result;
  } catch (error) {
    console.error('Error creating contact:', error);
    return null;
  }
};

export const updateContact = async (id, contactData) => {
  if (!isValidObjectId(id)) return null;

  const result = await Contact.findByIdAndUpdate(
    {
      _id: id,
    },
    contactData,
    { runValidators: false }
  );
  if (!result) {
    console.log(`Contact with ID ${id} not found for update`);
    return null;
  }
  return result;
};

export const deleteContact = async (id) => {
  if (!isValidObjectId(id)) return null;

  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    console.log(`Contact with ID ${id} not found for deletion`);
    return null;
  }
  console.log('Contact deleted successfully:', result);
  return result;
};
