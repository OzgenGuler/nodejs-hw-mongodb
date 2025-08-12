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

  try {
    const contact = await Contact.findById(id);
    console.log('Contact found:', contact);
    return contact;
  } catch (error) {
    console.error('Error in getContactById:', error);
    return null;
  }
};
