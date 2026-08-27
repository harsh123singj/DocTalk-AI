import Document from "../models/document.models.js";
import Workspace from "../models/workspace.models.js";
import ChatMessage from "../models/chatMessage.models.js";

import generateRAGAnswer from "./ragService.js";
import summarizeDocument from "./summarizeService.js";
import { processDocument } from "./documentProcessingService.js";

import uploadToCloudinary, {
    deleteFromCloudinary
} from "../utils/uploadToCloudinary.js";


// CREATE DOCUMENT

export const createDocument = async ({
    file,
    workspaceId,
    userId
}) => {

    const workspace = await Workspace.findOne({
        _id: workspaceId,
        owner: userId
    });

    if (!workspace) {
        throw new Error("Workspace not found or access denied");
    }

    const result = await uploadToCloudinary(file.buffer);

    const newDocument = new Document({
        name: file.originalname,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        fileType: file.mimetype,
        fileSize: file.size,
        owner: userId,
        workspace: workspaceId,
        status: "processing"
    });

    const savedDocument = await newDocument.save();

    try {

        await processDocument(
            file,
            savedDocument._id,
            workspaceId
        );

        savedDocument.status = "completed";

        await savedDocument.save();

    } catch (error) {

        savedDocument.status = "failed";

        await savedDocument.save();

        throw error;
    }

    return savedDocument;
};


// GET DOCUMENTS BY WORKSPACE

export const getDocumentByWorkspace = async ({
    workspaceId,
    userId
}) => {

    console.log("WORKSPACE ID:", workspaceId);
console.log("USER ID:", userId);

    const workspace = await Workspace.findOne({
        _id: workspaceId,
        owner: userId
    });

    if (!workspace) {
        throw new Error("Workspace not found or access denied");
    }

    const documents = await Document.find({
        workspace: workspaceId,
        owner: userId
    }).sort({
        createdAt: -1
    });

    return documents;
};


// GET DOCUMENT BY ID

export const getDocumentBydocId = async (
    docID,
    userId
) => {

    const document = await Document.findOne({
        _id: docID,
        owner: userId
    });

    if (!document) {
        throw new Error(
            "Document not found or access denied"
        );
    }

    return document;
};


// DELETE DOCUMENT

export const deleteDocument = async (
    docId,
    userId
) => {

    const document = await Document.findOne({
        _id: docId,
        owner: userId
    });

    if (!document) {
        throw new Error(
            "Document not found or access denied"
        );
    }

    await deleteFromCloudinary(
        document.publicId
    );

    await Document.deleteOne({
        _id: docId
    });

    return document;
};


// CHAT WITH DOCUMENT

export const chatWithDocument = async (
    documentId,
    userId,
    prompt
) => {

    const document = await getDocumentBydocId(
        documentId,
        userId
    );

    const userMessage = new ChatMessage({
        document: documentId,
        user: userId,
        role: "user",
        content: prompt.trim()
    });

    await userMessage.save();

    try {

        const result = await generateRAGAnswer(
            prompt,
            document.workspace,
            document._id
        );

        const assistantMessage = new ChatMessage({
            document: documentId,
            user: userId,
            role: "assistant",
            content: result.answer
        });

        await assistantMessage.save();

        return result;

    } catch (error) {

        throw error;
    }
};


// SUMMARIZE DOCUMENT

export const summarizeDocumentById = async (
    documentId,
    userId
) => {

    // 1. Verify document ownership

    const document = await getDocumentBydocId(
        documentId,
        userId
    );


    // 2. Generate summary

    const result = await summarizeDocument(
        document._id
    );


    return result;
};