import {
    createDocument as createDocumentService,
    getDocumentByWorkspace as getDocumentByWorkspaceService,
    getDocumentBydocId as getDocumentBydocIdService,
    deleteDocument as deleteDocumentService,
    summarizeDocumentById
} from "../services/documentService.js";
import ChatMessage from "../models/chatMessage.models.js";

export const createDocument =async(req, res)=>{

    try{
        const newDocument = await createDocumentService({
        file:req.file,
        workspaceId:req.params.workspaceId,
        userId: req.user.userId
    })

    res.status(201).json({
        success:true,
        message:"Document Uploaded Successfully",
        data:newDocument
    })
    }
    catch(error){
        res.status(400).json({
            success : false,
            message: error.message
        })
    }

}

export const getDocuments = async(req, res)=>{
    try{
        const documents= await getDocumentByWorkspaceService({
            workspaceId: req.params.workspaceId,
            userId: req.user.userId
        })

        res.status(200).json({
            success:true,
            message:"your Documents",
            data: documents
        })
    }

    catch(error){
            res.status(400).json({
            success:false,
            message:error.message
            
        }) 
    }
}



export const getDocument =async (req, res)=>{
    try{
        const document = await getDocumentBydocIdService(
            req.params.docId,
            req.user.userId
        )


        res.status(200).json({
            success :true,
            message:"your docment by Id ",
            data:document
        });
    }

    catch(error){
         res.status(400).json({
            success :false,
            message: error.message
        });
    }
}

export const getChatHistory = async (req, res) => {
    try {
        const { documentId } = req.params;
        const userId = req.user.userId;

        const messages = await ChatMessage.find({
            document: documentId,
            user: userId
        })
            .sort({ createdAt: 1 })
            .limit(50);

        res.status(200).json({
            success: true,
            message: "Chat history fetched successfully",
            data: messages
        });

    } catch (error) {
        console.log("CHAT HISTORY ERROR:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteDocument = async (req, res) => {
    try {
        await deleteDocumentService(
            req.params.docId,
            req.user.userId
        );

        res.status(200).json({
            success: true,
            message: "Document Deleted Successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const summarizeDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const userId = req.user.userId;

        const result = await summarizeDocumentById(
            documentId,
            userId
        );

        res.status(200).json({
            success: true,
            message: "Document summarized successfully",
            data: result
        });

    } catch (error) {
        console.log("SUMMARY ERROR:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};