import React from 'react';

function Home() {
  return (
    <div className="container mt-5">
      <div className="jumbotron text-center bg-light p-5 rounded">
        <h1 className="display-4">Welcome to LifeX</h1>
        <p className="lead">
          This is your social media platform where you can connect with friends, share experiences, and explore new interests.
        </p>
        <hr className="my-4" />
        <p>
          Get started by creating an account or logging in to your existing account. Explore the features we offer and enjoy your stay!
        </p>
        <a className="btn btn-primary btn-lg" href="/register" role="button">Register</a>
        <a className="btn btn-secondary btn-lg ms-3" href="/login" role="button">Login</a>
      </div>
    </div>
  );
}

export default Home;
