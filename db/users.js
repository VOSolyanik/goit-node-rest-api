import sequelize from './sequelize.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    required: [true, 'Set password for user'],
  },
  email: {
    type: DataTypes.STRING,
    required: [true, 'Email is required'],
    unique: true,
    validate: { isEmail: true },
  },
  subscription: {
    type: DataTypes.STRING,
    enum: ['starter', 'pro', 'business'],
    defaultValue: 'starter',
  },
  avatarURL: {
    type: DataTypes.STRING,
  },
  token: {
    type: DataTypes.STRING,
  },
});

// User.sync({ alter: true })

export default User;
