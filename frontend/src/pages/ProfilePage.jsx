import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Post from '../components/Post';  
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const [userData, setUserData] = useState({});
    const [userPosts, setUserPosts] = useState([]); 
    const [editMode, setEditMode] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/v1/users/profile/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(response => {
            setUserData(response.data);
            setUsername(response.data.username);
            setEmail(response.data.email);
            setProfilePicture(response.data.profile_picture); // Set profile picture
            fetchUserPosts(response.data.id); 
        })
        .catch(error => {
            console.error('Error fetching profile:', error.response ? error.response.data : error.message);
        });
    }, []);

    const fetchUserPosts = (userId) => {
        axios.get(`http://localhost:8000/api/v1/posts/user/${userId}/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(response => {
            setUserPosts(response.data.results); // Assuming API returns paginated results
        })
        .catch(error => {
            console.error('Error fetching posts:', error.response ? error.response.data : error.message);
        });
    };

    const handleFileChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        if (profilePicture) {
            formData.append('profile_picture', profilePicture);
        }

        axios.put('http://localhost:8000/api/v1/users/profile/update/', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            setUserData(response.data);
            setEditMode(false);
            setMessage('Profile updated successfully!');
        })
        .catch(error => {
            console.error('Error updating profile:', error.response ? error.response.data : error.message);
            setMessage('Failed to update profile.');
        });
    };

    return (
        <div>
            <Navbar />
            <div className="profile-container">
                <div className="profile-sidebar">
                    <div className="profile-picture-container">
                        <img src={`${userData.profile_picture}?${new Date().getTime()}`} alt="Profile" />
                        <h1>{userData.username}'s Profile</h1>
                        <p>{userData.email}</p>
                    </div>
                    <button className="edit-profile-button" onClick={() => setEditMode(!editMode)}>
                        Edit Profile
                    </button>
                    <button className="settings-button">
                        Settings
                    </button>
                </div>
                <div className="profile-details">
                    {editMode && (
                        <div className="edit-form">
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Profile Picture</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <button onClick={handleSave}>Save Changes</button>
                        </div>
                    )}
                    {message && <p>{message}</p>}

                    <div className="user-posts">
                        <h2>Your Posts</h2>
                        {userPosts.length > 0 ? (
                            userPosts.map(post => (
                                <Post key={post.id} post={post} userProfilePicture={userData.profile_picture} />
                            ))
                        ) : (
                            <p>No posts yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
