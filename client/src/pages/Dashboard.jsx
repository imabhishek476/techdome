import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loanService } from '../services/api';

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await loanService.getUserLoans();
      setLoans(response.data);
    } catch (err) {
      setError('Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Active Loans</h1>
        <Link
          to="/new-loan"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          New Loan
        </Link>
      </div>

      {loans.length === 0 ? (
        <div className="text-center text-gray-500">No loans found</div>
      ) : ( 
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
          {loans.map((loan) => (
            <li key={loan._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-indigo-600">
                    Amount: ${loan.amount}
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${loan.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                        loan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        loan.status === 'REJECTED' ? 'bg-red-600 text-white' :
                        loan.status === 'PAID' ? 'bg-green-600 text-white' :
                        'bg-gray-100 text-gray-800'}`}>
                      {loan.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="text-sm text-gray-500">
                      Term: {loan.term} weeks
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Created: {new Date(loan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Link 
                  to={`/loans/${loan._id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View Details
                </Link>
              </div>
            </li>
          ))}
          </ul>
        </div>
      )}
    </div>
  );
} 