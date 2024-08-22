import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear tokens from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        
        // Redirect to login page
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/"><img src="/assets/lifex-logo.png" alt="Lifex Logo" className="logo" /></Link>
            </div>
            <div className="navbar-center">
                <Link to="/home">Home</Link>
                <Link to="/profile">Profile</Link>
            </div>
            <div className="navbar-right">
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
