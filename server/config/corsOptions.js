const constants = require('./constants');

const corsOptions = {
    origin: constants.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL] 
        : ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = corsOptions; 