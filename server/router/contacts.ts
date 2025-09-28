import express, { Request, Response } from "express";
import contactRepository from "../repository/contactRepository";
import LogsRepository from "../repository/logsRepository";

const contactRouter = express.Router();

contactRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newContacts = {
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      amount_paid: request.body.amount_paid,
      status: request.body.status,
      contact_no: request.body.contact_no,
      subscription_type: request.body.subscription_type,
      payment_option: request.body.payment_option,
    };
  } catch (error) {
    console.log(error);
  }
});

export default contactRouter;
