import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnection } from './lib/db.js';

import healthRouter from './routes/health.js';
import chatRouter from './routes/chat.js';
import faqRouter from './routes/faqs.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { client } = await dbConnection(process.env.MONGO_URI);
app.locals.db = client.db(process.env.MONGO_DB || "unichat");

app.use('/api/health', healthRouter);
app.use('/api/chat', chatRouter);
app.use('/api/faqs', faqRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
