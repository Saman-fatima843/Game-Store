import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSignup = () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Prepare data to send to backend
    const userData = { firstName, lastName, email, password };

    // Send POST request to backend for signup
    axios
      .post('http://localhost:5000/signup', userData)
      .then((response) => {
        // Handle successful signup
        alert(`Signed up as ${firstName} ${lastName} (${email})`);
        navigate('/home');
        // Optionally redirect or perform another action after successful signup
      })
      .catch((err) => {
        // Handle error
        setError('Something went wrong. Please try again.');
        console.error(err);
      });
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-900 bg-cover bg-center"
      style={{ backgroundImage: `url('../bg1.jpg')` }}
    >
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md bg-opacity-80">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Sign Up</h2>

        <input
          type="text"
          className="w-full p-3 mb-3 rounded bg-gray-700 text-white placeholder-gray-400"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />

        <input
          type="text"
          className="w-full p-3 mb-3 rounded bg-gray-700 text-white placeholder-gray-400"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />

        <input
          type="email"
          className="w-full p-3 mb-3 rounded bg-gray-700 text-white placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          type="password"
          className="w-full p-3 mb-3 rounded bg-gray-700 text-white placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <input
          type="password"
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        />

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded"
          onClick={handleSignup}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Signup;
