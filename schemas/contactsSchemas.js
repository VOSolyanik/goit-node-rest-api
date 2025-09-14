import Joi from "joi";

const NAME_MAX_LENGTH = 30;
const NAME_MIN_LENGTH = 3;
const PHONE_MIN_LENGTH = 5;
const PHONE_MAX_LENGTH = 20;

export const createContactSchema = Joi.object({
 	name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(PHONE_MIN_LENGTH).max(PHONE_MAX_LENGTH).required(),
})

export const updateContactSchema = Joi.object({
  name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
  email: Joi.string().email(),
  phone: Joi.string().min(PHONE_MIN_LENGTH).max(PHONE_MAX_LENGTH),
  favorite: Joi.boolean(),
})