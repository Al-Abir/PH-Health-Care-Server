import { NextFunction, Request, Response } from "express"
import { AdminService } from "./Admin.service"
import { Admin } from "./Admin.interface";
import { sendResponse, sendResponse2 } from "../Shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../Shared/catchAsync";


const getAllDB = catchAsync(async (req:Request, res: Response)=>{
      
        const result = await  AdminService.getAlldata();

     sendResponse2(res, StatusCodes.OK, true, "all admin data faced...", result);    

}) 

const singleUser = async(req:Request, res: Response)=>{
      try {
        const {id} = req.params;
       const result = await AdminService.singleUser(id);
       
     sendResponse(res, {
             statusCode:200,
             success:true,
             message:" admin single  data faced",
             data:result
        })

      } catch (error) {
         console.log(error)
      }
}


const updateAdmin = async(req:Request, res:Response , next:NextFunction):Promise<void>=>{

     try {
        const id = Number(req.params.id);
        const data:Partial<Admin> = req.body;
        const validateSchema = updateAdminScheam.parse(data);

        const user = await AdminService.updateDataDB(id,validateSchema);
    
        res.status(200).json({
            success:true,
            message:"Data successfully update",
            reuslt: user
        })

     } catch (error) {
         next(error)
     }

}

const hardDeleteAdmin = async (req:Request , res:Response):Promise<void>=>{

     try {
         const id = Number(req.params.id);
         const user = await AdminService.hardDeleteAdminUser(id);
         res.status(200).json({
             success:true,
             message:"User Delete Succesfuly",
             data:user
         })
     
     } catch (error) {
         console.log(error)
     }
     

}

const softDeleteAdmin = async (req:Request, res:Response):Promise<void>=>{
     try {
         const id = Number(req.params.id)
         const user = await AdminService.softDeleteUserAdmin(id);
         res.status(200).json({
             success:true,
             message:"User Delete Succesfuly",
             data:user
         })
     
        
     } catch (error) {
          console.log(error)
     }
}

export const AdminController={
    getAllDB,
    singleUser,
    updateAdmin,
    hardDeleteAdmin,
    softDeleteAdmin,

}