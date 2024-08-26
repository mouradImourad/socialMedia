import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MyNavbar from './MyNavbar';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    email: '',
    username: '',
    profile_picture: '',
    created_at: '',
    updated_at: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/users/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setProfileData(response.data);
        setNewUsername(response.data.username);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          setError('Error fetching profile data');
        }
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('username', newUsername);
    if (newProfilePicture) {
      formData.append('profile_picture', newProfilePicture);
    }

    try {
      const response = await axios.patch('http://localhost:8000/api/v1/users/profile/update/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setProfileData(response.data);
      alert('Profile updated successfully');
      
      setNewUsername('');
      setNewProfilePicture(null);
      fileInputRef.current.value = null;
    } catch (error) {
      setError('Error updating profile');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <>
      <MyNavbar />
      <div className="container mt-5">
        <div className="row">
          {/* Left Column - Profile Picture and Update Form */}
          <div className="col-md-3">
            <div className="card shadow-sm mb-4">
              <div className="card-body text-center">
                <div className="mb-4">
                  <img
                    src={profileData.profile_picture || 'default-profile.png'}
                    alt="Profile"
                    className="rounded-circle img-fluid"
                    style={{ width: '150px', height: '150px', objectFit: 'cover', border: '5px solid #007bff' }}
                  />
                </div>
                <h2 className="card-title">{profileData.username}</h2>
                <p className="text-muted">{profileData.email}</p>
                <p>Joined: {new Date(profileData.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="mb-4 text-center">Edit Profile</h3>
                <form onSubmit={handleProfileUpdate}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      className="form-control"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="profile_picture" className="form-label">Profile Picture</label>
                    <input
                      type="file"
                      id="profile_picture"
                      name="profile_picture"
                      className="form-control"
                      ref={fileInputRef}
                      onChange={(e) => setNewProfilePicture(e.target.files[0])}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Update Profile</button>
                </form>
              </div>
            </div>
          </div>

          {/* Middle Column - Empty for now */}
          <div className="col-md-6"></div>

          {/* Right Column - Empty for now */}
          <div className="col-md-3"></div>
        </div>
      </div>
    </>
  );
};

export default Profile;
