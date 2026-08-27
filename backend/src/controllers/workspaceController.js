import { createWorkspace as createWorkspaceService } from "../services/workspaceService.js";
import { getUserWorkspaces as getworkspaceService } from "../services/workspaceService.js";
import { getWorkspaceById as getWorkspaceByIdService } from "../services/workspaceService.js";
import { updateWorkspace as updateWorkspaceService } from "../services/workspaceService.js";
import { deleteWorkspace as  deleteWorkspaceService } from "../services/workspaceService.js";
export const createWorkspace = async (req, res) =>{

    try{
    const {name , description } = req.body;
    const newWorkspace = await createWorkspaceService({
        name,
        description,
        userId : req.user.userId
    });

    res.status(201).json({
        success : true,
        message:"Workspace created successfully",
        data : newWorkspace
    })
    }

    catch(error){
       res.status(400).json({
        success: false,
        message : error.message
       })
    }};


export const getWorkspaces = async  (req , res )=>{

    try{
    const workspace = await getworkspaceService(req.user.userId);
    res.status(200).json({
        success : true ,
        message :"your workspace",
        data : workspace
    })
    }
    catch(error){
        res.status(400).json({
        success : false,
        message :error.message   
    })  
    }
}


export const getWorkspaceById = async (req ,res)=>{


    const {id : workspaceId} = req.params;

    try{
    const workspaceById=  await getWorkspaceByIdService(
        workspaceId ,
        req.user.userId
    )

    res.status(200).json({
        success : true ,
        message :"your workspace by ID ",
        data: workspaceById
    })
    }
    catch(error){
        res.status(400).json({
        success : false ,
        message :error.message
        
    })
    }
    
   
}


export const UpdateWorkspace =  async (req, res) =>{


    const {name , description } = req.body;

    const {id : workspaceId} = req.params;

    try{
        const updatedWorkspace = await updateWorkspaceService(
        workspaceId,
        req.user.userId ,{
            name , 
            description
        }
    )

    res.status(200).json({
        success : true,
        message : "WorkSpace updated succesfully",
        data :updatedWorkspace
    })
    }

    catch(error){
        res.status(400).json({
            success : false,
            message: error.message
        })
    }

}


export const deleteWorkspace = async (req,res) =>{

    const {id : workspaceId} = req.params;

    try{  await deleteWorkspaceService(
    workspaceId,
    req.user.userId
  )

  res.status(200).json({
    success : true,
    message:"Workspace deleted Successfully"
  })}

  catch(error){
    res.status(400).json({
    success : false,
    message:error.message
  })
  }

}