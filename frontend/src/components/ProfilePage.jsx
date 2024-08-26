// src/components/ProfilePage.jsx
import React from 'react';
import MyNavbar from './MyNavbar';
import { Container, Row, Col, Card } from 'react-bootstrap';

const ProfilePage = () => {
  return (
    <>
      <MyNavbar />
      <Container fluid className="mt-3">
        <Row>
          {/* Left Sidebar */}
          <Col md={3} className="bg-light">
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Profile Information</Card.Title>
                <Card.Text>
                  This is the left sidebar where you can place profile information or other details.
                </Card.Text>
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
