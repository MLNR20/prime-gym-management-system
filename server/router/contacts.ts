import express, { Request, response, Response } from "express";
import contactRepository from "../repository/contactRepository";
import LogsRepository from "../repository/logsRepository";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";

const contactRouter = express.Router();

//CREATE CONTACT
contactRouter.post("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const newContacts = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      contact_number: req.body.contact_number,
      role: req.body.role
    };
    const newlyCreatedContacts = await contactRepository.create(newContacts);
    res.status(200).send(newlyCreatedContacts);
  } catch (error) {
    console.log(error);
  }
});

// RETRIEVE CONTACTS LIST
contactRouter.get("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const contactsList = await contactRepository.findAll();
    res.json(contactsList);
  } catch (error) {
    console.log(error);
  }
});

// SOFT DELETE
contactRouter.patch("/:id", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const deletedContact = await contactRepository.softDelete(req.params.id!, true);
    if (!deletedContact) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting Contact" });
  }
});



// UPDATE CONTACTS
contactRouter.put("/:id", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const updatedContact = await contactRepository.update(
      req.params.id!,
      req.body
    );

    if (!updatedContact) {
      return response.status(404).json({ message: "Customer not found" });
    }
    res.json(updatedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating customer" });
  }
});

// DELETE CONTACTS
contactRouter.delete("/:id", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const deletedCustomer = await contactRepository.delete(req.params.id!);
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating customer" });
  }
});

export default contactRouter;
