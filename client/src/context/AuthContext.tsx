import React from 'react'
import type { User } from '../types/api'
import { authApi } from '../api/auth'

interface AuthContextType {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (credentials: { email: string; password: string }) => Promise<void>;
	register: (data: { fullName: string; email: string; password: string }) => Promise<void>;
	logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = React.useState<User | null>(null);
	const [token, setToken] = React.useState(localStorage.getItem('token'));
	const [isLoading, setIsLoading] = React.useState(true);

	// Verify token & restore session
	React.useEffect(() => {
		const initAuth = async () => {
			const storedToken = localStorage.getItem('token');
			if (storedToken) {
				try {
					const res = await authApi.getCurrentUser();
					setUser(res.user);
					setToken(storedToken);
				} catch (error) {
					console.error('Session restoration failed:', error);
					// Token expired or invalid -> clear local storage
					localStorage.removeItem('token');
					setToken(null);
					setUser(null);
				}
			}
			setIsLoading(false);
		};

		initAuth();
	}, []);

	const login = async (credentials: { email: string; password: string }) => {
		const res = await authApi.login(credentials);
		localStorage.setItem('token', res.token);
		setToken(res.token);
		setUser(res.user);
	};

	const register = async (data: { fullName: string; email: string; password: string }) => {
		const res = await authApi.register(data);
		localStorage.setItem('token', res.token);
		setToken(res.token);
		setUser(res.user);
	};

	const logout = () => {
		localStorage.removeItem('token');
		setToken(null);
		setUser(null);
	};

	return (
		<AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
	);
};

// Custom hook for consuming auth context safely
export const useAuth = () => {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};