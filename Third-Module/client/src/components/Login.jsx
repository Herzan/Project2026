import { useState } from 'react';
import * as api from '../api.js';

export default function Login({ onLoggedIn }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data =
        mode === 'login'
          ? await api.login({ username, password })
          : await api.register({ username, name, password });
      onLoggedIn(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const isLogin = mode === 'login';

  return (
    <div className="container">
      <h1>✅ Task Manager</h1>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Log in' : 'Create account'}</h2>

        <input
          type="text"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {!isLogin && (
          <input
            type="text"
            placeholder="Full name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="btn-add" disabled={busy}>
          {busy ? 'Please wait...' : isLogin ? 'Log in' : 'Sign up'}
        </button>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setMode(isLogin ? 'register' : 'login');
              setError('');
            }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>

        {isLogin && (
          <p className="auth-hint">
            Demo (after running the seed): <b>admin</b> / <b>admin123</b>
          </p>
        )}
      </form>
    </div>
  );
}
