import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function LoginPopup({ onClose }) {
  const { login, signup, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleLogin = async () => {
    setError('');
    try {
      await login(email, password);
      onClose();
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async () => {
    setError('');
    try {
      await signup(email, password);
      onClose();
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      onClose();
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="login-page"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        padding: '2rem',
        zIndex: 1000,
      }}
    >
      <div
        className="login-container"
        style={{
          backgroundColor: '#333',
          padding: '2rem',
          borderRadius: '8px',
          width: '320px',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>{isSignup ? 'Sign Up' : 'Login'}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ marginBottom: '0.75rem', padding: '0.5rem', width: '100%', borderRadius: '4px', border: 'none' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ marginBottom: '0.75rem', padding: '0.5rem', width: '100%', borderRadius: '4px', border: 'none' }}
        />
        {error && <div style={{ color: 'red', marginBottom: '0.75rem' }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button
            onClick={isSignup ? handleSignup : handleLogin}
            style={{
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1,
              marginRight: '0.5rem',
            }}
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
          <button
            onClick={() => setIsSignup(!isSignup)}
            style={{
              backgroundColor: '#2196f3',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            {isSignup ? 'Switch to Login' : 'Switch to Sign Up'}
          </button>
        </div>
        <button
          onClick={handleGoogleLogin}
          style={{
            backgroundColor: '#db4437',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '1rem',
          }}
        >
          Login with Google
        </button>
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default LoginPopup;
