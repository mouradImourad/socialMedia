import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MyNavbar from './MyNavbar';
import WeatherWidget from './WeatherWidget';
import NewsWidget from './NewsWidget';
import YouTubeWidget from './YouTubeWidget';

function Home() {
  return (
    <>
      <MyNavbar />
      <Container fluid className="p-5">
        <Row>
          {/* Left Sidebar */}
          <Col md={3} className="bg-light p-4" style={{ width: '25%' }}>
            <h4>Left Sidebar</h4>
            <p>This can include navigation links, user profile info, or other relevant content.</p>
          </Col>

          {/* Middle Content */}
          <Col md={6} className="bg-white p-4" style={{ width: '50%' }}>
            <h1 className="display-4 text-center">Welcome to LifeX</h1>
            <p className="lead text-center">
              This is your social media platform where you can connect with friends, share experiences, and explore new interests.
            </p>
            <hr className="my-4" />
            <p className="text-center">momo</p>
          </Col>

          {/* Right Sidebar */}
          <Col md={3} className="bg-light p-4" style={{ width: '25%' }}>
            <WeatherWidget />
            <NewsWidget />
            <YouTubeWidget />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
