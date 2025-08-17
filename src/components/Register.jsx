import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'; 
import { apiRequest, isLoggedIn } from '../utils/auth.js';

const Register = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    isLoggedIn().then(result => {
      setIsAuthenticated(result);
      if (result) {
        navigate('/profile');
      }
    });
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await apiRequest('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed'); 
      }

      setSuccess(true);

      const loginResponse = await apiRequest('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error('Registration succeeded, but login failed');
      }


      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister} className="register-form">
        <h2>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>Registration successful! Redirecting to profile page...</p>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      </div>
  );
};

export default Register;