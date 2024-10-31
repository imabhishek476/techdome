const Loan = require("../models/Loan");
const Repayment = require("../models/Repayment");

// Create new loan
exports.createLoan = async (req, res) => {
  try {
    const { amount, purpose, term } = req.body;
    const userId = req.user.id;

    if (!amount || !purpose || !term) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (amount < 1000 || amount > 100000) {
      return res
        .status(400)
        .json({ error: "Loan amount must be between $1,000 and $100,000" });
    }
    if (term < 1 || term > 52) {
      return res
        .status(400)
        .json({ error: "Loan term must be between 1 and 52 weeks" });
    }
    const loan = await Loan.create({
      userId,
      amount,
      purpose,
      term,
      status: "PENDING",
    });

    // calc repayment schedule
    const weeklyAmount = Number((amount / term).toFixed(2));
    const remainingAmount = Number(
      (amount - weeklyAmount * (term - 1)).toFixed(2)
    );

    const repayments = [];
    let currentDate = new Date();

    // Create repayment schedule
    for (let i = 0; i < term; i++) {
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 7));

      repayments.push({
        loanId: loan._id,
        userId: userId,
        amount: i === term - 1 ? remainingAmount : weeklyAmount,
        dueDate: new Date(currentDate),
        status: "PENDING",
        paidAmount: 0,
      });
    }

    await Repayment.insertMany(repayments);

    // Populate user details before sending response
    const populatedLoan = await Loan.findById(loan._id).populate(
      "userId",
      "email"
    );

    res.status(201).json({
      loan: populatedLoan,
      repayments,
      message: "Loan application submitted successfully",
    });
  } catch (error) {
    console.error("Create loan error:", error);
    res.status(500).json({ error: "Failed to create loan application" });
  }
};

exports.approveLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    if (loan.status !== "PENDING") {
      return res.status(400).json({ error: "Loan is not in pending status" });
    }

    loan.status = "APPROVED";
    loan.startDate = new Date();
    await loan.save();

    const populatedLoan = await Loan.findById(loan._id).populate(
      "userId",
      "email"
    );
    res.json({ loan: populatedLoan, message: "Loan approved successfully" });
  } catch (error) {
    console.error("Approve loan error:", error);
    res.status(500).json({ error: "Failed to approve loan" });
  }
};

exports.getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("userId", "email");
    res.json(loans);
  } catch (error) {
    console.error("Get user loans error:", error);
    res.status(500).json({ error: "Failed to fetch loans" });
  }
};

exports.addRepayment = async (req, res) => {
  try {
    const { repaymentId, amount } = req.body;

    if (!repaymentId || !amount) {
      return res
        .status(400)
        .json({ error: "Repayment ID and amount are required" });
    }

    const repayment = await Repayment.findById(repaymentId);
    if (!repayment) {
      return res.status(404).json({ error: "Repayment not found" });
    }

    // Verify user owns this repayment
    if (repayment.userId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to make this repayment" });
    }

    if (repayment.status === "PAID") {
      return res
        .status(400)
        .json({ error: "This repayment has already been paid" });
    }

    if (amount < repayment.amount) {
      return res.status(400).json({ error: "Insufficient payment amount" });
    }

    repayment.status = "PAID";
    repayment.paidAmount = amount;
    repayment.paidDate = new Date();
    await repayment.save();

    // Check if all repayments are paid
    const allRepayments = await Repayment.find({ loanId: repayment.loanId });
    const allPaid = allRepayments.every((r) => r.status === "PAID");

    if (allPaid) {
      await Loan.findByIdAndUpdate(repayment.loanId, {
        status: "PAID",
        completedDate: new Date(),
      });
    }

    res.json({
      repayment,
      message: "Repayment processed successfully",
    });
  } catch (error) {
    console.error("Add repayment error:", error);
    res.status(500).json({ error: "Failed to process repayment" });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    console.error("Get all loans error:", error);
    res.status(500).json({ error: "Failed to fetch loans" });
  }
};

exports.getLoanDetails = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate("userId", "email");

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // is user is admin or loan owner
    if (
      req.user.role !== "admin" &&
      loan.userId._id.toString() !== req.user.id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this loan" });
    }

    // Get repayments for this loan
    const repayments = await Repayment.find({ loanId: loan._id }).sort({
      dueDate: 1,
    });

    res.json({
      loan,
      repayments,
    });
  } catch (error) {
    console.error("Get loan details error:", error);
    res.status(500).json({ error: "Failed to fetch loan details" });
  }
};

exports.getLoanRepayments = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // is authorization
    if (
      req.user.role !== "admin" &&
      loan.userId.toString() !== req.user.id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to view these repayments" });
    }

    const repayments = await Repayment.find({ loanId: req.params.id }).sort({
      dueDate: 1,
    });

    res.json(repayments);
  } catch (error) {
    console.error("Get loan repayments error:", error);
    res.status(500).json({ error: "Failed to fetch repayments" });
  }
};

exports.updateRepaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["PENDING", "PAID", "OVERDUE"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const repayment = await Repayment.findById(id);
    if (!repayment) {
      return res.status(404).json({ error: "Repayment not found" });
    }

    repayment.status = status;
    await repayment.save();

    // is all repayments are paid, update loan status
    if (status === "PAID") {
      const allRepayments = await Repayment.find({ loanId: repayment.loanId });
      const allPaid = allRepayments.every((r) => r.status === "PAID");

      if (allPaid) {
        await Loan.findByIdAndUpdate(repayment.loanId, {
          status: "PAID",
          completedDate: new Date(),
        });
      }
    }

    res.json({ message: "Repayment status updated successfully" });
  } catch (error) {
    console.error("Update repayment status error:", error);
    res.status(500).json({ error: "Failed to update repayment status" });
  }
};

exports.rejectLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    if (loan.status !== "PENDING") {
      return res.status(400).json({ error: "Can only reject pending loans" });
    }

    loan.status = "REJECTED";
    loan.rejectionReason = reason;
    await loan.save();

    res.json({ message: "Loan rejected successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to Reject Loan" });
  }
};
