import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch cart items from backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;
  
        if (!userId) {
          console.error('User not logged in');
          setCartItems([]);
          setLoading(false);
          return;
        }
  
        const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch cart items');
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCartItems();
  }, []);
  
  // Remove item
  // Remove item
const removeItemFromCart = async (cartId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to remove item');

    // Remove the item from the state
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  } catch (error) {
    console.error('Error removing item:', error);
  }
};

  

  // Update quantity

const updateQuantity = async (cartId, newQuantity) => {
  try {
    const response = await fetch(`http://localhost:5000/api/cart/${cartId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (!response.ok) throw new Error('Failed to update quantity');

    // Update UI by modifying the cart item state directly
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
};

const calculateTotal = () => {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};
const handleConfirmOrder = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      alert('User not logged in.');
      return;
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
      user_id: user.id,
      total_amount: totalAmount,
      status: 'pending',
    };

    // Create the order first
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to place order');
    }

    const order = await response.json(); // Get the created order if needed
    console.log('Order created successfully:', order);

    // Update inventory for each item in the cart
    for (const item of cartItems) {
      const inventoryUpdate = {
        quantity: item.quantity,
      };

      const inventoryResponse = await fetch(`http://localhost:5000/api/inventory/${item.gameId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryUpdate),
      });

      if (!inventoryResponse.ok) {
        throw new Error(`Failed to update inventory for item ${item.gameId}`);
      }

      console.log(`Inventory updated for game ${item.gameId}`);
    }

    // Redirect to summary or confirmation page
    navigate('/summary');
  } catch (error) {
    console.error('Error placing order:', error);
    alert('Failed to place the order. Please try again.');
  }
};




  return (
    <div className="max-w-6xl mx-auto p-12">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
      {loading ? (
        <p>Loading cart...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {cartItems.map(item => (
           <div key={item.cartId}  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
           <div className='flex justify-between space-x-10 items-center ' onClick={(e)=>{navigate(`/product/${item.gameId}`)}}>
             <img src={item.imageURL} alt={item.title} className="w-24 h-24 object-cover rounded" />
             <p className="font-semibold ">{item.title}</p>
             <p className="font-semibold  ">{item.price}$</p>
           </div>
         
           <div className="flex items-center space-x-4">
             <button
               onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
               className="px-3 py-1 bg-green-500 text-white rounded-lg"
             >
               +
             </button>
             <span>{item.quantity}</span>
             <button
               onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
               disabled={item.quantity <= 1}
               className="px-3 py-1 bg-red-500 text-white rounded-lg"
             >
               -
             </button>
             <button
               onClick={() => removeItemFromCart(item.cartId)}
               className="px-3 py-1 bg-gray-500 text-white rounded-lg"
             >
               Remove
             </button>
           </div>
         </div>
         
          ))}
        </div>
      )}

      {/* Confirm Order Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleConfirmOrder}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}
