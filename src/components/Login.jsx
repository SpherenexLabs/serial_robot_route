import { useState } from 'react';
import { Lock, User } from 'lucide-react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Fixed credentials
    const ADMIN_USERNAME = 'sasrna';
    const ADMIN_PASSWORD = 'batch2225';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onLogin();
      setError('');
    } else {
      setError('Invalid username or password');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>SmartVision</h1>
          <p>Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <User size={20} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>

          <div className="login-footer">
            <p className="login-hint">
              Default credentials: <br />
              <strong>Username:</strong> admin <br />
              <strong>Password:</strong> admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
