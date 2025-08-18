import joi from 'joi';

export const createContactSchema = joi.object({
  name: joi.string().min(3).max(20).required(),
  phoneNumber: joi.string().min(3).max(20).required(),
  email: joi.string().email().min(3).max(20).required(),
  isFavourite: joi.boolean().optional(),
  contatctType: joi.string().valid('personal', 'work', 'other').required(),
});

export const updateContactSchema = joi
  .object({
    name: joi.string().min(3).max(20).optional(),
    phoneNumber: joi.string().min(3).max(20).optional(),
    email: joi.string().email().min(3).max(20).optional(),
    isFavourite: joi.boolean().optional(),
    contatctType: joi.string().valid('personal', 'work', 'other').optional(),
  })
  .min(1);
