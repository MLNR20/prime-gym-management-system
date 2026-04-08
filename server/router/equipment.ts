import  express  from "express";
import EquipmentRepository from "../repository/equipmentRepository";
import LogsRepository from "../repository/logsRepository";
import { RequestWithUser } from "../middleware/types/express";
import { authMiddleware } from "../middleware/middleware";

const equipmentRouter = express.Router();

//CREATE equipment
equipmentRouter.get("/", authMiddleware, async(Request: RequestWithUser, Response)=>{
    try
    {
        const retrieveEquipment = await EquipmentRepository.findAll();
        const admin = Request.admin; 
        await LogsRepository.logAction(admin!._id.toString(), `${admin!.first_name} ${admin?.last_name} accessed equipment list at ${new Date().toISOString()}`);

        
        return Response.status(200).json(retrieveEquipment)
    }
    catch(error)
    {
        return Response.status(500).json({message:"Equipment not retrieved!"})
    }
})

export default equipmentRouter