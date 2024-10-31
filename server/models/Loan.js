const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1000,
    max: 100000
  },
  term: {
    type: Number,
    required: true,
    min: 1,
    max: 52
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'PAID', 'REJECTED'],
    default: 'PENDING'
  },
  rejectionReason: {
    type: String,
    default: null
  },
  purpose: {
    type: String,
    required: true,
    enum: ['business', 'personal', 'education']
  },
  startDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema); 