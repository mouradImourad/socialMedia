// src/Router.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';


const AppRouter = () => {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/register" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;