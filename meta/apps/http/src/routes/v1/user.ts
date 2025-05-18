import { Router } from "express";
import { UpdateMetadataSchema } from "../../types";
import client from "@repo/db/client"
import { userMiddleware } from "../../middlewares/user";
import { adminMiddleware } from "../../middlewares/admin";


export const userRouter = Router();


userRouter.post('/metadata',userMiddleware,async(req,res)=>{
    const parsedData = UpdateMetadataSchema.safeParse(req.body);
    if(!parsedData.success)
    {
        console.log("parsedData is incorrect");
        res.status(400).json({message:"validation failed"});
        return;
    }
    const response = await client.avatar.findUnique({
        where:{
            id:parsedData.data.avatarId
        }
    })
    if(!response)
    {
        res.status(400).json({message: "avatar not valid or found"});
        return;
    }
    try{
        await client.user.update({
            where:{
                id:req.userId,
            },
            data:{
                avatarId:parsedData.data.avatarId
            }
        })
        res.json({message:"metatdata updated!"})
    }catch(e)
    {
        console.log(e);
    }
});

userRouter.get('/metadata/bulk',async(req,res)=>{
    const userIdsString = (req.query.ids ?? "[]") as string;
    const userIds = userIdsString.slice(1,userIdsString.length-1).split(",");
    console.log(userIds);
    const metadata = await client.user.findMany({
        where:{
            id:{
                in: userIds
            }
        },select:{
            avatar:true,
            id:true
        }
    })
    res.json({
        avatars: metadata.map(m =>({
            userId:m.id,
            avatarId:m.avatar?.imageUrl
        }))
    })
    // console.log(typeof(userIds));
});