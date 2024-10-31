import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loanService } from '../services/api';
import { toast } from 'react-hot-toast';
import RepaymentModal from '../components/RepaymentModal';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LoanDetails() {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepayment, setSelectedRepayment] = useState(null);

  useEffect(() => {
    fetchLoanDetails();
  }, [id]);

  const fetchLoanDetails = async () => {
    try {
      const response = await loanService.getLoanDetails(id);
      setLoan(response.data.loan);
      setRepayments(response.data.repayments);
    } catch (err) {
      toast.error('Failed to fetch loan details');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    fetchLoanDetails();
  };

  const renderLoanStatus = () => {
    switch(loan.status) {
      case 'PENDING':
        return (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">
              Your loan application is pending approval. We'll notify you once it's reviewed.
            </p>
          </div>
        );
      case 'REJECTED':
        return (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-700">
              Your loan application was rejected.
              {loan.rejectionReason && (
                <span className="block mt-1">Reason: {loan.rejectionReason}</span>
              )}
            </p>
          </div>
        );
      case 'APPROVED':
        return (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <p className="text-green-700">
              Your loan has been approved! You can now make repayments.
            </p>
          </div>
        );
      case 'PAID':
        return (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <p className="text-blue-700">
              Congratulations! This loan has been fully paid.
            </p>
          </div>
        );
    }
  };

  const canMakeRepayment = (repayment) => {
    return (
      loan.status === 'APPROVED' && 
      (repayment.status === 'PENDING' || repayment.status === 'OVERDUE')
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!loan) return <div>Loan not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {renderLoanStatus()}
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Loan Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Amount</p>
            <p className="font-medium">${loan.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-medium">{loan.status}</p>
          </div>
          <div>
            <p className="text-gray-600">Term</p>
            <p className="font-medium">{loan.term} weeks</p>
          </div>
          <div>
            <p className="text-gray-600">Purpose</p>
            <p className="font-medium">{loan.purpose}</p>
          </div>
        </div>
      </div>

      {loan.status === 'APPROVED' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Repayment Schedule</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
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
                      {(repayment.status === 'PENDING' || repayment.status === 'OVERDUE') && (
                        <button
                          onClick={() => setSelectedRepayment(repayment)}
                          className={`px-3 py-1 rounded-md text-sm font-medium
                            ${repayment.status === 'OVERDUE' 
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-indigo-600 hover:text-indigo-900'
                            }`}
                        >
                          {repayment.status === 'OVERDUE' ? 'Pay Overdue' : 'Make Payment'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedRepayment && (
        <RepaymentModal
          repayment={selectedRepayment}
          onClose={() => setSelectedRepayment(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
} 