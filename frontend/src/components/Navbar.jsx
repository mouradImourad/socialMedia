import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';


const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/"><img src="/path-to-logo" alt="Lifex" className="logo" /></Link>
            </div>
            <div className="navbar-center">
                <Link to="/home">Home</Link>
                <Link to="/profile">Profile</Link>
            </div>
            <div className="navbar-right">
                <input type="text" placeholder="Search..." />
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
