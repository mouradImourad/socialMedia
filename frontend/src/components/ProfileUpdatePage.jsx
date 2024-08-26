// src/components/ProfileUpdatePage.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MyNavbar from './MyNavbar';
import ProfileUpdate from './ProfileUpdate';
import { useNavigate } from 'react-router-dom';

const ProfileUpdatePage = () => {
    const navigate = useNavigate();

    const handleProfileUpdate = (updatedProfile) => {
        // Do something with the updated profile, such as updating state or redirecting
        navigate('/profile');
    };

    return (
        <>
            <MyNavbar />
            <Container fluid className="mt-3">
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <ProfileUpdate onUpdate={handleProfileUpdate} />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ProfileUpdatePage;
