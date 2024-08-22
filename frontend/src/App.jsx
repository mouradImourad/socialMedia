import React from 'react';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import Feed from './components/Feed';
import './App.css';  // Import the CSS file to ensure layout and styles are applied

const App = () => {
  const userName = "John";  // Example user name

  return (
    <div className="layout">
      <div className="sidebar">
        <LeftSidebar />  {/* Left sidebar */}
      </div>

      <div className="feed">
        <Feed userName={userName} />  {/* Main feed */}
      </div>

      <div className="sidebar">
        <RightSidebar />  {/* Right sidebar */}
      </div>
    </div>
  );
};

export default App;
