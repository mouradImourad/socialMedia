import React from 'react';
import Feed from '../components/Feed';  // Ensure the Feed component is imported correctly

const HomePage = () => {
  return (
    <div className="home-page">
      <Feed />  {/* Ensure the Feed is rendered here */}
    </div>
  );
};

export default HomePage;
