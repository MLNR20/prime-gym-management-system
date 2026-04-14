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

    const admin = req.admin; 
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} registered ${newContacts!.first_name} ${newContacts!.last_name} at ${new Date().toISOString()}`);
    
    const newlyCreatedContacts = await contactRepository.create(newContacts);
    res.status(201).send(newlyCreatedContacts);
  } catch (error) {
    console.log(error);
  }
});

// RETRIEVE CONTACTS LIST
contactRouter.get("/", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const contactsList = await contactRepository.findAll();

    const admin = req.admin; 
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} retrieved contacts list at ${new Date().toISOString()}`);

    res.status(200).json(contactsList);
  } catch (error) {
    console.log(error);
  }
});


// RETRIEVE CONTACT LIST
contactRouter.get("/:id", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const contactsList = await contactRepository.findById(req.params.id!);

    const admin = req.admin; 
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} retrieved contact at ${new Date().toISOString()}`);

    res.status(200).json(contactsList);
  } catch (error) {
    console.log(error);
  }
});

// SOFT DELETE
contactRouter.patch("/:id", authMiddleware, async (req: RequestWithUser, res: Response) => {
  try {
    const deletedContact = await contactRepository.softDelete(req.params.id!, true);

    const admin = req.admin; 
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} removed a contact from contacts list at ${new Date().toISOString()}`);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(204).json({ message: "Contact deleted successfully" });
  } catch (error) {
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

    const admin = req.admin; 
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} updated ${req.body.first_name} ${req.body.last_name} from contacts list at ${new Date().toISOString()}`);

    res.status(200).json(updatedContact);
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
    const admin = req.admin; 
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} removed contact from contacts list at ${new Date().toISOString()}`);
    res.status(204).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating customer" });
  }
});

export default contactRouter;
