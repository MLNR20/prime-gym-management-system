import  express  from "express";
import equipmentRepository from "../repository/equipmentRepository";
import LogsRepository from "../repository/logsRepository";
import { RequestWithUser } from "../middleware/types/express";
import { authMiddleware } from "../middleware/middleware";

const equipmentRouter = express.Router();


//VIEW EQUIPMENT
equipmentRouter.get("/", authMiddleware, async(Request: RequestWithUser, Response)=>{
    try
    {
        const retrieveEquipment = await equipmentRepository.findAll();
        const admin = Request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} accessed equipment list at ${new Date().toISOString()}`);
        return Response.status(200).json(retrieveEquipment)
    }
    catch(error)
    {
        return Response.status(500).json({message:"Equipment not retrieved!"})
    }
})

//RETRIEVE EQUIPMENT
equipmentRouter.get("/:id", authMiddleware, async(Request: RequestWithUser, Response)=>{
    try
    {
        const retrieveEquipment = await equipmentRepository.findById(Request.params.id!);

        if(!retrieveEquipment)
        {
            return Response.status(404).json("Failed to retrieve equipment")
        }

        const admin = Request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} accessed equipment at ${new Date().toISOString()}`);

        return Response.status(200).json(retrieveEquipment);
    }
    catch(error)
    {
        return Response.status(500).json({message:"Equipment not retrieved!"})
    }
})

//CREATE EQUIPMENT
equipmentRouter.post("/", authMiddleware, async(Request: RequestWithUser, Response)=>{
    try
    {
        const newEquipment = await equipmentRepository.create(Request.body);
        const admin = Request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} created equipment at ${new Date().toISOString()}`);

        return Response.status(200).json(newEquipment);

    }
    catch(error)
    {
        return Response.status(500).json({message:"Equipment not created"})
    }
})

//DELETE EQUIPMENT
equipmentRouter.delete("/:id", authMiddleware, async(Request:RequestWithUser, Response)=>{
    try
    {
        const id = Request.params.id!;
        const deleteEquipment = await equipmentRepository.delete(id);

        if(!deleteEquipment)
        {
            return Response.status(404).json({message: "Failed to delete equipment"})
        }

        const admin = Request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} deleted equipment at ${new Date().toISOString()}`);
        return Response.status(204).json({message:"Equipment deleted succesfully"})
    }
    catch(error)
    {
        return Response.status(500).json({message:"Delete equipment failed!"})
    }
})

//SOFT DELETE EQUIPMENT
equipmentRouter.put("/:id", authMiddleware, async(Request:RequestWithUser, Response)=>{
    try
    {
        const id = Request.params.id!;
        const updateEquiment = await equipmentRepository.update(id, Request.body);

        if(!updateEquiment)
        {
            return Response.status(404).json({message: "Failed to update equipment"})
        }

        const admin = Request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} updated equipment at ${new Date().toISOString()}`);
        return Response.status(200).json(updateEquiment)
    }
    catch(error)
    {
        return Response.status(500).json({message:"Delete equipment failed!"})
    }
})



export default equipmentRouter