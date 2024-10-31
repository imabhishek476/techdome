import { useState } from 'react';
import { loanService } from '../services/api';
import { toast } from 'react-hot-toast';

export default function RepaymentModal({ repayment, onClose, onSuccess }) {
  const [amount, setAmount] = useState(repayment.amount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (parseFloat(amount) < repayment.amount) {
        toast.error('Amount must be at least the required payment amount');
        return;
      }

      await loanService.addRepayment({
        repaymentId: repayment._id,
        amount: parseFloat(amount)
      });
      
      toast.success('Payment processed successfully');
      onSuccess();
      onClose();
    } catch (err) {
        setError(err.response?.data?.error || 'Failed to process repayment');
      toast.error(err.response?.data?.error || 'Failed to process repayment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Make Repayment</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount ($)
            </label>
            <input
              type="number"
              min={repayment.amount}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Minimum payment: ${repayment.amount}
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Submit Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 