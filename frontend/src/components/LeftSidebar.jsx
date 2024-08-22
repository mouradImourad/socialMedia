// src/components/LeftSidebar.jsx
import React from 'react';
import './Sidebar.css';

const LeftSidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/friends">Friends</a></li>
      </ul>
    </div>
  );
};

export default LeftSidebar;
