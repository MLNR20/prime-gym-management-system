import { ILockerDocument } from "../../models/locker";
import { IUnitOfWork } from "../unitOfWork";

const SEARCH_FIELDS = ["locker_number"];

export class LockerService {
  private unitOfWork: IUnitOfWork;

  constructor(unitOfWork: IUnitOfWork) {
    this.unitOfWork = unitOfWork;
  }

  async getAll() {
    return this.unitOfWork.lockers.findAll();
  }

  async getByActiveStatus(is_active: boolean) {
    return this.unitOfWork.lockers.findActiveLockerDocument(is_active);
  }

  async getAvailable() {
    return this.unitOfWork.lockers.findAvailableLockers();
  }

  async search(page: number, limit: number, search: string) {
    return this.unitOfWork.lockers.search({ page, limit, search, fields: SEARCH_FIELDS });
  }

  async getById(id: string) {
    return this.unitOfWork.lockers.findById(id);
  }

  async create(locker_number: number) {
    return this.unitOfWork.lockers.create({ locker_number });
  }

  async update(id: string, data: Partial<ILockerDocument>) {
    return this.unitOfWork.lockers.update(id, data);
  }

  async deactivate(id: string) {
    return this.unitOfWork.lockers.update(id, { is_active: false });
  }

  async delete(id: string) {
    return this.unitOfWork.lockers.delete(id);
  }
}
