import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Image, Spinner, Button, Form, Alert } from 'react-bootstrap';
import Navbar from './Navbar';
import CreatePost from './CreatePost';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:8000/api/v1/users/profile/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setProfile(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching the profile', error);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleDeactivateAccount = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.put('http://localhost:8000/api/v1/users/account-deactivate/', {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setMessage({ type: 'warning', text: 'Account deactivated successfully!' });
        } catch (error) {
            console.error('Error deactivating the account', error);
            setMessage({ type: 'danger', text: 'Failed to deactivate account. Please try again.' });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.delete('http://localhost:8000/api/v1/users/delete-account/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setMessage({ type: 'danger', text: 'Account deleted successfully!' });
            // Optional: Redirect to a different page after account deletion
        } catch (error) {
            console.error('Error deleting the account', error);
            setMessage({ type: 'danger', text: 'Failed to delete account. Please try again.' });
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" />
            </Container>
        );
    }

    const buttonStyle = {
        width: '100%', // Adjust to fill the column width
    };

    const profileContainerHeight = '90%'; // This will make the empty container 10% less in height

    return (
        <>
            <Navbar />
            <Container className="mt-3">
                <Row>
                    {/* Left Column: Profile Information (25%) */}
                    <Col md={3}>
                        {message && <Alert variant={message.type}>{message.text}</Alert>}
                        <Image 
                            src={profile.profile_picture} 
                            roundedCircle 
                            fluid 
                            style={{ width: '200px', height: '200px', objectFit: 'cover' }} 
                        />
                        <h3 className="mt-3">{profile.username}</h3> {/* Display Username */}
                        <p>{profile.email}</p> {/* Display Email */}
                        <Button variant="primary" onClick={() => setEditing(!editing)} className="mb-2" style={buttonStyle}>
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                        {editing && (
                            <Form onSubmit={handleFormSubmit} className="mt-3">
                                <Form.Group controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={profile.username}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                    />
                                </Form.Group>
                                <Button variant="success" type="submit" className="mt-3 btn-block">
                                    Save Changes
                                </Button>
                            </Form>
                        )}
                    </Col>

                    {/* Middle Column: Create Post (50%) */}
                    <Col md={6}>
                        {/* Empty container to match 90% height of the profile section */}
                        <div style={{ height: profileContainerHeight }}></div>
                        <Row className="mt-3">
                            <Col>
                                <CreatePost />
                            </Col>
                        </Row>
                    </Col>

                    {/* Right Column: Empty (25%) */}
                    <Col md={3}>
                        {/* You can add content here in the future, if needed */}
                    </Col>
                </Row>

                {/* Additional rows for other elements in each column */}
                <Row className="mt-3">
                    <Col md={3}>
                        <Button variant="primary" onClick={() => setChangingPassword(!changingPassword)} className="mb-2" style={buttonStyle}>
                            {changingPassword ? 'Cancel' : 'Change Password'}
                        </Button>
                        <Button variant="primary" onClick={handleDeactivateAccount} className="mb-2" style={buttonStyle}>
                            Deactivate Account
                        </Button>
                        <Button variant="primary" onClick={handleDeleteAccount} style={buttonStyle}>
                            Delete Account
                        </Button>
                        {changingPassword && (
                            <Form onSubmit={handleChangePasswordSubmit} className="mt-3">
                                <Form.Group controlId="formOldPassword">
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="old_password"
                                        value={passwordData.old_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formNewPassword">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="new_password"
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="success" type="submit" className="mt-3 btn-block">
                                    Change Password
                                </Button>
                            </Form>
                        )}
                    </Col>

                    <Col md={6}>
                        {/* Any additional content for the middle column */}
                    </Col>

                    <Col md={3}>
                        {/* Any additional content for the right column */}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Profile;
