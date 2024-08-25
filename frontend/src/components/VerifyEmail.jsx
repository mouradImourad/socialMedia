import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function VerifyEmail() {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      fetch(`/api/v1/users/email-verify/?token=${token}`)
        .then((response) => response.json())
        .then((data) => {
          setMessage('Email verified successfully!');
          console.log('Email verified:', data);
        })
        .catch((error) => {
          setMessage('Failed to verify email.');
          console.error('Error during email verification:', error);
        });
    }
  }, [token]);

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="row">
        <div className="col text-center">
          <h1 className="mb-4">Email Verification</h1>
          <p className="text-center">{message || 'Verifying your email...'}</p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
