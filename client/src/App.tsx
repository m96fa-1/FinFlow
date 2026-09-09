import { Routes, Route } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import PageNotFound from './layouts/PageNotFound'

import RootPage from './pages/RootPage'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

import DashboardPage from './pages/DashboardPage'
import CategoriesPage from './pages/CategoriesPage'
import TransactionsPage from './pages/TransactionsPage'
import BudgetsPage from './pages/BudgetsPage'
import CreateCategoryModalPage from './pages/CreateCategoryModalPage'
import AddTransactionModalPage from './pages/AddTransactionModalPage'
import NewBudgetModalPage from './pages/NewBudgetModalPage'

export default function App() {
	return (
		<Routes>
			{/* Public Routes */}
			<Route index element={<RootPage />} />
			<Route path='login' element={<LoginPage />} />
			<Route path='register' element={<RegisterPage />} />

			{/* Protected Routes (Requires JWT Authentication) */}
			<Route element={<ProtectedRoute />}>
				<Route path='dashboard' element={<DashboardPage />} />
				<Route path='categories' element={<CategoriesPage />}>
					<Route path='new' element={<CreateCategoryModalPage />} />
				</Route>
				<Route path='transactions' element={<TransactionsPage />}>
					<Route path='new' element={<AddTransactionModalPage />} />
				</Route>
				<Route path='budgets' element={<BudgetsPage />}>
					<Route path='new' element={<NewBudgetModalPage />} />
				</Route>
			</Route>

			{/* Page Not Found */}
			<Route path='*' element={<PageNotFound />} />
		</Routes>
	);
}