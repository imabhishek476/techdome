require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const corsOptions = require('./config/corsOptions');
const constants = require('./config/constants');
const logger = require('./config/logger');

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use(`${constants.API_PREFIX}/auth`, require('./routes/auth'));
app.use(`${constants.API_PREFIX}/loans`, require('./routes/loan'));

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(constants.PORT, () => {
    logger.info(`Server is running on port ${constants.PORT}`);
});

module.exports = app; // For testing purposes