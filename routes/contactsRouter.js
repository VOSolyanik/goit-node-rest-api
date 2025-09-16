import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactStatus
} from "../controllers/contactsControllers.js";
import validateBody from "../middlewares/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js"

const contactsRouter = express.Router();

contactsRouter.get("", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, getOneContact);

contactsRouter.delete("/:id", authenticate, deleteContact);

contactsRouter.post("/", authenticate, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", authenticate, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", authenticate, validateBody(updateContactSchema), updateContactStatus);

export default contactsRouter;
