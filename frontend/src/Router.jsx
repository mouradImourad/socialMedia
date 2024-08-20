// src/Router.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';


const AppRouter = () => {
    
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;


