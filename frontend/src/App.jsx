import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';
import Login from './components/Login';
import Home from './components/Home';
import ProfilePage from './components/ProfilePage';
// import CreatePost from './components/CreatePost';
import ProfileUpdatePage from './components/ProfileUpdatePage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/en/api/v1/users/email-verify" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Profile" element={<ProfilePage />} />
        {/* <Route path="/create-post" component={CreatePost} /> */}
        <Route path="/profile/update" element={<ProfileUpdatePage />} />
      </Routes>
    </Router>
  );
}

export default App;

