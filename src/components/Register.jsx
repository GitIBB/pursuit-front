import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css'; 
import { apiRequest } from '../utils/auth.js';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); 

  const handleRegister = async (e) => { // Handle form submission
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await apiRequest('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }), // Send user data to the server
      });

      if (!response.ok) {  // Check if the response is OK
        throw new Error('Registration failed'); 
      }


      // Remove this, outdated with the new API fetching functions
      // Extract token from the response
      // const { token } = await response.json();

      // Store the token in local storage or a state management library
      // localStorage.setItem('auth_token', token);

      setSuccess(true);

      navigate('/profile'); // Redirect to the profile page after successful registration
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