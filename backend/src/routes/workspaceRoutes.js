import { createWorkspace , getWorkspaces, getWorkspaceById ,UpdateWorkspace , deleteWorkspace } from "../controllers/workspaceController.js";
import  authMiddleware from "../middleware/authMiddleware.js"
import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import uploadTOCloudinary from "../utils/uploadToCloudinary.js";
const workspaceRouter = express.Router();

workspaceRouter.post("/",authMiddleware , createWorkspace);
workspaceRouter.get("/" , authMiddleware, getWorkspaces);
workspaceRouter.get("/:id", authMiddleware , getWorkspaceById);
workspaceRouter.put("/:id", authMiddleware, UpdateWorkspace);
workspaceRouter.delete("/:id", authMiddleware , deleteWorkspace);


// documents
workspaceRouter.post("/test-upload" , authMiddleware,
    upload.single("document"),
    (req, res) =>{
        console.log(req.file);

        res.status(200).json({
            success: true,
            message:"File uploaded successfully",
            file: req.file
        })
    }
)


// cloudinary  test route
workspaceRouter.post("/test-cloudinary" , authMiddleware,
    upload.single("document"),
    async(req, res)=>{
        try{
            const result  = await uploadTOCloudinary(req.file.buffer);

            res.status(200).json({
                success:true,
                message:"File uploaded to cloudinary successfully",
                data:{
                    url:result.secure_url,
                    publicId:result.public_id
                }
            });
        }

        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
)

export default workspaceRouter;