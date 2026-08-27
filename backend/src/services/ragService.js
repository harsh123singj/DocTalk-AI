import searchSimilarChunks from "./vectorSearchService.js";
import generateAnswer from "../utils/llm.js";

const generateRAGAnswer = async (
    prompt,
    workspaceId,
    documentId,
    previousMessages = []
) => {

    // 1. Retrieve relevant chunks
    const chunks = await searchSimilarChunks(
        prompt,
        workspaceId,
        documentId
    );

    // 2. Create document context
    const context = chunks
        .map((chunk) => chunk.text)
        .join("\n\n");

    // 3. Create conversation history
    const conversationHistory = previousMessages
        .map((message) => {
            return `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`;
        })
        .join("\n");

    // 4. Create RAG prompt
    const ragPrompt = `
You are an AI document assistant.

Answer the user's question using ONLY the information provided in the document context.

You may use the conversation history to understand references such as:
- "it"
- "this"
- "that"
- "they"
- follow-up questions

Do NOT use conversation history as a source of factual information unless that information is also supported by the document context.

If the answer cannot be found in the document context, say:
"I could not find the answer in the provided document."

Conversation History:
${conversationHistory || "No previous conversation."}

Document Context:
${context || "No relevant document context found."}

User Question:
${prompt}
`;

    // 5. Generate answer
    const answer = await generateAnswer(ragPrompt);

    // 6. Return answer and sources
    return {
        answer,
        sources: chunks.map((chunk) => ({
            documentId: chunk.document,
            content: chunk.text,
            relevanceScore: chunk.score
        }))
    };
};

export default generateRAGAnswer;