import express from "express";

import {
    createDocument,
    getDocuments,
    getDocument,
    deleteDocument,
    getChatHistory,
    summarizeDocument
} from "../controllers/documentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
    chatWithDocument,
    summarizeDocumentById
} from "../services/documentService.js";

const docRouter = express.Router();


// ==========================================
// DOCUMENT ROUTES
// ==========================================

// Upload document
docRouter.post(
    "/:workspaceId/upload-file",
    authMiddleware,
    upload.single("document"),
    createDocument
);


// Get all documents in workspace
docRouter.get(
    "/:workspaceId",
    authMiddleware,
    getDocuments
);


// Get document by ID
docRouter.get(
    "/document/:docId",
    authMiddleware,
    getDocument
);


// Delete document
docRouter.delete(
    "/delete/:docId",
    authMiddleware,
    deleteDocument
);


// ==========================================
// DOCUMENT CHAT
// ==========================================

docRouter.post(
    "/:documentId/chat",
    authMiddleware,
    async (req, res) => {

        try {

            const { documentId } = req.params;
            const { prompt } = req.body;
            const userId = req.user.userId;

            if (!prompt || !prompt.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Prompt is required"
                });
            }

            const result = await chatWithDocument(
                documentId,
                userId,
                prompt
            );

            res.status(200).json({
                success: true,
                message: "Answer generated successfully",
                data: result
            });

        } catch (error) {

            console.log("CHAT ERROR:", error);

            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
);


// ==========================================
// CHAT HISTORY
// ==========================================

docRouter.get(
    "/:documentId/chat-history",
    authMiddleware,
    getChatHistory
);


// ==========================================
// DOCUMENT SUMMARY
// ==========================================

docRouter.post(
    "/:documentId/summarize",
    authMiddleware,
    async (req, res) => {

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
    }
);


// ==========================================
// EXPORT ROUTER
// ==========================================

export default docRouter;