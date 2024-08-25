// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';  
// import axios from 'axios';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();  

//   const handleSubmit = async (event) => {
//     event.preventDefault();
    
//     console.log('Attempting to log in with:', { email, password });
    
//     try {
//         const response = await axios.post('http://localhost:8000/api/v1/users/login/', {
//             email,
//             password,
//         });
        
//         if (response.status === 200) {
//             console.log('Login Response:', response.data);
//             const { access, refresh, userId  } = response.data;
//             localStorage.setItem('accessToken', access);
//             localStorage.setItem('refreshToken', refresh);
//             localStorage.setItem('userId', userId);
//             console.log('userId stored:', localStorage.getItem('userId'));
            
//             alert('Login successful!');
//             setEmail('');
//             setPassword('');
//             navigate('/home'); // Redirect to the home page
//         }
//     } catch (error) {
//         console.error('Error logging in:', error.response ? error.response.data : error.message);
//         alert('Login failed. Please check your credentials.');
//     }
//   };

//   return (
//     <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
//       <div className="row w-100">
//         <div className="col-md-6 offset-md-3">
//           <div className="card shadow-sm">
//             <div className="card-body">
//               <h2 className="text-center mb-4">Login</h2>
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="email" className="form-label">Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     id="email"
//                     placeholder="Email address"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="password" className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <button type="submit" className="btn btn-primary w-100">Login</button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);  // To display any login errors
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/login/', {
        email,
        password,
      });

      if (response.status === 200) {
        // Extracting the tokens from the response
        const { access, refresh } = response.data;

        // Storing the tokens in localStorage
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);

        // Redirecting to the home page
        navigate('/home');
      }
    } catch (error) {
      // Handle login errors
      if (error.response && error.response.data) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div className="row w-100">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

