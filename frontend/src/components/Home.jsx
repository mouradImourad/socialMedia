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
          <Col md={3} style={{ width: '30%' }}>
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4>Left Sidebar</h4>
                <p>This can include navigation links, user profile info, or other relevant content.</p>
              </div>
            </div>
          </Col>

          {/* Middle Content */}
          <Col md={6} style={{ width: '40%' }}>
            <div className="card shadow-sm mb-4">
              <div className="card-body text-center">
                <h1 className="display-4">Welcome to LifeX</h1>
                <p className="lead">
                  This is your social media platform where you can connect with friends, share experiences, and explore new interests.
                </p>
                <hr className="my-4" />
                <p>
                  Momo
                </p>
              </div>
            </div>
          </Col>

          {/* Right Sidebar */}
          <Col md={3} style={{ width: '30%' }}>
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
