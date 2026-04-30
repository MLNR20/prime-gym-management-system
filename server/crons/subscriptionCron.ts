import cron from "node-cron";
import Customer from "../models/customer";

export const subscriptionCron = () => {


   const updateSubscriptions = async () => {
    console.log("Running subscription status update...");
    try {
      const result = await Customer.updateMany(
        {
          expiration_Date: { $lt: new Date() },
          status: { $ne: "Expired" },
        },
        { $set: { status: "Expired" } }
      );
      console.log(`${result.modifiedCount} customers expired.`);
    } catch (error) {
      console.error(error);
    }
  };


  updateSubscriptions();

  cron.schedule("0 0 * * *", updateSubscriptions);
};