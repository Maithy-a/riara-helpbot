import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Endpoint is working.");
});

router.post('/', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    return res.json({
        response: {
            text: "Hello! This is a placeholder reply."
        },
        confidence: 0
    });
});

export default router;