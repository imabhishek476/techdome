const Joi = require('joi');
const { VALIDATION } = require('./constants');

const schemas = {
    loan: Joi.object({
        amount: Joi.number()
            .min(VALIDATION.MIN_LOAN_AMOUNT)
            .max(VALIDATION.MAX_LOAN_AMOUNT)
            .required(),
        term: Joi.number()
            .min(VALIDATION.MIN_LOAN_TERM)
            .max(VALIDATION.MAX_LOAN_TERM)
            .required()
    }),

    repayment: Joi.object({
        amount: Joi.number().required(),
        repaymentId: Joi.string().required()
    }),

    user: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('user', 'admin')
    })
};

module.exports = schemas; 