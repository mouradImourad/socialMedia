import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/en/api/v1/users/email-verify" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

