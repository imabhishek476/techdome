import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth';
import { Suspense, lazy } from 'react'
import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const NewLoan = lazy(() => import('./pages/NewLoan'))
const LoanDetails = lazy(() => import('./pages/LoanDetails'))
const AdminLoanDetails = lazy(() => import('./pages/AdminLoanDetails'))

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (adminRequired && user.role !== 'admin') {
    return <Navigate to="/dashboard" />
  }

  return children
}

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } />
            <Route path="/register" element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            } />

            {/* User */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-loan"
              element={
                <ProtectedRoute>
                  <NewLoan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loans/:id"
              element={
                <ProtectedRoute>
                  <LoanDetails />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminRequired>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/loans/:id"
              element={
                <ProtectedRoute adminRequired>
                  <AdminLoanDetails />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App
