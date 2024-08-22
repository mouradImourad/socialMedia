import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import './Layout.css';  // Import your CSS for styling

const Layout = ({ children }) => {
  const location = useLocation();
  const [isProfilePage, setIsProfilePage] = useState(false);

  useEffect(() => {
    if (location.pathname === '/profile') {
      setIsProfilePage(true);
    } else {
      setIsProfilePage(false);
    }
  }, [location]);

  return (
    <div className={`layout ${isProfilePage ? 'shrink' : ''}`}>  {/* Apply 'shrink' class if on profile page */}
      <Navbar />
      <div className="content-container">
        <LeftSidebar />
        <div className="main-content">
          {children}  {/* This is where other components, like Feed, will render */}
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;
