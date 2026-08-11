import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div style={styles.centerContainer}>
				<p style={styles.loadingText}>Loading session...</p>
			</div>
		);
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const styles: Record<string, React.CSSProperties> = {
	centerContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '100vh',
	},
	loadingText: {
		fontSize: '1rem',
		color: '#666',
	},
};