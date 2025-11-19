import express from 'express';
import { generateEmbedding } from "../services/huggingface.js";

const router = express.Router();

function cosineSimilarity(vecA, vecB) {
    const dot = vecA.reduce((sum, value, index) =>
        sum + value * vecB[index], 0
    );

    const magnitudeA = Math.sqrt(vecA.reduce((sum, value) =>
        sum + value * value, 0
    ));

    const magnitudeB = Math.sqrt(vecB.reduce((sum, value) =>
        sum + value * value, 0
    ));

    if (magnitudeA === 0 || magnitudeB === 0)
        return 0;

    return dot / (magnitudeA * magnitudeB);
}

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const db = req.app.locals.db;

        const userEmbedding = await generateEmbedding(message);
        const faqs = await db.collection('faqs')
            .find({})
            .toArray();

        if (faqs.length === 0) {
            return res.json({
                response: {
                    text: "I'm sorry, I don't have enough information to answer that right now."
                },
                confidence: 0
            });
        }

        let bestMatch = null;
        let highestSimilarity = -1;

        for (const faq of faqs) {
            if (!faq.embedding) continue;

            const score = cosineSimilarity(userEmbedding, faq.embedding);

            if (score > highestSimilarity) {
                highestSimilarity = score;
                bestMatch = faq;
            }
        }

        const threshold = 0.60;

        if (!bestMatch || highestSimilarity < threshold) {
            return res.json({
                response: { text: "I'm not fully sure how to answer that. Could you rephrase your question?" },
                confidence: highestSimilarity
            });
        }

        await db.collection('chatLogs').insertOne({
            question: message,
            answer: bestMatch.answer,
            similarity: highestSimilarity,
            faqId: bestMatch._id || null,
            timestamp: new Date()
        });

        return res.json({
            response: {
                text: bestMatch.answer,
                question: bestMatch.question
            },
            confidence: highestSimilarity
        });

    } catch (error) {
        console.error("Chat error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
