import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import MyNavbar from './MyNavbar';

function Home() {
  return (
    <>
      <MyNavbar />
      <Container fluid className="p-5">
        <Row className="justify-content-center bg-light p-5 rounded">
          <Col md={8} className="text-center">
            <h1 className="display-4">Welcome to LifeX</h1>
            <p className="lead">
              This is your social media platform where you can connect with friends, share experiences, and explore new interests.
            </p>
            <hr className="my-4" />
            <p>
              momo
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
