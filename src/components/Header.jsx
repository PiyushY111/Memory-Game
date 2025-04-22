import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

function Header({ onLoginClick }) {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState('');

  const handleLogout = async () => {
    setError('');
    try {
      await logout();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLoginButtonClick = () => {
    console.log('Login button clicked');
    if (onLoginClick) {
      onLoginClick();
    }
  };

  const displayName = currentUser?.displayName || currentUser?.email || 'User';

  return (
    <header>
      <div className="header-container">
        <a href="/" aria-label="Go to home">
          <img src="/logo.svg" width={288} height={60} alt="MatchUp logo" className="logo" />
        </a>
        <div>
          {currentUser ? (
            <>
              <span style={{ marginRight: '0.5rem' }}>Welcome,</span>
              <span>{displayName}</span>
              <button className="auth-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="auth-button" onClick={handleLoginButtonClick}>Login / Signup</button>
          )}
        </div>
      </div>
      {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
    </header>
  );
}

export default Header;
