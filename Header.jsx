import { Link } from 'react-router-dom';
import { VscAccount } from "react-icons/vsc";
function Header() {
  const userRole = localStorage.getItem('role');
  return (
    <header className="bg-black text-white p-6">
      <div className="flex items-center justify-between">
        {/* Left Side - GAME STORE Title */}
        <div className="flex items-center">
          <Link to="/" className=" px-3 text-3xl font-bold hover:text-blue-400">
            GAME STORE
          </Link>
        </div>

        {/* Right Side - Login and Cart */}
        <div className="flex space-x-4 ">
        {userRole === 'admin' && (
            <Link to="/inventory" className="mr-4 bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded">
              Manage Inventory
            </Link>
          )}
           {userRole === 'admin' && (
            <Link to="/orders" className="mr-4 bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded">
             Manage Orders
            </Link>
          )}
        
          {userRole !== 'admin' && (
          <Link 
            to="/cart" 
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded"
          >
            View Cart
          </Link>
          
        )}
           {userRole !== 'admin' && (
          <Link 
            to="/track" 
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded"
          >
            Track Order
          </Link>
          
        )}
          <Link 
            to="/login" 
          >
           <VscAccount  className='h-10 w-10'/>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
