import { Router } from "express";
import { AddElementSchema, CreateElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../../types";
import { userMiddleware } from "../../middlewares/user";
import client from '@repo/db/client'


export const spaceRouter = Router()
spaceRouter.post('/',userMiddleware,async(req,res)=>{
    // first use zod for input validationf
    const parsedData = CreateSpaceSchema.safeParse(req.body);
    if(!parsedData.success)
    {
        res.status(400).json({message:"validation failed"});
        return;
    }
    const width = parsedData.data.dimensions.split('x')[0];
    const height = parsedData.data.dimensions.split('x')[1];
    if(!parsedData.data.mapId)
    {
        // create a blank space
        const emptySpace = await client.space.create({
            data: {
                name: parsedData.data.name,
                height: parseInt(height),
                width: parseInt(width),
                creatorId: req.userId as string
            }
        })
        res.json({
            spaceId:emptySpace.id,
            message:"empty space successfully created"
        });
        return;
    }
    // if mapId is specified
    const map = await client.map.findFirst({
        where:{
            id: parsedData.data.mapId
        },
        select:{
            width: true,
            height: true,
            mapElements:true
        }
    })

    if(!map)
    {
        res.status(400).json({message:"map not found"});
        return;
    }
    // else create a blank space and add elements to the blank space
    let space = await client.$transaction(async()=>{
        const space = await client.space.create({
            data:{
                name: parsedData.data.name,
                width: map.width,
                height: map.height,
                creatorId: req.userId as string,
                mapId:parsedData.data.mapId
            }
        })
        // the above returns a space id
        // now add elemnts to the created blank map
        await client.spaceElements.createMany({
            data: map.mapElements.map(e => ({
                spaceId: space.id,
                elementId: e.elementId,
                x: e.x !,
                y: e.y !,
            }))
        })
        return space;
    })
    res.json({spaceId:space.id});

});

spaceRouter.delete('/element',userMiddleware,async(req,res)=>{
    const parsedData = DeleteElementSchema.safeParse(req.body);
    if(!parsedData.success)
    {
        res.status(400).json({message:"validation failed"});
        return;
    }
    const spaceElement = await client.spaceElements.findFirst({
        where:{
            id: parsedData.data.id
        },
        include:{
            space:true
        }
    })
    console.log(spaceElement);
    if(!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId)
    {
        res.status(403).json({message:"unauthorized request"});
        return;
    }
    await client.spaceElements.delete({
        where:{
            id: parsedData.data.id
        }
    })
    res.json({message:"element successfully deleted"});
    return;
});

spaceRouter.delete('/:spaceId',userMiddleware,async(req,res)=>{
    const space = await client.space.findUnique({
        where:{
            id: req.params.spaceId
        },
        select:{
            creatorId: true,
        }
    })
    if(!space)
    {
        res.status(400).json({message: "space doesnt exist"});
        return;
    }
    if(space.creatorId !== req.userId)
    {
        res.status(403).json({message: "unaothorized request"});
        return;
    }
    await client.space.delete({
        where:{
            id:req.params.spaceId
        }
    })
    res.json({message: "sapce successfully deleted"});
});

spaceRouter.get('/all',userMiddleware,async(req,res)=>{
    const spaces = await client.space.findMany({
        where:{
            creatorId: req.userId
        }
    })
    res.json({spaces: spaces.map(e=>({
            id:e.id,
            name:e.name,
            thumbnail: e.thumbnail,
            dimensions: `${e.width}x${e.height}`
        })
    )});
});

spaceRouter.post('/element',userMiddleware,async(req,res)=>{
    // add a new element to an map
    const parsedData = AddElementSchema.safeParse(req.body);
    if(!parsedData.success)
    {
        res.status(400).json({message:"validation failed"})
        return;
    }
    const space = await client.space.findUnique({
        where:{
            id:parsedData.data.spaceId,
            creatorId: req.userId
        },
        select:{
            width:true,
            height:true
        }
    })
    if(!space)
    {
        res.status(400).json({message:"space not found"});
        return;
    }
    if(parsedData.data.x<0 || parsedData.data.y<0
        || parsedData.data.x > space?.width
        || parsedData.data.y > space?.height
    )
    {
        res.status(400).json({message: "adding element out of boundary of maps"});
        return;
    }
    await client.spaceElements.create({
        data:{
            elementId: parsedData.data.elementId,
            spaceId: parsedData.data.spaceId,
            x: parsedData.data.x,
            y: parsedData.data.y
        }
    })
    res.status(200).json({message: "element added successfully"});
});



spaceRouter.get('/:spaceId',async(req,res)=>{
    const space = await client.space.findUnique({
        where:{
            id: req.params.spaceId
        },
        select:{
            width:true,
            height:true,
            mapId:true,
            elements:{
                include:{
                    element:true
                }
            }
        }
    })
    // const spaceId = space.
    if(!space)
    {
        res.status(400).json({message:"space not found"});
        console
        return;
    }
    res.json({
        dimensions: `${space.width}x${space.height}`,
        mapId:space.mapId,
        elements: space.elements.map(e => ({
            id: e.id,
            element:{
                id: e.element.id,
                imageUrl: e.element.imageUrl,
                static: e.element.static,
                height: e.element.height,
                width: e.element.width
            },
            x: e.x,
            y: e.y
        }))
    })
});
