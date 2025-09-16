import * as authService from '../services/authService.js';
import HttpError from '../helpers/HttpError.js';

export const register = async (req, res, next) => {
  try {
    const { id, email, subscription } = await authService.registerUser(req.body);
    res.status(201).json({ id, email, subscription });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await authService.loginUser(req.body);
    if (!data) return next(HttpError(401, 'Email or password is wrong'));

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
