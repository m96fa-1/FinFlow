import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import PageNotFound from './layouts/PageNotFound'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import BudgetsPage from './pages/BudgetsPage'

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Public Routes */}
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />

				{/* Protected Routes (Requires JWT Authentication) */}
				<Route element={<ProtectedRoute />}>
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route path="/transactions" element={<TransactionsPage />} />
					<Route path="/budgets" element={<BudgetsPage />} />
				</Route>

				{/* Default Redirect */}
				<Route path="/" element={<Navigate to="/dashboard" replace />} />
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</BrowserRouter>
	);
}