import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import sequelize from "../db/sequelize.js";
import Contact from "../db/contacts.js";

const contactsPath = path.resolve("seed", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
}

async function seedContacts() {
  const contacts = await readContacts();

 // create table if not exists
  await Contact.sync({ force: true });

  // Insert; ignore duplicates by unique email
  await Contact.bulkCreate(
    contacts.map(({ name, email, phone }) => ({
      name,
      email,
      phone,
      favorite: false
    })),
    { ignoreDuplicates: true }
  );
}

try {
  await seedContacts();
  console.log("Contacts seeded successfully");
  process.exit(0);
} catch (err) {
  console.error("Seeding failed:", err.message);
  process.exit(1);
}