import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loanService } from '../services/api';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminLoanDetails() {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoanDetails();
  }, [id]);

  const fetchLoanDetails = async () => {
    try {
      const [loanRes, repaymentsRes] = await Promise.all([
        loanService.getLoanDetails(id),
        loanService.getLoanRepayments(id)
      ]);
      setLoan(loanRes.data.loan);
      setRepayments(repaymentsRes.data);
    } catch (err) {
      toast.error('Failed to fetch loan details');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkOverdue = async (repaymentId) => {
    try {
      await loanService.updateRepaymentStatus(repaymentId, 'OVERDUE');
      toast.success('Repayment marked as overdue');
      fetchLoanDetails();
    } catch (err) {
      toast.error('Failed to update repayment status');
    }
  };

  const calculateLoanStats = () => {
    if (!loan || !repayments.length) return {};

    const totalPaid = repayments.reduce((sum, r) => 
      sum + (r.status === 'PAID' ? r.paidAmount : 0), 0);
    const totalDue = loan.amount - totalPaid;
    const overdueCount = repayments.filter(r => r.status === 'OVERDUE').length;
    const completedCount = repayments.filter(r => r.status === 'PAID').length;

    return { totalPaid, totalDue, overdueCount, completedCount };
  };

  if (loading) return <LoadingSpinner />;
  if (!loan) return <div>Loan not found</div>;

  const stats = calculateLoanStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-6">Loan Details</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-semibold">${loan.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount Paid</p>
            <p className="text-2xl font-semibold">${stats.totalPaid?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount Due</p>
            <p className="text-2xl font-semibold">${stats.totalDue?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-2xl font-semibold">{loan.status}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Repayment Schedule</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Paid Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {repayments.map((repayment) => (
                  <tr key={repayment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(repayment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${repayment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${repayment.status === 'PAID' ? 'bg-green-100 text-green-800' : 
                          repayment.status === 'OVERDUE' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {repayment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {repayment.paidDate ? new Date(repayment.paidDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {repayment.status === 'PENDING' && 
                        new Date(repayment.dueDate) <= new Date() && (
                          <button
                            onClick={() => handleMarkOverdue(repayment._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Mark Overdue
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 