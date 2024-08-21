// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log('Attempting to log in with:', { email, password });
    
    try {
        const response = await axios.post('http://localhost:8000/api/v1/users/login/', {
            email,
            password,
        });
        
        if (response.status === 200) {
            const { access, refresh } = response.data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            alert('Login successful!');
            setEmail('');
            setPassword('');
            navigate('/test'); // Redirect to the home page
        }
    } catch (error) {
        console.error('Error logging in:', error.response ? error.response.data : error.message);
        alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
