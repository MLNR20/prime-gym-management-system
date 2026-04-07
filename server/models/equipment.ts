import { Schema, model, Document } from "mongoose";

export interface IEquipment {
  equipment_name: String;
  equipment_status: String
  createdAt: Date;
  updatedAt: Date;
}

export interface IEquipmentDocument extends IEquipment, Document {}

const equipmentSchema = new Schema<IEquipmentDocument>(
  {
    equipment_name: {type: String, trime:true},
    equipment_status: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "Equipment" }
);

const Equipment = model<IEquipmentDocument>("equipment", equipmentSchema);

export default Equipment;
