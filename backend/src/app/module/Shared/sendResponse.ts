
import { Response } from "express";

export const sendResponse =<T>(res:Response, jsonData:{
     statusCode : number,
     success:boolean
     message:string,
     data: T | undefined |null
})=>{
    res.status(jsonData.statusCode).json({
        success: jsonData.success,
        message: jsonData.message,
        data: jsonData.data || undefined || null
    })
}

export const sendResponse2 = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data: T | undefined | null
) => {
  res.status(statusCode).json({
    success,
    message,
    data: data ?? null
  });
};