import express from "express";
import CustomerRepository from "../repository/customerRepository";
import LogsRepository from "../repository/logsRepository";
import {CustomerService} from "../repository/services/customerService";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";
import customerRepository from "../repository/customerRepository";
const customerRouter = express.Router();
const customerService = new CustomerService(CustomerRepository);

// CREATE
customerRouter.post("/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const newCustomer = {
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      amount_paid: request.body.amount_paid,
      status: request.body.status,
      contact_no:request.body.contact_no,
      subscription_type: request.body.subscription_type,
      payment_option: request.body.payment_option
    };

    const createNewEmployee = await CustomerRepository.create(newCustomer);
    const admin = request.admin; 
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} created new user at ${new Date().toISOString()}`);

    return response.status(200).send(createNewEmployee);

  } catch (error) {
    console.log(error);
  }
});

// READ ALL
customerRouter.get("/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const customers = await CustomerRepository.findAll();
    const admin = request.admin; 
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} accessed customers list at ${new Date().toISOString()}`);

    response.json(customers);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching customers" });
  }
});

// RETRIEVE PAID SUBSCRIPTIONS
customerRouter.get("/status/paid", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const customers = await customerService.getPaidCustomers();
    const admin = request.admin; 
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} accessed paid customers list at ${new Date().toISOString()}`);

    response.json(customers);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching customers" });
  }
});


// RETRIEVE EXPIRED SUBSCRIPTIONS
customerRouter.get("/status/expired", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const customers = await customerService.getExpiredCustomers();
    const admin = request.admin; 
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} accessed expired customers list at ${new Date().toISOString()}`);
    response.json(customers);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching customers" });
  }
});

// READ ONE
customerRouter.get("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const customer = await CustomerRepository.findById(request.params.id!);
    
    if (!customer) {
      return response.status(404).json({ message: "Customer not found" });
    }

    const admin = request.admin; 
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} retrieved ${customer.first_name} ${customer.last_name}'s customer details at ${new Date().toISOString()}`);

    response.json(customer);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching customer" });
  }
});

// SOFT DELETE

customerRouter.patch("/:id", async (request, response) => {
  try {
    const deletedCustomer = await customerRepository.softDelete(request.params.id, true);
    if (!deletedCustomer) {
      return response.status(404).json({ message: "Customer not found" });
    }
    response.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting customer" });
  }
});


// UPDATE
customerRouter.put("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const updatedCustomer = await CustomerRepository.update(
      request.params.id!,
      request.body
    );

    const admin = request.admin; 
    await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} updated ${updatedCustomer!.first_name} ${updatedCustomer!.first_name}'s customer details at ${new Date().toISOString()}`);

    if (!updatedCustomer) {
      return response.status(404).json({ message: "Customer not found" });
    }
    response.json(updatedCustomer);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error updating customer" });
  }
});

// DELETE
customerRouter.delete("/:id", authMiddleware, async (request, response) => {
  try {
    const deletedCustomer = await CustomerRepository.delete(request.params.id!);
    if (!deletedCustomer) {
      return response.status(404).json({ message: "Customer not found" });
    }
    response.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting customer" });
  }
});

export default customerRouter;