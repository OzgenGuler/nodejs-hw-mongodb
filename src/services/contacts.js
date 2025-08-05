import Contact from '../db/Contact.js';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();

    return contacts;
  } catch (error) {
    console.error('❌ Service error - getContacts:', error);
    throw new Error('Failed to fetch contacts from database');
  }
};
export const getContactById = async (id) => {
  return await Contact.findById(id);
};
