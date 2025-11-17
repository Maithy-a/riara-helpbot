import express from 'express';
import { generateEmbedding } from '../services/huggingface.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const faqs = await db.collection('faqs').find({}).toArray();
        res.json(faqs);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({ error: "Failed to fetch FAQs" });
    }
});

// post new faq with embedding
router.post('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { question, answer, category } = req.body;

        if (!question || !answer || !category) {
            return res.status(400).json({
                error: 'Question, answer, and category are required'
            });
        }

        // generate embedding
        const embedding = await generateEmbedding(question);

        const now = new Date();
        const newFAQ = {
            question,
            answer,
            category,
            embedding,
            createdAt: now,
            updatedAt: now
        };

        // Insert into db
        const result = await db.collection('faqs').insertOne(newFAQ);

        res.json({ insertedId: result.insertedId });
    } catch (error) {
        console.error("Error creating FAQ:", error);
        res.status(500).json({ error: "Failed to add FAQ" });
    }
});

export default router;
