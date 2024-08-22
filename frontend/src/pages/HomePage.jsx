// src/pages/HomePage.jsx
import React from 'react';
import LeftSidebar from '../components/LeftSidebar';
import Feed from '../components/Feed';
import RightSidebar from '../components/RightSidebar';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <LeftSidebar />
      <Feed />
      <RightSidebar />
    </div>
  );
};

export default HomePage;
