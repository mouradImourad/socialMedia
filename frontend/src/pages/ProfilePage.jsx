import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/v1/users/profile/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile data', error);
            }
        };

        fetchProfileData();
    }, []);

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="profile-container">
                <h1>{profileData.username}'s Profile</h1>
                <img src={profileData.profile_picture} alt="Profile" />
                <p>Email: {profileData.email}</p>
                <button>Edit Profile</button>
                <button>Change Password</button>
                <button>Deactivate Account</button>
                <button>Delete Account</button>
            </div>
        </div>
    );
};

export default ProfilePage;
