import { useEffect, useState } from 'react';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      // Update state locally after successful update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div className="p-8 text-black">Loading orders...</div>;

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className={`p-4 border rounded-lg flex justify-between items-center ${
                order.status === 'delivered'
                  ? 'bg-blue-500 text-white'
                  : order.status === 'completed'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <div>
                <p><span className="font-semibold">Order ID:</span> {order.order_id}</p>
                <p><span className="font-semibold">User ID:</span> {order.user_id}</p>
                <p><span className="font-semibold">Date:</span> {new Date(order.order_date).toLocaleString()}</p>
                <p><span className="font-semibold">Total:</span> ${order.total_amount}</p>
                <p><span className="font-semibold">Status:</span> {order.status}</p>
              </div>

              <div className="space-x-2">
                {order.status !== 'delivered' && (
                  <button
                    onClick={() => updateOrderStatus(order.order_id, 'delivered')}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                  >
                    Mark as Delivered
                  </button>
                )}
                {order.status !== 'completed' && (
                  <button
                    onClick={() => updateOrderStatus(order.order_id, 'completed')}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
