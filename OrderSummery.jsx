import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OrderSummaryPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [isOrderCancelled, setIsOrderCancelled] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    method: 'Card',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem("user")); // Replace with logged-in user's ID (e.g., from auth context)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${user.id}`);
        setCartItems(response.data);
     
      } catch (err) {
        console.error(err);
        setError('Failed to load cart items.');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user.id]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const calculateTaxes = () => {
    return (calculateSubtotal() * 0.07).toFixed(2);
  };

  const calculateTotal = () => {
    return  (parseFloat(calculateSubtotal()) + parseFloat(calculateTaxes())).toFixed(2);
  };

  const handleInputChange = (e) => {
    if(e.target.value>= 'A' && e.target.value<= 'z' ){

      return ;
    }
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleConfirm = async () => {
    if (!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv) {
      alert('Please fill in all payment fields.');
      return;
    }
  
    try {
    const   totalamount=calculateTotal();
      console.log(totalamount)
      // 1. First, create the order
      const orderResponse = await axios.post('http://localhost:5000/api/orders', {
        user_id: user.id, // 🔄 use lowercase d here
        total_amount: totalamount ,
        status: 'pending',
      });
      console.log(orderResponse)
      const orderId = orderResponse.data.order_id;
      console.log(orderId)
      // 2. Then, add payment record
      
      
      await axios.post('http://localhost:5000/api/pay', {
        
        userId: user.id, // 🔄 keep consistent with backend
        orderId,
        method: paymentInfo.method, // ✅ good to include if you’ll handle it backend
      });
  
      setIsOrderConfirmed(true);
      setIsOrderCancelled(false);
    } catch (err) {
      console.error(err);
      alert('Payment failed. Please try again.');
    }
  };
  

  const handleCancel = () => {
    setIsOrderCancelled(true);
    setIsOrderConfirmed(false);
  };

  if (loading) return <div>Loading your cart...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-12">
      <h2 className="text-3xl font-bold mb-6">Order Summary</h2>

      {isOrderConfirmed && (
        <div className="p-4 mb-6 bg-green-500 text-white rounded-lg">
          <h3 className="text-xl font-semibold">Order Confirmed!</h3>
          <p>Your order has been successfully placed.</p>
        </div>
      )}

      {isOrderCancelled && (
        <div className="p-4 mb-6 bg-red-500 text-white rounded-lg">
          <h3 className="text-xl font-semibold">Order Cancelled</h3>
          <p>Your order has been cancelled. Please go back to your cart to modify your items.</p>
        </div>
      )}

      {!isOrderConfirmed && !isOrderCancelled && (
        <div className="p-4 bg-gray-200 rounded-lg">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between mb-4">
          
              <div className="flex items-center">
                <img src={item.imageURL} alt={item.title} className="w-20 h-20 object-cover rounded-md" />
                <span className="ml-4">{item.title}</span>
              </div>
              <span className="font-bold">${item.price}</span>
              <span className="font-bold">x {item.quantity}</span>
            </div>
          ))}

          <div className="flex justify-between mb-2">
            <span className="text-lg">Subtotal:</span>
            <span className="font-bold">${calculateSubtotal()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-lg">Taxes (7%):</span>
            <span className="font-bold">${calculateTaxes()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-lg">Total:</span>
            <span className="font-bold text-indigo-600">${calculateTotal()}</span>
          </div>

          {/* Payment Inputs */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Payment Method:</label>
            <select
              name="method"
              value={paymentInfo.method}
              onChange={handleInputChange}
              className="w-full p-2 rounded border"
            >
              <option value="Card">Card</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Card Number:</label>
            <input
              type="text"
              name="cardNumber"
              value={paymentInfo.cardNumber}
              onChange={handleInputChange}
              className="w-full p-2 rounded border"
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block mb-2 font-semibold">Expiry Date:</label>
              <input
                type="text"
                name="expiry"
                value={paymentInfo.expiry}
                onChange={handleInputChange}
                className="w-full p-2 rounded border"
                placeholder="MM/YY"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2 font-semibold">CVV:</label>
              <input
                type="text"
                name="cvv"
                value={paymentInfo.cvv}
                onChange={handleInputChange}
                className="w-full p-2 rounded border"
                placeholder="123"
              />
            </div>
          </div>

          <div className="flex justify-between space-x-4">
            <button
              onClick={handleCancel}
              className="w-full py-3 bg-red-500 text-white rounded-lg"
            >
              Cancel Order
            </button>
            <button
              onClick={handleConfirm}
              className="w-full py-3 bg-green-500 text-white rounded-lg"
            >
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
