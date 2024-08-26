// src/components/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import MyNavbar from './MyNavbar';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/v1/users/profile/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <MyNavbar />
      <Container fluid className="mt-3">
        <Row>
          {/* Left Sidebar */}
          <Col md={3} className="bg-light text-center">
            <Card className="mb-3">
              <Card.Body>
                {profile && (
                  <>
                    <Image
                      src={profile.profile_picture}
                      roundedCircle
                      fluid
                      className="mb-3"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                    <Card.Title>{profile.username}</Card.Title>
                    <Button as={Link} to="/profile/update" variant="secondary">
                      Update Profile
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Main Content */}
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Posts</Card.Title>
                <Card.Text>
                  This is the main content area where the user's posts will be displayed.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Sidebar */}
          <Col md={3} className="bg-light">
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Friends</Card.Title>
                <Card.Text>
                  This is the right sidebar where you can show friends, suggestions, or ads.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProfilePage;
