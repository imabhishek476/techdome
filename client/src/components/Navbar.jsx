import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActiveLink = (path) => {
    if (path === '/admin') {
      return location.pathname.startsWith('/admin');
    }
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || 
             (location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/admin'));
    }
    return location.pathname === path;
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">
              Mini Loan App
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
                      ${isActiveLink('/admin') 
                        ? 'text-indigo-600 bg-white shadow-md transform scale-105' 
                        : 'text-white hover:bg-indigo-700'}`}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
                    ${isActiveLink('/dashboard')
                      ? 'text-indigo-600 bg-white shadow-md transform scale-105'
                      : 'text-white hover:bg-indigo-700'}`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium ml-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
                    ${isActiveLink('/login')
                      ? 'text-indigo-600 bg-white shadow-md transform scale-105'
                      : 'text-white hover:bg-indigo-700'}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
                    ${isActiveLink('/register')
                      ? 'text-indigo-600 bg-white shadow-md transform scale-105'
                      : 'text-white hover:bg-indigo-700'}`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 