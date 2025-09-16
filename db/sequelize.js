import { Sequelize } from 'sequelize';

const url = process.env.DB_URL;
if (!url) {
  throw new Error('DB_URL is not set');
}

const sequelize = new Sequelize(url, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      // If Render uses a managed cert chain, this avoids local “self-signed” errors.
      rejectUnauthorized: false,
    },
  },
});

try {
  await sequelize.authenticate();
  console.log('Database connection successful');
} catch (error) {
  console.log(`Database connection error: ${error.message}`);
  process.exit(1);
}

export default sequelize;
