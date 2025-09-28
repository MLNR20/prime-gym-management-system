import { Schema, model, Document } from "mongoose";

export interface IContacts extends Document {
  contact_name: string;
  contact_number: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: Boolean;
}

export interface IContactsDocument extends IContacts, Document {}

const contactSchema = new Schema<IContacts>(
  {
    contact_name: { type: String, required: true, trim: true },
    contact_number: { type: String, required: true, trim: true },
    role: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now},
    isDeleted: {type:Boolean, default: false}
  },
  { collection: "Contacts" }
);

const Contacts = model<IContacts>("Contact", contactSchema);
export default Contacts;
