const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

exports.adminAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Please authenticate' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    next();
}; 