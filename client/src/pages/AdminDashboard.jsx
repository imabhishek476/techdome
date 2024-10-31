import { useState, useEffect } from 'react';
import { loanService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [repayments, setRepayments] = useState([]);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await loanService.getAllLoans();
      setLoans(response.data);
    } catch (err) {
      toast.error('Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };
  const handleRejectLoan = async () => {
    try {
      await loanService.rejectLoan(selectedLoan._id, { reason: rejectionReason });
      toast.success('Loan rejected successfully');
      setRejectModalOpen(false);
      setRejectionReason('');
      setSelectedLoan(null);
      fetchLoans();
    } catch (err) {
      toast.error('Failed to reject loan');
    }
  };

  const handleApproveLoan = async (loanId) => {
    try {
      await loanService.approveLoan(loanId);
      toast.success('Loan approved successfully');
      fetchLoans();
    } catch (err) {
      toast.error('Failed to approve loan');
    }
  };

  const handleViewRepayments = async (loanId) => {
    try {
      const response = await loanService.getLoanRepayments(loanId);
      setRepayments(response.data);
      setSelectedLoan(loans.find(loan => loan._id === loanId));
    } catch (err) {
      toast.error('Failed to fetch repayments');
    }
  };

  const calculateLoanStats = (loan) => {
    const loanRepayments = repayments.filter(r => r.loanId === loan._id);
    const totalPaid = loanRepayments.reduce((sum, r) => sum + (r.status === 'PAID' ? r.amount : 0), 0);
    const totalDue = loan.amount - totalPaid;
    const overdueRepayments = loanRepayments.filter(r => 
      r.status === 'PENDING' && new Date(r.dueDate) < new Date()
    ).length;

    return { totalPaid, totalDue, overdueRepayments };
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold mb-6">Loan Management Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Loans</h3>
          <p className="text-3xl font-bold">{loans.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Pending Approval</h3>
          <p className="text-3xl font-bold">{loans.filter(l => l.status === 'PENDING').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Active Loans</h3>
          <p className="text-3xl font-bold">{loans.filter(l => l.status === 'APPROVED').length}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Term
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{loan.userId.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${loan.amount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${loan.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                      loan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      loan.status === 'REJECTED' ? 'bg-red-600 text-white' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {loan.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {loan.term} weeks
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(loan.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {loan.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleApproveLoan(loan._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLoan(loan);
                            setRejectModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <Link
                      to={`/admin/loans/${loan._id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rejectModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Reject Loan</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter rejection reason..."
              required
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectionReason('');
                  setSelectedLoan(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectLoan}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject Loan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 