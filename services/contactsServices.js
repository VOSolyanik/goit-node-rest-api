import Contact from '../db/contacts.js';

async function listContacts({ limit, offset, favorite } = {}, userId) {
  const where = { owner: userId };
  if (favorite !== undefined) {
    where.favorite = favorite;
  }

  return await Contact.findAll({
    where,
    limit,
    offset
  });
}

async function getContactById(contactId, userId) {
  console.log(`Getting contact with ID: ${contactId} for user: ${userId}`);
  return await Contact.findOne({ where: { id: contactId, owner: userId }, attributes: { exclude: ['owner'] } });
}

async function addContact({ name, email, phone }, userId) {
  const newContact = await Contact.create({ name, email, phone, owner: userId });
  return newContact;
}

async function removeContact(contactId, userId) {
  const contact = await getContactById(contactId, userId);
  if (!contact) return null;

  await contact.destroy();
  return contact;
}

async function updateContact(contactId, data, userId) {
  const contact = await getContactById(contactId, userId);
  if (!contact) return null;

  await contact.update(data);
  return contact;
}

async function updateContactStatus(contactId, { favorite }, userId) {
  const contact = await getContactById(contactId, userId);
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
