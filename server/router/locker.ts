import express,{request, response} from "express"
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";
import LogsRepository from "../repository/logsRepository";
import lockerRepository from "../repository/lockerRepository";
import lockerAssignmentRepository from "../repository/lockerAssignmentRepository";

const lockerRouter = express.Router();


//RETRIEVE LOCKER
lockerRouter.get("/", authMiddleware, async(request:RequestWithUser, response)=>{
    try
    {
        const retrieveLockers = await lockerRepository.findAll();

        const admin = request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} requested locker list at ${new Date().toISOString()}`);

        return response.status(200).json(retrieveLockers);
    }
    catch(error)
    {
        return response.status(500).json({message:"Locker retrieval failed"})
    }
})


//RETRIEVE ACTIVE LOCKER
lockerRouter.get("/find-active", authMiddleware, async(request: RequestWithUser, response)=>{
    try
    {
        const retrieveActiveLockers = await lockerRepository.findActiveLockerDocument(false);
        const admin = request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} requested awaited locker list at ${new Date().toISOString()}`);
        return response.status(200).json(retrieveActiveLockers);

    }
    catch(error)
    {
        console.log(error);
        return response.status(500).json({message:"Locker retrieval failed"})
    }
})



//RETRIVE LOCKER
lockerRouter.get(
  "/show/",
  authMiddleware,
  async (request: RequestWithUser, response) => {
    try {
      const limit = parseInt(request.query.limit as string) || 10;
      const page = parseInt(request.query.page as string) || 1;
      const search = (request.query.search as string)   || "";

      const result = await lockerRepository.search({
        page,
        limit,
        search,
        fields: ["locker_number"],
      });
      const admin = request.admin;
      await LogsRepository.logAction(
        admin!._id.toString(),
        `${admin!.first_name} ${admin?.last_name} accessed lockers list at ${new Date().toISOString()}`,
      );
      response.status(200).json(result);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Error fetching lockers" });
    }
  },
);

lockerRouter.get("/active-lockers", authMiddleware, async(request:RequestWithUser, response)=>{
    try
    {
        const locker = await lockerRepository.findAvailableLockers();
        const admin = request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} requested active locker details at ${new Date().toISOString()}`);
        
        return response.status(200).json(locker);
    }
    catch(error)
    {
        return response.status(500).json({message:"Locker retrieval failed"})
    }
})


//RETRIEVE LOCKER BY ID
lockerRouter.get("/:id", authMiddleware, async(request:RequestWithUser, response)=>{
    try
    {
        const locker = await lockerRepository.findById(request.params.id!);    

        if (!locker) {
            return response.status(404).json({ message: "Locker not found" });
        }

        const admin = request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} requested locker details at ${new Date().toISOString()}`);
        
        return response.status(200).json(locker);
    }
    catch(error)
    {
        return response.status(500).json({message:"Locker retrieval failed"})
    }
})


//CREATE LOCKER
lockerRouter.post("/", authMiddleware, async(request:RequestWithUser, response)=>{
    try
    {
        const lockerNumber = request.body.lockerNumber;

        if(!lockerNumber)
        {
            return response.status(500).json({message: "Locker number is required!"})
        }

        const admin = request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} created new locker at ${new Date().toISOString()}`);
        const newLocker = await lockerRepository.create({locker_number:lockerNumber});

        return response.status(201).json(newLocker);
    }
    catch(error)
    {
        return response.status(500).json({message:"Locker creation failed"})
    }
})

//UPDATE LOCKER
lockerRouter.put("/:id", authMiddleware, async(request:RequestWithUser, response)=>{
    try
    {
        const locker = await lockerRepository.findById(request.params.id!);    

        if (!locker) {
            return response.status(404).json({ message: "Locker not found" });
        }

        const admin = request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} updated locker at ${new Date().toISOString()}`);
        const updatedLocker = await lockerRepository.update(request.params.id!, request.body);

        return response.status(200).json(updatedLocker);
    }
    catch(error)
    {
        return response.status(500).json({message:"Locker cannot be updated"})
    }
})


//SOFT DELETE LOCKER
lockerRouter.patch("/:id", authMiddleware, async(request:RequestWithUser, response)=>{
    try
    {
        const locker = await lockerRepository.findById(request.params.id!);    

        if (!locker) {
            return response.status(404).json({ message: "Locker not found" });
        }

        const admin = request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} deleted locker at ${new Date().toISOString()}`);

        await lockerRepository.update(request.params.id!, {is_active: false})
        return response.status(204).json({message:"Locker successfully deleted"});
    }
    catch(error)
    {
        return response.status(500).json({message:"Locker cannot be deleted"})
    }
})

//HARD DELETE LOCKER
lockerRouter.delete("/:id", authMiddleware, async(request:RequestWithUser, response)=>{
    try
    {
        const locker = await lockerRepository.findById(request.params.id!);    

        if (!locker) {
            return response.status(404).json({ message: "Locker not found" });
        }

        const admin = request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} successfully deleted locker at ${new Date().toISOString()}`);

       await lockerRepository.delete(request.params.id!);
       return response.status(204).json({message:"Locker successfully deleted"});
    }
    catch(error)
    {
        return response.status(500).json({message:"Locker cannot be deleted"})
    }
})
export default lockerRouter;

