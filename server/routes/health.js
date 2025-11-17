import express from 'express';

const route = express.Router();

route.get('/', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Health check passed'
    })
});

export default route;