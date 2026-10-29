import { Response } from "express";
import unitOfWork from "../../repository/unitOfWork";
import { CustomerService } from "../../repository/services/customerService";
import LogsRepository from "../../repository/logsRepository";
import { RequestWithUser } from "../../middleware/types/express";

const customerService = new CustomerService(unitOfWork);

const logAdminAction = async (request: RequestWithUser, action: string) => {
  const admin = request.admin;
  await LogsRepository.logAction(
    admin!._id.toString(),
    `${admin!.first_name} ${admin?.last_name} ${action} at ${new Date().toISOString()}`,
  );
};

// CREATE
export const createCustomer = async (
  request: RequestWithUser,
  response: Response,
) => {
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

    const createdCustomer = await customerService.create(newCustomer);
    await logAdminAction(request, "created new user");
    return response.status(201).send(createdCustomer);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error creating customer" });
  }
};

// READ ALL
export const getAllCustomers = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const customers = await customerService.getAll();
    await logAdminAction(request, "accessed customers list");
    return response.status(200).json(customers);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error fetching customers" });
  }
};

// SEARCH / PAGINATE
export const searchCustomers = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const limit = parseInt(request.query.limit as string) || 10;
    const page = parseInt(request.query.page as string) || 1;
    const search = (request.query.search as string) || "";

    const result = await customerService.search(page, limit, search);
    await logAdminAction(request, "accessed customers list");
    return response.status(200).json(result);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error fetching customers" });
  }
};

// RETRIEVE CUSTOMER STATS
export const getCustomerStats = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const stats = await customerService.getStats();
    await logAdminAction(request, "accessed customers stats");
    return response.status(200).json(stats);
  } catch (error) {
    return response.status(500).json({ message: error });
  }
};

// MONTHLY BREAKDOWN
export const getMonthlyBreakdown = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const subMonths = await customerService.subscriptionsByMonth();
    await logAdminAction(request, "accessed monthly breakdown");
    return response.status(200).json(subMonths);
  } catch (error) {
    return response.status(500).json({ message: error });
  }
};

// RETRIEVE PAID SUBSCRIPTIONS
export const getPaidCustomers = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const customers = await customerService.getPaidCustomers();
    await logAdminAction(request, "accessed paid customers list");
    return response.status(200).json(customers);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error fetching customers" });
  }
};

// RETRIEVE CUSTOMERS AVAILABLE FOR LOCKERS
export const getCustomersAvailableForLockers = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const customers = await customerService.getAvailableForLockers();
    await logAdminAction(request, "accessed customers locker list");
    return response.status(200).json(customers);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error fetching customers" });
  }
};

// RETRIEVE EXPIRED SUBSCRIPTIONS
export const getExpiredCustomers = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const customers = await customerService.getExpiredCustomers();
    await logAdminAction(request, "accessed expired customers list");
    return response.status(200).json(customers);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error fetching customers" });
  }
};

// READ ONE
export const getCustomerById = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const customer = await customerService.getById(request.params.id!);
    if (!customer) {
      return response.status(404).json({ message: "Customer not found" });
    }

    await logAdminAction(
      request,
      `retrieved ${customer.first_name} ${customer.last_name}'s customer details`,
    );
    return response.status(200).json(customer);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error fetching customer" });
  }
};

// SOFT DELETE
export const softDeleteCustomer = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const deletedCustomer = await customerService.softDelete(request.params.id!);
    if (!deletedCustomer) {
      return response.status(404).json({ message: "Customer not found" });
    }

    await logAdminAction(
      request,
      `removed ${deletedCustomer.first_name} ${deletedCustomer.last_name}'s from the gym members list`,
    );
    return response.status(204).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error deleting customer" });
  }
};

// UPDATE SUBSCRIPTION IF EXPIRED
export const renewCustomerSubscription = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const id = request.params.id;
    if (!id) {
      return response
        .status(400)
        .json({ success: false, message: "Customer ID is required" });
    }

    await customerService.renewSubscription(
      id.toString(),
      request.body.payment_option,
      request.body.subscription_type,
      request.body.amount_paid,
    );

    await logAdminAction(request, `updated subscription for customer ${id}`);
    return response
      .status(200)
      .json({ success: true, message: "Subscription updated successfully" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error updating customer" });
  }
};

// UPDATE
export const updateCustomer = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const updatedCustomer = await customerService.update(request.params.id!, request.body);
    if (!updatedCustomer) {
      return response.status(404).json({ message: "Customer not found" });
    }

    await logAdminAction(
      request,
      `updated ${updatedCustomer.first_name} ${updatedCustomer.last_name}'s customer details`,
    );
    return response.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error updating customer" });
  }
};

// DELETE
export const deleteCustomer = async (
  request: RequestWithUser,
  response: Response,
) => {
  try {
    const deletedCustomer = await customerService.delete(request.params.id!);
    if (!deletedCustomer) {
      return response.status(404).json({ message: "Customer not found" });
    }

    await logAdminAction(request, "deleted new user");
    return response.status(204).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error deleting customer" });
  }
};
