import express, { Response } from "express";
import unitOfWork from "../repository/unitOfWork";
import LogsRepository from "../repository/logsRepository";
import { CustomerService } from "../repository/services/customerService";
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";
import {
  validate,
  createCustomerValidation,
  updateCustomerValidation,
  updateSubscriptionValidation,
} from "../utils/validation";

const customerRouter = express.Router();
const customerService = new CustomerService(unitOfWork);

// CREATE
customerRouter.post("/", authMiddleware, createCustomerValidation, validate, async (request: RequestWithUser, response: Response) => {
  try {
    const newCustomer = {
      first_name: request.body.first_name,
      last_name: request.body.last_name,
      amount_paid: request.body.amount_paid,
      status: request.body.status,
      contact_no: request.body.contact_no,
      email: request.body.email,
      subscription_type: request.body.subscription_type,
      payment_option: request.body.payment_option,
    };

    const createNewEmployee = await customerService.create(newCustomer);

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} created new user at ${new Date().toISOString()}`,
    );

    return response.status(201).send(createNewEmployee);
  } catch (error) {
    console.log(error);
  }
});

// READ ALL
customerRouter.get("/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const customers = await customerService.getAll();
    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} accessed customers list at ${new Date().toISOString()}`,
    );

    response.status(200).json(customers);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching customers" });
  }
});

// RETRIEVE CUSTOMER
customerRouter.get("/show/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const limit = parseInt(request.query.limit as string) || 10;
    const page = parseInt(request.query.page as string) || 1;
    const search = (request.query.search as string) || "";

    const result = await customerService.search(page, limit, search);

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} accessed customers list at ${new Date().toISOString()}`,
    );

    response.status(200).json(result);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching customers" });
  }
});

// RETRIEVE CUSTOMER STATS
customerRouter.get("/retrieve-stats/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const stats = await customerService.getStats();
    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} accessed customers stats at ${new Date().toISOString()}`,
    );

    response.status(200).json(stats);
  } catch (error) {
    response.status(500).json({ message: error });
  }
});

// MONTHLY BREAKDOWN
customerRouter.get("/monthly-breakdown/", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const subMonths = await customerService.subscriptionsByMonth();
    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} accessed monthly breakdown at ${new Date().toISOString()}`,
    );

    response.status(200).json(subMonths);
  } catch (error) {
    response.status(500).json({ message: error });
  }
});

// RETRIEVE PAID SUBSCRIPTIONS
customerRouter.get("/status/paid", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const customers = await customerService.getPaidCustomers();
    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} accessed paid customers list at ${new Date().toISOString()}`,
    );

    response.status(200).json(customers);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching customers" });
  }
});


//RETRIEVE CUSTOMER LOCKER DETAILS
customerRouter.get("/available-users-lockers", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const customers = await customerService.getAvailableForLockers();
    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} accessed customers locker list at ${new Date().toISOString()}`,
    );

    response.status(200).json(customers);
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
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} accessed expired customers list at ${new Date().toISOString()}`,
    );

    response.status(200).json(customers);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching customers" });
  }
});

// READ ONE
customerRouter.get("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const customer = await customerService.getById(request.params.id!);
    if (!customer) return response.status(404).json({ message: "Customer not found" });

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} retrieved ${customer.first_name} ${customer.last_name}'s customer details at ${new Date().toISOString()}`,
    );

    response.status(200).json(customer);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error fetching customer" });
  }
});

// SOFT DELETE
customerRouter.patch("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const deletedCustomer = await customerService.softDelete(request.params.id!);
    if (!deletedCustomer) return response.status(404).json({ message: "Customer not found" });

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} removed ${deletedCustomer!.first_name} ${deletedCustomer!.last_name}'s from the gym members list at ${new Date().toISOString()}`,
    );

    response.status(204).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting customer" });
  }
});

// UPDATE SUBSCRIPTION IF EXPIRED
customerRouter.patch("/update-subscription/:id", authMiddleware, updateSubscriptionValidation, validate, async (request: RequestWithUser, response: Response) => {
  try {
    const id = request.params.id;
    if (!id) return response.status(400).json({ success: false, message: "Customer ID is required" });

    await customerService.renewSubscription(id.toString(), request.body.payment_option, request.body.subscription_type, request.body.amount_paid);

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} updated subscription for customer ${id} at ${new Date().toISOString()}`,
    );

    response.status(200).json({ success: true, message: "Subscription updated successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error updating customer" });
  }
});

// UPDATE
customerRouter.put("/:id", authMiddleware, updateCustomerValidation, validate, async (request: RequestWithUser, response: Response) => {
  try {
    const updatedCustomer = await customerService.update(request.params.id!, request.body);
    if (!updatedCustomer) return response.status(404).json({ message: "Customer not found" });

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} updated ${updatedCustomer!.first_name} ${updatedCustomer!.last_name}'s customer details at ${new Date().toISOString()}`,
    );

    response.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error updating customer" });
  }
});

// DELETE
customerRouter.delete("/:id", authMiddleware, async (request: RequestWithUser, response) => {
  try {
    const deletedCustomer = await customerService.delete(request.params.id!);
    if (!deletedCustomer) return response.status(404).json({ message: "Customer not found" });

    const admin = request.admin;
    await LogsRepository.logAction(
      admin!._id.toString(),
      `${admin!.first_name} ${admin?.last_name} deleted new user at ${new Date().toISOString()}`,
    );

    response.status(204).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error deleting customer" });
  }
});

export default customerRouter;