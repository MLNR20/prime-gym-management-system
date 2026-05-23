import logsRepository from "../logsRepository";
import { LockerRepository } from "../lockerRepository";
import { LockerAssignmentRepository } from "../lockerAssignmentRepository";
import { CustomerRepository } from "../customerRepository";

export class AttendanceService {
  private lockerRepository: LockerRepository;
  private lockerAssignmentRepository: LockerAssignmentRepository;
  private customerRepository: CustomerRepository;

  constructor( lockerRepository: LockerRepository, lockerAssignmentRepository: LockerAssignmentRepository, customerRepository: CustomerRepository) {
    this.lockerRepository = lockerRepository;
    this.lockerAssignmentRepository = lockerAssignmentRepository;
    this.customerRepository = customerRepository;
  }

  async createAttendance(locker_id: string, customer_id:string, time_in?: string) : Promise<boolean>
  {
    const verifyLockerId = await this.lockerRepository.findById(locker_id);
    const verifyCustomerId = await this.customerRepository.findById(customer_id);
    let timeIn = new Date();
    if (time_in) {
      const parsed = new Date(time_in);
      if (!isNaN(parsed.getTime())) {
        timeIn = parsed;
      }
    }
    const lockerStatus = "Borrowed";
    
    if(!verifyCustomerId) 
    {
      throw new Error(`Customer with id ${customer_id} not found`); 
    }
    
    if(!verifyLockerId) 
    {
      throw new Error(`Locker with id ${locker_id} not found`); 
    }

    if(verifyLockerId.is_active === false) 
    {
      throw new Error(`Deleted locker cannot ${locker_id} not create attendance`); 
    }

    const preventDuplicateBorrows : number = await this.lockerAssignmentRepository.preventDuplicateBorrows(String(verifyCustomerId._id), String(verifyLockerId._id));

    if(preventDuplicateBorrows > 0)
    {
      throw new Error(`Key/s can only be borrowed at a time`); 
    }
    await this.lockerAssignmentRepository.create({locker_id: String(verifyLockerId._id), customer_id: String(verifyCustomerId._id), time_in: String(timeIn) , time_out: "N/A", status: lockerStatus});
    return true;
  }


  async returnLockerKey(locker_assignment_id: string)
  {
    const locker_assignment = await this.lockerAssignmentRepository.findById(locker_assignment_id);
    if(!locker_assignment) throw new Error("Locker Key cannot be returned");
    await this.lockerAssignmentRepository.updateSpecificDetails(String(locker_assignment._id) ,{status: "Returned", time_out: String(new Date())})
  }
}