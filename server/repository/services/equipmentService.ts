import { IEquipmentDocument } from "../../models/equipment";
import { IUnitOfWork } from "../unitOfWork";
import { SortOptions } from "../genericRepository";

const SEARCH_FIELDS = ["equipment_name"];

export class EquipmentService {
  private unitOfWork: IUnitOfWork;

  constructor(unitOfWork: IUnitOfWork) {
    this.unitOfWork = unitOfWork;
  }

  async getAll() {
    return this.unitOfWork.equipment.findAll();
  }

  async search(page: number, limit: number, search: string, sort: SortOptions = {}) {
    return this.unitOfWork.equipment.search({ page, limit, search, fields: SEARCH_FIELDS, ...sort });
  }

  async getById(id: string) {
    return this.unitOfWork.equipment.findById(id);
  }

  async create(data: Partial<IEquipmentDocument>) {
    return this.unitOfWork.equipment.create(data);
  }

  async update(id: string, data: Partial<IEquipmentDocument>) {
    return this.unitOfWork.equipment.update(id, data);
  }

  async delete(id: string) {
    return this.unitOfWork.equipment.delete(id);
  }
}
