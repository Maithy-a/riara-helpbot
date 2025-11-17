import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
    const db = req.app.locals.db;
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await db.collection('admins')
        .findOne({ username });
    if (!admin) {
        return res.status(401)
            .json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!validPassword) {
        return res.status(401)
            .json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
        {
            id: admin._id,
            username: admin.username
        },
        JWT_SECRET, {
        expiresIn: '8h'
    });

    res.json({ token });

});

export default router;
