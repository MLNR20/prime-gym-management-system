import express,{Request,response,Response} from "express"
import { authMiddleware } from "../middleware/middleware";
import { RequestWithUser } from "../middleware/types/express";
import LogsRepository from "../repository/logsRepository";
import lockerRepository from "../repository/lockerRepository";

const lockerRouter = express.Router();


//RETRIEVE LOCKER
lockerRouter.get("/", authMiddleware, async(Request:RequestWithUser, Response)=>{
    try
    {
        const retrieveLockers = await lockerRepository.findAll();
        return Response.status(200).json(retrieveLockers);
    }
    catch(error)
    {
        return Response.status(500).json({message:"Locker retrieval failed"})
    }
})


//RETRIEVE LOCKER BY ID
lockerRouter.get("/:id", authMiddleware, async(Request:RequestWithUser, Response)=>{
    try
    {
        const locker = await lockerRepository.findById(Request.params.id!);    

        if (!locker) {
            return response.status(404).json({ message: "Locker not found" });
        }

        return Response.status(200).json(locker);
    }
    catch(error)
    {
        return Response.status(500).json({message:"Locker retrieval failed"})
    }
})


//CREATE LOCKER
lockerRouter.post("/", authMiddleware, async(Request:RequestWithUser, Response)=>{
    try
    {
        const lockerNumber = Request.body.lockerNumber;

        if(!lockerNumber)
        {
            return Response.status(500).json({message: "Locker number is required!"})
        }

        const admin = Request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} created new locker at ${new Date().toISOString()}`);
        const newLocker = await lockerRepository.create({locker_number:lockerNumber});

        return Response.status(201).json(newLocker);
    }
    catch(error)
    {
        return Response.status(500).json({message:"Locker creation failed"})
    }
})

//UPDATE LOCKER
lockerRouter.put("/:id", authMiddleware, async(Request:RequestWithUser, Response)=>{
    try
    {
        const locker = await lockerRepository.findById(Request.params.id!);    

        if (!locker) {
            return response.status(404).json({ message: "Locker not found" });
        }

        const admin = Request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} updated locker at ${new Date().toISOString()}`);
        const updatedLocker = await lockerRepository.update(Request.params.id!, Request.body);

        return Response.status(200).json(updatedLocker);
    }
    catch(error)
    {
        return Response.status(500).json({message:"Locker cannot be updated"})
    }
})


//SOFT DELETE LOCKER
lockerRouter.patch("/:id", authMiddleware, async(Request:RequestWithUser, Response)=>{
    try
    {
        const locker = await lockerRepository.findById(Request.params.id!);    

        if (!locker) {
            return response.status(404).json({ message: "Locker not found" });
        }

        const admin = Request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} deleted locker at ${new Date().toISOString()}`);

        await lockerRepository.update(Request.params.id!, {is_active: false})
        return Response.status(204).json({message:"Locker successfully deleted"});
    }
    catch(error)
    {
        return Response.status(500).json({message:"Locker cannot be deleted"})
    }
})

//HARD DELETE LOCKER
lockerRouter.delete("/:id", authMiddleware, async(Request:RequestWithUser, Response)=>{
    try
    {
        const locker = await lockerRepository.findById(Request.params.id!);    

        if (!locker) {
            return response.status(404).json({ message: "Locker not found" });
        }

        const admin = Request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} successfully updated locker at ${new Date().toISOString()}`);

       await lockerRepository.delete(Request.params.id!);
       return Response.status(204).json({message:"Locker successfully deleted"});
    }
    catch(error)
    {
        return Response.status(500).json({message:"Locker cannot be deleted"})
    }
})
export default lockerRouter;

