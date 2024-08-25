import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    console.log("Token:", token);  // Debugging: Check the token value

    if (token) {
      axios.get(`/api/en/api/v1/users/email-verify/?token=${token}`)
        .then((response) => {
          console.log("API Response:", response.data);  // Debugging: Check the API response
          if (response.data && response.data.email) {
            setMessage(response.data.email);
          } else {
            setMessage('Email verified successfully!');
          }
        })
        .catch((error) => {
          console.error('Error during email verification:', error);  // Debugging: Log the error
          setMessage('Failed to verify email.');
        });
    } else {
      setMessage('Invalid verification link.');
    }
  }, [token]);

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="row">
        <div className="col text-center">
          <h1 className="mb-4">Email Verification</h1>
          <p className={`alert ${message.includes('successfully') || message.includes('activated') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
