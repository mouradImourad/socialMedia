import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import MyNavbar from './Navbar';
import md5 from 'md5';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Function to get the Gravatar URL based on the user's email
const getGravatarUrl = (email) => {
    if (!email) {
        return 'default-avatar-url'; // Replace with your default avatar URL
    }
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}`;
};

const Profile = () => {
    const [userEmail, setUserEmail] = useState('');
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    useEffect(() => {
        // Fetching user profile data from the backend
        axios.get('/api/v1/users/profile/', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(response => {
            const { email, username, profile_picture } = response.data;
            setUserEmail(email);
            setUsername(username);
            setProfilePicture(profile_picture);
        })
        .catch(error => {
            console.error('Error fetching profile data:', error);
        });
    }, []);

    return (
        <>
            <MyNavbar />
            <Container>
                <Row className="mt-4">
                    <Col md={4} className="text-center">
                        <img src={profilePicture || 'default-profile-picture-url'} className="rounded-circle" alt="Profile" width="150" />
                    </Col>
                    <Col md={8} className="text-center">
                        {/* Display Gravatar based on the user's email */}
                        <img src={getGravatarUrl(userEmail)} className="rounded-circle" alt="User Gravatar" width="150" />
                        <h4>{username}</h4>
                        <Button variant="outline-primary" as={Link} to="/profile/update">
                            Edit Profile
                        </Button>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col md={4}>
                        <h4 className="mt-4">Account Settings</h4>
                        <ul className="list-group">
                            <li className="list-group-item">Update Your Profile</li>
                            <li className="list-group-item">Change Your Password</li>
                            <li className="list-group-item">Deactivate Your Account</li>
                            <li className="list-group-item">Reactivate Your Account</li>
                            <li className="list-group-item">Delete Your Account</li>
                        </ul>
                    </Col>
                    <Col md={8}>
                        <h4>Friends</h4>
                        <Row>
                            <Col xs={4}><img src="friend1.jpg" className="rounded-circle" alt="Friend 1" width="70" /></Col>
                            <Col xs={4}><img src="friend2.jpg" className="rounded-circle" alt="Friend 2" width="70" /></Col>
                            <Col xs={4}><img src="friend3.jpg" className="rounded-circle" alt="Friend 3" width="70" /></Col>
                        </Row>
                        <Row className="mt-2">
                            <Col xs={4}><img src="friend4.jpg" className="rounded-circle" alt="Friend 4" width="70" /></Col>
                            <Col xs={4}><img src="friend5.jpg" className="rounded-circle" alt="Friend 5" width="70" /></Col>
                            <Col xs={4}><img src="friend6.jpg" className="rounded-circle" alt="Friend 6" width="70" /></Col>
                        </Row>
                        <Button variant="link" className="mt-3">See All Friends</Button>

                        <h4 className="mt-4">Create Post</h4>
                        <Form>
                            <Form.Group>
                                <Form.Control type="text" placeholder="What's on your mind?" />
                            </Form.Group>
                            <Button variant="outline-secondary" className="mr-2">Attach Photo/Video</Button>
                            <Button variant="primary">Post</Button>
                        </Form>

                        <h4 className="mt-4">Your Posts</h4>
                        <Row className="mb-4">
                            <Col xs={12} className="text-center mb-2">
                                <img src="profile-picture-url" className="rounded-circle" alt="User" width="50" />
                            </Col>
                            <Col xs={12}>
                                <Card className="mb-2">
                                    <Card.Body>
                                        <Card.Text>Your latest post content here...</Card.Text>
                                    </Card.Body>
                                </Card>
                                <div className="d-flex justify-content-start">
                                    <Button variant="link">Like</Button>
                                    <Button variant="link">Comment</Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Profile;
