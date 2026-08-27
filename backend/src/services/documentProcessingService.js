import extractTextFromPdf from "../utils/extractTextFromPdf.js";
import DocumentChunk from "../models/documentChunks.models.js";
import createTextEmbedding from "../utils/textEmbedding.js";
import chunkText from "../utils/chunkText.js";


export const extractText = async (buffer) => {

    const result = await extractTextFromPdf(buffer);

    return result
}


// step-2 chunk the result text

export const createChunks = (text, chunkSize, overlap) => {
    const chunks = chunkText(text, chunkSize, overlap);

    return chunks;
}


// step-3 Embed the chunks

export const createEmbedding = async (chunks) => {
    const embeddings = [];
    for (let i = 0; i < chunks.length; i++) {
        const embededText = await createTextEmbedding(chunks[i]);
        embeddings.push(embededText);
    }
    return embeddings;
}


// step-4 save the embeding in  mongo

export const saveEmbeddings = async (
    workspaceId,
    documentId,
    chunks,
    embeddings
) => {

    const chunkDocuments = [];

    for (let i = 0; i < chunks.length; i++) {

        const newChunk = {
            document: documentId,
            workspace: workspaceId,
            text: chunks[i],
            embedding: embeddings[i]
        };

        chunkDocuments.push(newChunk);
    }

    const savedChunks = await DocumentChunk.insertMany(chunkDocuments);

    return savedChunks;
};


// step -5 all four steps in a func

export const processDocument = async (file , documentId , workspaceId)=>{

    const text = await extractTextFromPdf(file.buffer);
    const chunks = chunkText(text, 1000 ,200);
    const embeddings = await createEmbedding(chunks);
    const  savedChunks = await saveEmbeddings(
        workspaceId,
        documentId,
        chunks,
        embeddings
    )


return savedChunks;
}




