import { Request, Response } from "express";
import { AuthService } from "./AuthService";
import { sendResponse2 } from "../Shared/sendResponse";
import catchAsync from "../Shared/catchAsync";



const loginUser = catchAsync( async(req:Request, res:Response)=>{

    const result = await AuthService.loginUser(req.body);
    res.send("hello....")
   
})


export const AuthController ={
    loginUser
}