import express, { Request, response, Response } from "express";
import contactRepository from "../repository/contactRepository";
import LogsRepository from "../repository/logsRepository";

const contactRouter = express.Router();

//CREATE CONTACT
contactRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newContacts = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      contact_no: req.body.contact_no,
      role: req.body.subscription_type,
    };

    const newlyCreatedContacts = await contactRepository.create(newContacts);
    response.status(200).send(newlyCreatedContacts);
  } catch (error) {
    console.log(error);
  }
});

// RETRIEVE CONTACTS LIST
contactRouter.get("/", async (req: Request, res: Response) => {
  try {
    const contactsList = await contactRepository.findAll();
    response.status(200).send(contactsList);
  } catch (error) {
    console.log(error);
  }
});

// SOFT DELETE
contactRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const deletedContact = await contactRepository.softDelete(req.params.id, true);
    if (!deletedContact) {
      return response.status(404).json({ message: "Customer not found" });
    }
    response.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting Contact" });
  }
});



// UPDATE CONTACTS
contactRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const updatedContact = await contactRepository.update(
      req.params.id!,
      req.body
    );

    if (!updatedContact) {
      return response.status(404).json({ message: "Customer not found" });
    }
    response.json(updatedContact);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error updating customer" });
  }
});

// DELETE CONTACTS
contactRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedCustomer = await contactRepository.delete(req.params.id!);
    if (!deletedCustomer) {
      return response.status(404).json({ message: "Contact not found" });
    }
    response.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error updating customer" });
  }
});

export default contactRouter;
