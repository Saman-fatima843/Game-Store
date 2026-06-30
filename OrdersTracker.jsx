import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaClock, FaTruck, FaMoneyCheckAlt } from 'react-icons/fa';

const OrdersTracker = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [paying, setPaying] = useState({}); // Track which order is being paid

  useEffect(() => {
    axios.get(`http://localhost:5000/api/orders/${userId}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error('Failed to fetch orders', err));
  }, [userId]);

  const handlePayment = async (orderId) => {
    const method = paymentMethods[orderId];
    if (!method) {
      alert('Please select a payment method.');
      return;
    }

    setPaying(prev => ({ ...prev, [orderId]: true }));

    try {
      await axios.post(`http://localhost:5000/api/orders/pay`, { orderId, method });
      setOrders(prev =>
        prev.map(order =>
          order.order_id === orderId ? { ...order, status: 'Completed' } : order
        )
      );
      alert('Payment successful!');
    } catch (err) {
      console.error('Payment failed', err);
      alert('Payment failed. Try again.');
    } finally {
      setPaying(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusBadge = (status) => {
    let color = '';
    let Icon = null;

    if (status === 'completed') {
      color = 'bg-green-100 text-green-700';
      Icon = FaCheckCircle;
    } else if (status === 'pending') {
      color = 'bg-yellow-100 text-yellow-700';
      Icon = FaMoneyCheckAlt;
    } else if (status === 'delivered') {
      color = 'bg-blue-100 text-blue-700';
      Icon = FaTruck;
    } else {
      color = 'bg-gray-100 text-gray-700';
      Icon = FaClock;
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        <Icon className="mr-1" /> {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🛒 Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div
              key={order.order_id}
              className="border rounded-lg shadow-sm bg-white hover:shadow-lg transition-shadow p-5 flex flex-col justify-between"
            
            >
             
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{order.gameTitle}</h3>
                <p className="text-gray-700 mb-1">💵 <strong>Price:</strong> ${order.total_amount} x {order.quantity}</p>
                <p className="text-gray-700 mb-3">📅 <strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                {getStatusBadge(order.status)}
              </div>

              {order.status === 'pending' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Payment Method:</label>
                  <div className="flex items-center">
                    <select
                      value={paymentMethods[order.order_id] || ''}
                      onChange={(e) =>
                        setPaymentMethods(prev => ({ ...prev, [order.order_id]: e.target.value }))
                      }
                      className="border rounded p-2 flex-1 mr-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      <option value="">Select...</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                    <button
                      disabled={!paymentMethods[order.order_id] || paying[order.order_id]}
                      onClick={() => handlePayment(order.order_id)}
                      className={`px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center`}
                    >
                      {paying[order.order_id] ? 'Processing...' : 'Pay Now'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTracker;
