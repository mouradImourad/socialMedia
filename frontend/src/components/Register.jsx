import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    profile_picture: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profile_picture: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('email', formData.email);
    data.append('username', formData.username);
    data.append('password', formData.password);
    if (formData.profile_picture) {
      data.append('profile_picture', formData.profile_picture);
    }

    fetch('http://localhost:8000/api/v1/register/', {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Registration successful:', data);
      })
      .catch((error) => {
        console.error('Error during registration:', error);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <h2>Welcome to Our LifeX!</h2>
          <p>
            Join our community today by creating an account. As a member, you'll
            have access to all our features, including personalized content,
            exclusive offers, and much more. We’re excited to have you with us!
          </p>
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center text-align: center">
          <h1 className="mb-4">Register</h1>
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                name="email" 
                className="form-control" 
                id="email" 
                placeholder="Email" 
                onChange={handleChange} 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input 
                type="text" 
                name="username" 
                className="form-control" 
                id="username" 
                placeholder="Username" 
                onChange={handleChange} 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                name="password" 
                className="form-control" 
                id="password" 
                placeholder="Password" 
                onChange={handleChange} 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="profile_picture" className="form-label">Profile Picture</label>
              <input 
                type="file" 
                name="profile_picture" 
                className="form-control" 
                id="profile_picture" 
                onChange={handleFileChange} 
              />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
