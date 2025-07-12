import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './components';
import './css/Login.css';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? 'https://campusconnect-9tui.onrender.com/api/auth/login'
      : 'https://campusconnect-9tui.onrender.com/api/auth/register';

    try {
      const res = await axios.post(url, formData);
      const userData = res.data.user;

      setMessage(res.data.message || 'Success');

      if (isLogin && res.data.token) {
        if (userData) {
          setUser({
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            followedClubs: userData.followedClubs || []
          });
        }
        localStorage.setItem('token', res.data.token);
        navigate('/home');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? 'New user?' : 'Already have an account?'}{' '}
          <button className="toggle-button" onClick={toggleForm}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>

        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
