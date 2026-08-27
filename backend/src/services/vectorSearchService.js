import mongoose from "mongoose";
import createTextEmbedding from "../utils/textEmbedding.js";
import DocumentChunk from "../models/documentChunks.models.js";

const searchSimilarChunks = async (
    prompt,
    workspaceId,
    documentId
) => {

    // 1. Convert user's question into embedding
    const embeddedPrompt = await createTextEmbedding(prompt);

    // 2. Search only inside the user's workspace and document
    const result = await DocumentChunk.aggregate([
        {
            $vectorSearch: {
                index: "vector_index",
                path: "embedding",
                queryVector: embeddedPrompt,
                numCandidates: 20,
                limit: 5,
                filter: {
                    workspace: new mongoose.Types.ObjectId(workspaceId),
                    document: new mongoose.Types.ObjectId(documentId)
                }
            }
        },
        {
            $project: {
                _id: 1,
                document: 1,
                workspace: 1,
                text: 1,
                score: {
                    $meta: "vectorSearchScore"
                }
            }
        }
    ]);

    return result;
};

export default searchSimilarChunks;