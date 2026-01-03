import { useState } from 'react';
import axios from 'axios';
import '../css/login.css';

const Login = ({ onAuth, onSwitch }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/auth/login', { username, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      onAuth(user);
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h3>Log in</h3>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Log in</button>
      <div className="auth-switch">New here? <button type="button" className="link-btn" onClick={() => onSwitch?.('register')}>Create account</button></div>
    </form>
  );
};

export default Login;
