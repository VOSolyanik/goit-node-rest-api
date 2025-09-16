import Joi from 'joi';

const PASSWORD_MIN_LENGTH = 8;

export const registerSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().min(PASSWORD_MIN_LENGTH).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().trim().required(),
});
