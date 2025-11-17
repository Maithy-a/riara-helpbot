export function huggingFace() {
    const hfApiKey = process.env.HF_TOKEN;
    const hfModel = process.env.HUGGINGFACE_MODEL || "sentence-transformers/all-MiniLM-L6-v2";
    const hfApiUrl = `https://router.huggingface.co/hf-inference/models/${hfModel}/pipeline/feature-extraction`;

    if (!hfApiKey) {
        throw new Error("Missing HF_TOKEN in .env");
    }

    return {
        hfApiKey,
        hfModel,
        hfApiUrl,
        headers: {
            Authorization: `Bearer ${hfApiKey}`,
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    };
}
