import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
};

export const loanService = {
  createLoan: (loanData) => api.post("/loans", loanData),
  getUserLoans: () => api.get("/loans/user"),
  getAllLoans: () => api.get("/loans/admin/all"),
  getLoanDetails: (id) => api.get(`/loans/${id}`),
  approveLoan: (loanId) => api.patch(`/loans/${loanId}/approve`),
  addRepayment: (repaymentData) => api.post("/loans/repayment", repaymentData),
  getLoanRepayments: (loanId) => api.get(`/loans/${loanId}/repayments`),
  updateRepaymentStatus: (repaymentId, status) => 
    api.patch(`/loans/repayment/${repaymentId}/status`, { status }),
  rejectLoan: (id, data) => api.patch(`/loans/${id}/reject`, data),
};

export default api;
