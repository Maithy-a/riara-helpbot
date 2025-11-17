import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const faqs = await db.collection('faqs').find({}).toArray(); // <-- FIXED
        res.json(faqs);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({ error: "Failed to fetch FAQs" });
    }
});

router.post('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { question, answer, category } = req.body;

        if (!question || !answer || !category) {
            return res.status(400).json({
                error: 'Question, answer, and category are required'
            });
        }

        const now = new Date();
        const newFAQ = {
            question,
            answer,
            category,
            createdAt: now,
            updatedAt: now
        };

        const result = await db.collection('faqs').insertOne(newFAQ);

        res.json({ insertedId: result.insertedId });
    } catch (error) {
        console.error("Error creating FAQ:", error);
        res.status(500).json({ error: "Failed to add FAQ" });
    }
});

export default router;
