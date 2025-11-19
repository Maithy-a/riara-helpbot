import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-admin', async (req, res) => {
    try {
        const db = req.app.locals.db;

        const exist = await db.collection('admins').findOne({});
        if (exist) {
            return res.status(403).json({
                message: 'Admin account already exists'
            });
        }

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newAdmin = {
            username,
            passwordHash,
            createdAt: new Date()
        };

        await db.collection('admins').insertOne(newAdmin);

        return res.status(201).json({
            message: 'Admin account created successfully'
        });

    } catch (error) {
        console.error("Error creating initial admin:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        console.error("JWT_SECRET is undefined!");
        return res.status(500).json({ message: "JWT is not configured" });
    }

    const db = req.app.locals.db;
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    const admin = await db.collection('admins').findOne({ username });

    if (!admin) {
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }

    const validPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!validPassword) {
        return res.status(401).json({
            message: 'Invalid credentials'
        });
    }

    const token = jwt.sign({
        id: admin._id,
        username: admin.username
    }, JWT_SECRET, { expiresIn: '12h' });

    res.json({ token });

});

router.post('/register', verifyAdminToken, async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const existingAdmin = await db.collection('admins')
            .findOne({ username });
        if (existingAdmin) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newAdmin = {
            username,
            passwordHash,
            createdAt: new Date()
        };

        await db.collection('admins').insertOne(newAdmin);

        res.status(201).json({ message: 'Admin registered successfully' });

    } catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/analytics', verifyAdminToken, async (req, res) => {
    const db = req.app.locals.db;

    const totalChats = await db.collection("chatLogs").countDocuments();

    const topQuestions = await db.collection("chatLogs")
        .aggregate([
            { $group: { _id: "$faqId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]).toArray();

    res.json({
        totalChats,
        topFAQs: topQuestions
    });
});

export default router;