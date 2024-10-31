const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { auth, adminAuth } = require('../middleware/auth');

// admin
router.get('/admin/all', auth, adminAuth, loanController.getAllLoans);
router.patch('/repayment/:id/status', auth, adminAuth, loanController.updateRepaymentStatus);
router.patch('/:id/reject', auth, adminAuth, loanController.rejectLoan);
router.patch('/:id/approve', auth, adminAuth, loanController.approveLoan);

// user
router.post('/', auth, loanController.createLoan);
router.get('/user', auth, loanController.getUserLoans);
router.post('/repayment', auth, loanController.addRepayment);
router.get('/:id', auth, loanController.getLoanDetails);
router.get('/:id/repayments', auth, loanController.getLoanRepayments);

module.exports = router;