import React from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import MyNavbar from './Navbar'; 

const ProfileComponent = () => {
    return (
        <>
            <MyNavbar /> 
            <Container>
                <Row className="mt-4">
                    <Col md={4} className="text-center">
                        <img src="profile-picture-url" className="rounded-circle" alt="Profile" width="150" />
                        <h3 className="mt-3">Your Motto or Quote</h3>
                    </Col>
                    <Col md={8}>
                        <h4>Account Settings</h4>
                        <ul className="list-group">
                            <li className="list-group-item">Profile Update API Created</li>
                            <li className="list-group-item">Change Password Functionality After Login Working</li>
                            <li className="list-group-item">Deactivating Account API Created</li>
                            <li className="list-group-item">Reactivating API Created</li>
                            <li className="list-group-item">Confirm Activation API Created</li>
                            <li className="list-group-item">Delete Account API Created</li>
                            <li className="list-group-item">Password Reset Created</li>
                        </ul>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col>
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
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col>
                        <h4>Create Post</h4>
                        <Form>
                            <Form.Group>
                                <Form.Control type="text" placeholder="What's on your mind?" />
                            </Form.Group>
                            <Button variant="outline-secondary" className="mr-2">Attach Photo/Video</Button>
                            <Button variant="primary">Post</Button>
                        </Form>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col>
                        <h4>Your Posts</h4>
                        <Card className="mb-3">
                            <Card.Body>
                                <Row>
                                    <Col xs={2}>
                                        <img src="profile-picture-url" className="rounded-circle" alt="User" width="50" />
                                    </Col>
                                    <Col xs={10}>
                                        <Card.Text>Your latest post content here...</Card.Text>
                                        <Button variant="link">Like</Button>
                                        <Button variant="link">Comment</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        {/* Repeat for additional posts */}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ProfileComponent;
