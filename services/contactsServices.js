import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(data);
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(contactId) {
  const contacts = await readContacts();
  const contact = contacts.find((c) => c.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex((c) => c.id === contactId);

  if (index === -1) return null;

  const [contact] = contacts.splice(index, 1);
  await writeContacts(contacts);
  return contact;
}

async function addContact(name, email, phone) {
  const contacts = await readContacts();
  const newContact = {
	id: nanoid(),
	name,
	email,
	phone,
  };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

async function updateContact(contactId, data) {
  const contacts = await readContacts();
  const index = contacts.findIndex((c) => c.id === contactId);

  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...data };
  await writeContacts(contacts);
  return contacts[index];
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
