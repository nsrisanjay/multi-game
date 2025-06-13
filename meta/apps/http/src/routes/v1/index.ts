import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { SigninSchema, SignupSchema } from "../../types"; 
import client from "@repo/db/client"
import jwt from "jsonwebtoken";
import { compare,hash } from "../../scrypt";
import {JWT_PASSWORD} from "../../config"

export const router = Router()
router.post('/signup',async(req,res)=>{
    const parsedData = SignupSchema.safeParse(req.body);
    if(!parsedData.success)
    {
        res.status(400).json({message: "validation failed"})
        return;
    }
    const result = await client.user.findUnique({
        where:{
            username: parsedData.data.username
        }
    })
    if(result)
    {
        res.status(400).json({message:"username already in use"});
        return;
    }
    const hashedPassword = await hash(parsedData.data.password);
    try{
        const user = await client.user.create({
            data:{
                username:parsedData.data.username,
                password:hashedPassword,
                role: parsedData.data.type === "admin"? "Admin":"User",
            }
        })
        res.json({
            userId:user.id,
        })
    }catch(err)
    {
        console.log(err);
        res.status(400).json({message:"user already exists"});
    }
    
});

router.post('/signin',async(req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success)
    {
        res.status(403).json({message:"validation failed"});
        return;
    }
    try{
        const user = await client.user.findUnique({
            where:{
                username: parsedData.data?.username,
            }
        })
        if(!user)
        {
            res.status(403).json({message:"user not found"})
            return;
        }
        const isValid = await compare(parsedData.data?.password,user.password);
        if(!isValid)
        {
            res.status(403).json({message: "invalid password"})
            return;
        }
        const expiresIn = '1h'
        const token = jwt.sign({
            userId:user.id,
            role: user.role
        },JWT_PASSWORD,{expiresIn})
        res.json({
            token
        })
    }catch(err)
    {
        console.log(err)
        res.status(403).json({message: "internal server error"})
    }
    // res.json({
    //     message:"signin"
    // })
});

router.get('/elements',async(req,res)=>{
    const elements = await client.element.findMany();
    res.json({
        elements: elements.map(x => ({
            id:x.id,
            imageUrl: x.imageUrl,
            width: x.width,
            height: x.height,
            static: x.static
        }))
    });
});

router.get('/avatars',async(req,res)=>{
    const avatars = await client.avatar.findMany();
    res.json({
        avatars: avatars.map(x => ({
            id: x.id,
            imageUrl:x.imageUrl,
            name:x.name
        }))
    })

});

router.get('/maps',async(req,res)=>{
    const maps = await client.map.findMany();
    res.json({
        maps: maps.map(e=>({
            id:e.id,
            name:e.name,
            dimensions:`${e.width}x${e.height}`,
            thumbnail:e.thumbnail
        }))
    })
})

router.use('/user',userRouter)
router.use('/space',spaceRouter)
router.use('/admin',adminRouter)