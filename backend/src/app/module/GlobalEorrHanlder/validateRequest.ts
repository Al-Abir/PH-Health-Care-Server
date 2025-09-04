import { NextFunction, Request, Response } from "express"
import { ZodObject, ZodRawShape } from "zod";
type AnyZodObject = ZodObject<ZodRawShape>;
const validateRequest = (schema:AnyZodObject)=>{
    return async (req:Request,res:Response, next:NextFunction)=>{
     try {
        await schema.parseAsync({ body: req.body })
        next()
     } catch (error) {
        next(error)
     }
}
}

export default validateRequest;