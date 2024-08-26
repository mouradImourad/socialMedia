import React, { useState } from 'react';
import axios from 'axios';
import './SignUpPage.css';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // Username input field added
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    console.log('Submitting registration:', { email, username, password, profile_picture: null });
    
    try {
        const response = await axios.post('http://localhost:8000/api/v1/users/register/', {
            email,
            username,
            password,
            profile_picture: null, 
        });
        if (response.status === 201) {
          alert('Account created! Please check your email for verification.');
          setEmail('');
            setUsername('');
            setPassword('');
        }
    } catch (error) {
        if (error.response && error.response.data) {
            const errorData = error.response.data;
            if (errorData.email) {
                alert(`Email error: ${errorData.email.join(', ')}`);
            }
            if (errorData.username) {
                alert(`Username error: ${errorData.username.join(', ')}`);
            }
        } else {
            alert('An unexpected error occurred. Please try again.');
        }
        console.error('Error registering user:', error.response ? error.response.data : error.message);
    }
};

  return (
    <div className="container">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
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
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          Create Account
        </button>
      </form>
      <footer>
    <div className="language-options">
        <label>Language: </label>
        <a
            href="#"
            className="language-link"
            onClick={() => setLanguage('en')}
        >
            English
        </a>
        <a
            href="#"
            className="language-link"
            onClick={() => setLanguage('es')}
        >
            Spanish
        </a>
        <a
            href="#"
            className="language-link"
            onClick={() => setLanguage('ar')}
        >
            Arabic
        </a>
        {/* Add more languages as needed */}
    </div>
</footer>
    </div>
  );
};

export default SignUpPage;
