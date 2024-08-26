import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const EmailVerificationPage = () => {
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    
    if (token) {
      axios.get(`http://localhost:8000/api/v1/users/email-verify/?token=${token}`)
        .then(response => {
          setMessage('Email verified successfully!');
        })
        .catch(error => {
          setMessage('Verification failed or link expired.');
        });
    } else {
      setMessage('Invalid verification link.');
    }
  }, [location]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
};

export default EmailVerificationPage;
