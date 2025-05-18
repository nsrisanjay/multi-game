import { Router } from "express";
import { adminMiddleware } from "../../middlewares/admin";
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../../types";
export const adminRouter = Router();
import client from"@repo/db/client"

// create a new element
adminRouter.post('/element',adminMiddleware,async(req,res)=>{
    // create an element
    const parsedData = CreateElementSchema.safeParse(req.body);
    if(!parsedData.success)
    {
        res.status(400).json({message:"validation failed"});
        return;
    }
    const newElement = await client.element.create({
        data:{
            height:parsedData.data.height,
            width:parsedData.data.width,
            imageUrl:parsedData.data.imageUrl,
            static:parsedData.data.static
        }
    })

    res.json({id:newElement.id
        , message:"element created"
    });
});

// update an element 'imageUrl'
adminRouter.put('/element/:elementId',adminMiddleware,async(req,res)=>{
    const parsedData = UpdateElementSchema.safeParse(req.body);
    if(!parsedData.success)
    {
        res.status(400).json({message:"validation failed"});
        return;
    }
    await client.element.update({
        where:{
            id: req.params.elementId
        },
        data:{
            imageUrl:parsedData.data.imageUrl
        }
    })
    res.status(200).json({message:"element updated successfully"});
});

// create a new avatar
adminRouter.post('/avatar',adminMiddleware,async(req,res)=>{
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if(!parsedData.success)
    {
        res.status(400).json({message:"validation failed"});
        return;
    }
    const newAvatar = await client.avatar.create({
        data:{
            imageUrl: parsedData.data.imageUrl,
            name: parsedData.data.name
        }
    })
    res.json({
        avatarId: newAvatar.id
    });
});

// create a mew map
adminRouter.post('/map',adminMiddleware,async(req,res)=>{
    const parsedData = CreateMapSchema.safeParse(req.body);
    if(!parsedData)
    {
        res.status(400).json({message:"validation failed"});
        return;
    }
    const width = parsedData.data?.dimensions.split('x')[0] as string;
    const height = parsedData.data?.dimensions.split('x')[1] as string;
    const newMap = await client.map.create({
        data:{
            thumbnail: parsedData.data?.thumbnail as string,
            width: parseInt(width),
            height:parseInt(height),
            name: parsedData.data?.name as string,
            mapElements:{
                create: parsedData.data?.defaultElements.map(e => ({
                    elementId:e.elementId,
                    x:e.x,
                    y:e.y
                }))
            }
        }
    })
    res.json({
        id:newMap.id,
        message: "new map created"
    })
});