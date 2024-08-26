import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Container, Col } from 'react-bootstrap';

const ProfileUpdate = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/v1/users/profile/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(response => {
            const { email, username, profile_picture } = response.data;
            setEmail(email || '');
            setUsername(username || '');
            setProfilePicture(profile_picture || null);
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.trim() || !username.trim()) {
            alert("Email and Username fields cannot be blank.");
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
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
            console.log('Profile updated successfully:', response.data);
            setEmail(response.data.email);
            setUsername(response.data.username);
            setProfilePicture(response.data.profile_picture);
            navigate('/profile');
        })
        .catch(error => {
            if (error.response && error.response.data) {
                console.error('Error updating profile:', error.response.data);
                alert(JSON.stringify(error.response.data));
            } else {
                console.error('Error updating profile:', error);
            }
        });
    };

    return (
        <Container>
            <h2>Update Profile</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your new email"
                    />
                </Form.Group>

                <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your new username"
                    />
                </Form.Group>

                <Form.Group controlId="formProfilePicture">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => setProfilePicture(e.target.files[0])}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>

            <Col md={4} className="text-center mt-4">
                <img 
                    src={`${profilePicture}?${new Date().getTime()}`} 
                    className="rounded-circle" 
                    alt="Profile" 
                    width="150" 
                />
            </Col>
        </Container>
    );
};

export default ProfileUpdate;
