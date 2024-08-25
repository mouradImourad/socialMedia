import React from 'react';
import { Navbar, Nav, Form, FormControl, Button, Container } from 'react-bootstrap';
import axios from 'axios';

const MyNavbar = () => {
    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');

            const response = await axios.post('/api/v1/users/logout/', {
                refresh_token: refreshToken,
            });

            if (response.status === 200) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login'; // Redirect to login page
            } else {
                console.error('Logout failed:', response.data.detail);
            }
        } catch (error) {
            console.error('An error occurred:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <Navbar bg="primary" expand="lg" variant="dark" className="w-100">
            <Container fluid>
                <Navbar.Brand href="/">LifeX</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                        <Nav.Link href="/messages">Messages</Nav.Link>
                        <Nav.Link href="/notifications">Notifications</Nav.Link>
                    </Nav>
                    <Form className="d-flex ml-auto mr-3">
                        <FormControl
                            type="text"
                            placeholder="Search"
                            className="mr-2"
                        />
                        <Button variant="outline-light" className="mr-3">Search</Button>
                    </Form>
                    <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default MyNavbar;
