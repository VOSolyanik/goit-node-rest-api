import Contact from "../db/contacts.js";

async function listContacts() {
  return await Contact.findAll();
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

export const updateContactStatus = async (contactId, { favorite }) => {
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
};
