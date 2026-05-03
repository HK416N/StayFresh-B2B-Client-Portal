import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getOrders, updateOrderStatus } from '../services/orderService';
import { formatStatus } from '../utils/formatStatus';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'Staff';

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelTargetId, setCancelTargetId] = useState(null);

  // Fetch active orders (PLACED + TRANSIT), History handles inactive orders (CANCELLED + COMPLETE)
  const fetchOrders = async () => {
    setIsLoading(true);

    const result = await getOrders(['PLACED', 'TRANSIT']);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setOrders(result.data);
    setError('');
  };

  // fetch on page load
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancel = async () => {
    const id = cancelTargetId;
    setCancelTargetId(null);

    const result = await updateOrderStatus(id, 'CANCELLED');
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(`Order #${id} cancelled`);
    fetchOrders(); // refresh list
  };

  // Format ISO date as "DD/MM/YY"
  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      timeZone: 'Asia/Singapore'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">
          {isAdmin ? 'Pending Orders' : 'My Orders'}
        </h1>
        <Link to="/home" className="text-sm text-gray-600 hover:text-gray-900 mb-6 inline-flex items-center gap-1">
          Back to Home
        </Link>

        {/* Error state */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Loading / empty / data states */}
        {isLoading ? (
          <div className="text-center text-gray-500 py-12">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No pending orders.</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left p-4">Order ID</th>
                  {isAdmin && <th className="text-left p-4">Client</th>}
                  <th className="text-left p-4">Order Placed At</th>
                  <th className="text-right p-4">Total</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-center p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-gray-100">
                    <td className="p-4">{order.id}</td>
                    {isAdmin && <td className="p-4">{order.company_name || '—'}</td>}
                    <td className="p-4">{formatDate(order.created_at)}</td>
                    <td className="p-4 text-right">${Number(order.total).toFixed(2)}</td>
                    <td className="p-4 font-medium tracking-wide">
                      {formatStatus(order.status)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="text-green-700 hover:text-green-800"
                          title="View order"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setCancelTargetId(order.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Cancel order"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={cancelTargetId !== null}
        title={`Cancel Order #${cancelTargetId}?`}
        message="This action cannot be undone."
        confirmLabel="Yes, cancel order"
        destructive={true}
        onConfirm={handleCancel}
        onCancel={() => setCancelTargetId(null)}
      />
    </div>
  );
};

export default Orders;