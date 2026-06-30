import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({setUserRole}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserData(parsedUser);
      // Redirect based on role
      if (parsedUser.role === 'admin') {
        navigate('/login');
      } else {
        navigate('/login');
      }
    }
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem('user');
localStorage.removeItem('role');

// 👇 Trigger the storage event manually (so Header updates immediately)
window.dispatchEvent(new Event('storage'));

alert('Logged out successfully');
navigate('/');

  };
  
  const handleLogin = () => {
    axios
      .post('http://localhost:5000/login', { email, password })
      .then((response) => {
        const { user } = response.data;
        alert('Login successful');
  
        // Store user info in localStorage or context if needed
        // Always store role in localStorage (just for session use)


// Only persist full user if rememberMe is checked
localStorage.setItem('role', user.role);
if (setUserRole) {
  setUserRole(user.role);
}


  localStorage.setItem('user', JSON.stringify(user));


  
        // Check if user is already logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.role === 'admin') {
            navigate('/inventory');
          } else {
            navigate('/');
          }
        } else {
          if (user.role === 'admin') {
            navigate('/inventory');
          } else {
            navigate('/');
          }
        }
      })
      .catch((err) => {
        setError('Invalid credentials or something went wrong.');
        console.error(err);
      });
  };
  

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-900 bg-cover bg-center"
      style={{ backgroundImage: `url('../bg1.jpg')` }}
    >
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md bg-opacity-80">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Your Details</h2>

        {isLoggedIn ? (
        <div>
      
      
        {userData && (
          <div className="bg-gray-700 p-4 rounded mb-4 text-white">
            <p><span className="font-semibold">Name:</span> {userData.first_name + " "+userData.last_name || 'N/A'}</p>
            <p><span className="font-semibold">Email:</span> {userData.email}</p>
            <p><span className="font-semibold">Role:</span> {userData.role}</p>
          </div>
        )}
      
        <div className="mt-4">
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
          
        ) : (
          <>
            <input
              type="email"
              className="w-full p-3 mb-3 rounded bg-gray-700 text-white placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <input
              type="password"
              className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="text-gray-300">Remember Me</label>
            </div>

            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded"
              onClick={handleLogin}
            >
              Login
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {!isLoggedIn && (
          <div className="mt-4">
            <p className="text-sm text-white">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 underline">
                Sign Up
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
