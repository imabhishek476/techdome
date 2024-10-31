import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanService } from '../services/api';
import { toast } from 'react-hot-toast';

function NewLoan() {
  const [loanData, setLoanData] = useState({
    amount: '',
    term: '',
    purpose: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(loanData.amount < 1000 || loanData.amount > 100000){
        toast.error('Loan amount must be between 1000 and 100000');
        return;
      }
      if(loanData.term < 1 || loanData.term > 52){
        toast.error('Loan term must be between 1 and 52 weeks');
        return;
      }
      const formattedData = {
        amount: Number(loanData.amount),
        term: Number(loanData.term),
        purpose: loanData.purpose
      };

      await loanService.createLoan(formattedData);
      toast.success('Loan application submitted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create loan');
      console.error('Failed to create loan:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Apply for New Loan</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Loan Amount ($)
          </label>
          <input
            type="number"
            minLength={1000}
            maxLength={100000}
            placeholder='Enter loan amount upto 100000'
            value={loanData.amount}
            onChange={(e) => setLoanData({...loanData, amount: e.target.value})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Loan Term (weeks)
          </label>
          <input
            type="number"
            minLength={1}
            maxLength={52}
            value={loanData.term}
            placeholder='Enter loan term upto 52 weeks'
            onChange={(e) => setLoanData({...loanData, term: e.target.value})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter the number of weeks for loan repayment
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Purpose
          </label>
          <select
            value={loanData.purpose}
            onChange={(e) => setLoanData({...loanData, purpose: e.target.value})}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select Purpose</option>
            <option value="business">Business</option>
            <option value="personal">Personal</option>
            <option value="education">Education</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

export default NewLoan; 