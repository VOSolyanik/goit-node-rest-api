import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import path from 'path';
import fs from 'fs/promises';
import User from '../db/users.js';
import { createToken } from '../helpers/jwt.js';

const avatarsDir = path.resolve('public', 'avatars');

async function findOneUser(where, attributes = null) {
  return await User.findOne({ where, attributes });
}

async function registerUser(payload) {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const avatarURL = gravatar.url(payload.email, { s: '200', r: 'pg', d: 'mm' }, true);
  const user = await User.create({
    ...payload,
    password: hashedPassword,
    avatarURL
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
      subscription: user.subscription,
      avatarURL: user.avatarURL
    }
  };
}

async function logoutUser(userId) {
  const user = await findOneUser({ id: userId });
  if (!user) return null;

  user.token = null;
  await user.save();
  return user;
}

async function getUserById(userId) {
  const user = await findOneUser({ id: userId }, ['id', 'email', 'subscription', 'avatarURL']);
  return user;
}

async function updateUserAvatar(userId, file) {
  let avatarURL = null;
  if (file) {
    const newPath = path.join(avatarsDir, file.filename);
    await fs.rename(file.path, newPath);
    avatarURL = path.join('public', 'avatars', file.filename);
  }
  const user = await getUserById(userId);
  if (!user) return null;

  if (user.avatarURL) {
    const oldAvatarPath = path.join(process.cwd(), user.avatarURL);
    const fileExists = await fs.stat(oldAvatarPath).then(() => true).catch(() => false);
    if (fileExists) await fs.unlink(oldAvatarPath);
  }

  user.avatarURL = avatarURL;
  await user.save();
  return user;
}

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  updateUserAvatar,
  findOneUser
}
