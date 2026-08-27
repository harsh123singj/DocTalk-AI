import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN);

const createTextEmbedding = async (text) => {
    try {
        const result = await client.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: text,
            provider: "hf-inference"
        });

        return result;

    } catch (error) {
        throw error;
    }
};

export default createTextEmbedding;