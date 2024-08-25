import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/en/api/v1/users/email-verify" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;

