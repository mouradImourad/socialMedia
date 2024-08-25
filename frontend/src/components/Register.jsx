import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [language, setLanguage] = useState('en');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    if (profilePicture) {
      formData.append('profile_picture', profilePicture);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/register/', formData);
      if (response.status === 201) {
        alert('Account created! Please check your email for verification.');
        setEmail('');
        setUsername('');
        setPassword('');
        setProfilePicture(null);
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
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-5 flex-grow-1">
        <div className="row py-5" style={{ rowGap: '30px' }}>
          {/* Left side paragraph */}
          <div className="col-md-6 d-flex align-items-center" style={{ paddingTop: '20px' }}>
            <div>
              <h2>Welcome to Our Platform</h2>
              <p>
                Join us today and enjoy exclusive benefits. Create an account to get started with our services, stay updated with the latest news, and more. We value your privacy and ensure that your data is secure with us.
              </p>
              <p>
                Our platform offers a range of features to enhance your experience. Whether you’re here to connect with others, share your experiences, or learn something new, we're here to support you every step of the way.
              </p>
            </div>
          </div>

          {/* Right side form */}
          <div className="col-md-6" style={{ paddingTop: '20px' }}>
            <h2 className="mb-4 text-center">Register</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="profile_picture" className="form-label">Profile Picture</label>
                <input
                  type="file"
                  className="form-control"
                  id="profile_picture"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">Create Account</button>
            </form>
          </div>
        </div>
      </div>

      <footer className="mt-4 border-top border-primary">
        <div className="d-flex justify-content-center py-3">
          <label className="me-2">Language: </label>
          <a href="#" className="me-2" onClick={() => setLanguage('en')}>English</a>
          <a href="#" className="me-2" onClick={() => setLanguage('es')}>Spanish</a>
          <a href="#" onClick={() => setLanguage('ar')}>Arabic</a>
        </div>
      </footer>
    </div>
  );
};

export default Register;
