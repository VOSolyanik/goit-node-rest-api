import bcrypt from 'bcryptjs';
import User from '../db/users.js';
import { createToken } from '../helpers/jwt.js';

async function findOneUser(where) {
  return await User.findOne({ where });
}

async function registerUser(payload) {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    ...payload,
    password: hashedPassword
  });
  return user;
}

async function loginUser(payload) {
  const { email, password } = payload;
  const user = await findOneUser({ email: email.toLowerCase() });
  if (!user) return null;

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return null;

  const tokenPayload = { id: user.id, email: user.email };
  const token = createToken(tokenPayload);

  user.token = token;
  await user.save();
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      subscription: user.subscription
    }
  };
}

async function logoutUser(userId) {
  const user = await User.findByPk(userId);
  if (!user) return null;

  user.token = null;
  await user.save();
  return user;
}

async function getUserById(userId) {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'email', 'subscription']
  });
  return user;
}

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  findOneUser
}
