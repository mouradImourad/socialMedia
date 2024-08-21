import React from 'react';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import Feed from '../components/Feed';
import RightSidebar from '../components/RightSidebar';
import './HomePage.css';


const HomePage = () => {
    return (
        <div className="homepage">
            <Navbar />
            <div className="main-content">
                <LeftSidebar />
                <Feed />
                <RightSidebar />
            </div>
        </div>
    );
};

export default HomePage;
