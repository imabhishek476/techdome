const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Loan Application API',
            version: '1.0.0',
            description: 'A simple loan application API'
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            }
        ]
    },
    apis: ['./routes/*.js']
};

module.exports = swaggerOptions; 