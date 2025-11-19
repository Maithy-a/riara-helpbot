import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { dbConnection } from './lib/db.js';

import healthRouter from './routes/health.js';
import chatRouter from './routes/chat.js';
import faqRouter from './routes/faqs.js';
import adminRouter from './routes/admin.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());


const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again later."
});
app.use(globalRateLimiter);

const adminRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 20,
    message: { message: "Too many admin requests. Try later." }
});

app.use('/api/admin', adminRateLimiter);


const chatRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: { message: "Too many chat requests. Try later." }
});
app.use('/api/chat', chatRateLimiter);

const startServer = async () => {
    try {
        if (!process.env.MONGO_URI || !process.env.MONGO_DB) {
            console.error("MongoDB configuration is missing.");
            process.exit(1);
        }

        const { db } = await dbConnection(
            process.env.MONGO_URI,
            process.env.MONGO_DB
        );

        app.locals.db = db;

        app.use('/api/health', healthRouter);
        app.use('/api/admin', adminRouter);
        app.use('/api/faqs', faqRouter);
        app.use('/api/chat', chatRouter);

        app.use((err, req, res, next) => {
            console.error("Server Error:", err);
            res.status(500).json({ message: "Internal server error" });
        });

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
