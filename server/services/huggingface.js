import axios from "axios";
import { huggingFace } from "../lib/hf.js";

export async function generateEmbedding(text) {
    try {
        const { hfApiUrl, headers } = huggingFace();

        const response = await axios.post(
            hfApiUrl,
            { inputs: text },
            { headers }
        );

        let vector = response.data;

        if (Array.isArray(vector) && Array.isArray(vector[0])) {
            vector = vector[0];
        }

        return vector;

    } catch (error) {
        console.error("Error embedding text with HuggingFace:", error.response?.data || error);
        throw new Error("Failed to embed text");
    }
}