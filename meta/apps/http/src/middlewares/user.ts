import  jwt  from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { NextFunction,Request,Response } from "express";

export const userMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const header = req.headers["authorization"] as string;
    const token = header?.split(' ')[1];
    if(!token)
    {
        res.status(401).json({message:"request unauthorized"});
        return;
    }
    try{
        // verify the jwt
        const decoded = jwt.verify(token,JWT_PASSWORD) as {role:string,userId:string}
        req.userId = decoded.userId;
        next();
    }catch(err)
    {
        console.log(err);
        res.status(401).json({message:"request unauthorized"});
        return;
    }
}