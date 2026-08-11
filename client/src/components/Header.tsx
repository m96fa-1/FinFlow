import { useAuth } from '../context/AuthContext'

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header>
      {isAuthenticated && user ? (
        <div>
          <span>Welcome, {user.fullName}!</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <a href="/login">Login</a>
      )}
    </header>
  );
}