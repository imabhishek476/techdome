module.exports = {
    // Database
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/loan-app',
    
    // Server
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Authentication
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRE: '30d',
    
    // Loan Status
    LOAN_STATUS: {
        PENDING: 'PENDING',
        APPROVED: 'APPROVED',
        PAID: 'PAID',
        REJECTED: 'REJECTED'
    },
    
    // Repayment Status
    REPAYMENT_STATUS: {
        PENDING: 'PENDING',
        PAID: 'PAID',
        OVERDUE: 'OVERDUE'
    },
    
    // User Roles
    USER_ROLES: {
        ADMIN: 'admin',
        USER: 'user'
    },
    
    // API Endpoints
    API_PREFIX: '/api',
    
    // Validation Constants
    VALIDATION: {
        MIN_LOAN_AMOUNT: 1000,
        MAX_LOAN_AMOUNT: 100000,
        MIN_LOAN_TERM: 1,
        MAX_LOAN_TERM: 52
    }
}; 