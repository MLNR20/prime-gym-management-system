import { Schema, model, Document } from "mongoose";

export interface ICustomer {
  first_name: string;
  last_name: string;
  amount_paid: number;
  contact_no:string;
  status: string;
  payment_option: string;
  subscription_type: string;
  payment_Date:Date;
  expiration_Date:Date;
  createdAt: Date;
  updatedAt: Date
}

enum SubscriptionStatus {
  Paid = "Paid",
  Expired = "Expired"
}

enum SubscriptionType {
  daily = "Daily Exercise",
  regular = "Monthly Subscription",
  coaching = "Coaching Subscription",
  trainingRegular = "Monthly with Coaching"
}

enum paymentModel
{
  gcash = "GCash",
  cash = "Cash"
}

export interface ICustomerDocument extends ICustomer, Document {}


const customerSchema = new Schema<ICustomerDocument>(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    amount_paid:{type:Number, required:true},
    contact_no:{type:String, required:true, trim:true},
    status: {type:String, enum: Object.values(SubscriptionStatus),  default:SubscriptionStatus.Paid,required:true},
    payment_option:{type:String, enum:Object.values(paymentModel), trim:true },
    subscription_type: {type:String, enum:Object.values(SubscriptionType), default: SubscriptionType.regular, trim:true, required:true},
    payment_Date:{type:Date, default: Date.now, required:true, trim:true},
    expiration_Date: {type:Date, default: () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
       }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: {type:Date, default: Date.now}
  },
  { collection: "Customer" }
);

const Customer = model<ICustomerDocument>("Customer", customerSchema);

export default Customer;
