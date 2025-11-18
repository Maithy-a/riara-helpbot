import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { dbConnection } from './lib/db.js';

import healthRouter from './routes/health.js';
import chatRouter from './routes/chat.js';
import faqRouter from './routes/faqs.js';
import adminRouter from './routes/admin.js';


const app = express();
app.use(cors());
app.use(express.json());

const startServer = async () => {
    const { client, db } = await dbConnection(
        process.env.MONGO_URI,
        process.env.MONGO_DB
    );


    app.locals.db = db;


    app.use('/api/health', healthRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/faqs', faqRouter);
    app.use('/api/chat', chatRouter);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
};

startServer();
