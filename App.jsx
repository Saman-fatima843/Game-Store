import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/login';
import Signup from './components/signup';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import OrderSummaryPage from './components/OrderSummery';
import InventoryPage from './components/Inventory';  // New Inventory Page Component
import OrdersPage from './components/OrdersPage';
import './App.css';
import OrdersTracker from './components/OrdersTracker';
function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    // Listen for changes in localStorage (e.g., after login)
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem('role'));
    };

    // Attach event listener
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Protected Route Component to handle role-based access
  const ProtectedRoute = ({ element, roleRequired }) => {
    if (userRole === roleRequired) {
      return element;
    } else {
      return <div>You don't have permission to access this page.</div>;
    }
  };

  return (
    <Router>
      <div className="App bg">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/track"  
             element={user ? <OrdersTracker userId={user.id} /> : <Navigate to="/login" />}/>
            <Route path="/summary" element={<OrderSummaryPage />} />
            <Route path="/login" element={<Login setUserRole={setUserRole} />} /> {/* <-- Pass down */}
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/inventory"
              element={<ProtectedRoute element={<InventoryPage />} roleRequired="admin" />}
            />
            <Route
  path="/orders"
  element={<ProtectedRoute element={<OrdersPage />} roleRequired="admin" />}
/>
{/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;
