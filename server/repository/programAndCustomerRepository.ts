import ProgramAndCustomers from "../models/programandcustomer";
import Customer from "../models/customer";

const ProgramAndCustomerRepository = {
  async findByProgram(programId: string) {
    const assignments = await ProgramAndCustomers.find({ program_id: programId }).lean();
    const customerIds = assignments.map((a: any) => a.customer_id);

    if (customerIds.length === 0) return [];

    const customers = await Customer.find({ _id: { $in: customerIds }, isDeleted: false }).lean();
    return customers;
  },

  async assign(programId: string, customerId: string) {
    const exists = await ProgramAndCustomers.findOne({ program_id: programId, customer_id: customerId });
    if (exists) return exists;

    const doc = await ProgramAndCustomers.create({ program_id: programId, customer_id: customerId });
    return doc;
  },

  async unassign(programId: string, customerId: string) {
    const res = await ProgramAndCustomers.deleteOne({ program_id: programId, customer_id: customerId });
    return res.deletedCount && res.deletedCount > 0;
  },
};

export default ProgramAndCustomerRepository;
