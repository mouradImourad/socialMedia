import React from 'react';
import { Navbar, Nav, Form, FormControl, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NotificationsDropdown from './NotificationsDropdown'; // Import the NotificationsDropdown component

const MyNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <Navbar bg="primary" expand="lg" variant="dark" className="w-100">
            <Container fluid>
                <Navbar.Brand>LifeX</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href="/home">Home</Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                        <Nav.Link href="/messages">Messages</Nav.Link>
                        {/* Integrating the Notifications Dropdown */}
                        <NotificationsDropdown />
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
