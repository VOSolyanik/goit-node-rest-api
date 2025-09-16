import Contact from '../db/contacts.js';

async function listContacts({ limit, offset, favorite } = {}) {
  const where = {};
  if (favorite !== undefined) {
    where.favorite = favorite;
  }

  return await Contact.findAll({
    where,
    limit,
    offset
  });
}

async function getContactById(contactId) {
  return await Contact.findByPk(contactId);
}

async function addContact(name, email, phone) {
  const newContact = await Contact.create({ name, email, phone });
  return newContact;
}

async function removeContact(contactId) {
  const contact = await getContactById(contactId);
  if (!contact) return null;

  await contact.destroy();
  return contact;
}

async function updateContact(contactId, data) {
  const contact = await getContactById(contactId);
  if (!contact) return null;

  await contact.update(data);
  return contact;
}

async function updateContactStatus(contactId, { favorite }) {
  const contact = await getContactById(contactId);
  if (!contact) return null;

  await contact.update({ favorite });
  return contact;
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateContactStatus
};
