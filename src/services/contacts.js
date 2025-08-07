import contact from '../db/models/contact.js';

export const getAllContacts = async () => {
  return await contact.find();
};

export const getContactById = async (id) => {
  return await contact.findById(id);
};
