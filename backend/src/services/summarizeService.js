import DocumentChunk from "../models/documentChunks.models.js";
import generateAnswer from "../utils/llm.js";

const summarizeDocument = async (documentId) => {

    // 1. Get all chunks of the document
    const chunks = await DocumentChunk.find({
        document: documentId
    }).sort({
        createdAt: 1
    });

    if (chunks.length === 0) {
        throw new Error("No content found for this document");
    }

    // 2. Combine chunk text
    const context = chunks
        .map((chunk) => chunk.text)
        .join("\n\n");

    // 3. Create summarization prompt
    const summaryPrompt = `
You are an AI document assistant.

Summarize the following document.

Provide:
1. A concise overview
2. The main points
3. Important details
4. The conclusion or overall takeaway

Use ONLY the information provided in the document.

Document:
${context}
`;

    // 4. Generate summary
    const summary = await generateAnswer(summaryPrompt);

    return {
        summary,
        documentId
    };
};

export default summarizeDocument;