import React, { useState } from 'react';
import '../styles/Login.css'; // Import your CSS file for styling
import { apiRequest } from '../utils/auth.js'; // Import your API request utility

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError('');
  
    // Validate email and password
    try {
        // makes a POST request to the login endpoint
        const response = await apiRequest(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed'); // Use a fallback error message
        }

        const data = await response.json();

        // Store the token in localStorage
        localStorage.setItem('auth-token', data.token);

        // Redirect to the main page
        window.location.href = '/';
      } catch (err) {
        console.error('Error:', err.message); // Log the error
        setError(err.message);
      }
    };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;