import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/orderService';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';

const Cart = () => {
  const navigate = useNavigate();

  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();

  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  // prefill form data
  const startEdit = (item) => {
    setEditingId(item.product_id);
    setEditQuantity(item.quantity);
  };

  // Save quantity change
  const saveEdit = (productId) => {
    const quantity = parseInt(editQuantity, 10);
    if (!quantity || quantity < 1) {
      toast.error('Quantity must be 1 or more');
      return;
    }
    updateQuantity(productId, quantity);

    setEditingId(null);
    toast.success('Quantity updated');
  };

  const handleRemove = (item) => {
    removeFromCart(item.product_id);
    toast.success(`Removed ${item.description}`);
  };

  const handleCancel = () => {
    setConfirmCancelOpen(false);
    clearCart();
    navigate('/home');
  };

  const handleConfirm = async () => {
    setError('');
    setIsLoading(true);

    // match backend
    const payload = items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    const result = await placeOrder(payload);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success('Order placed!');
    clearCart();
    navigate('/orders');
  };

  // Empty state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">
            Create New Order
          </h1>
          <Link to="/home" className="text-sm text-gray-600 hover:text-gray-900 mb-6 inline-flex items-center gap-1">
            Back to Home
          </Link>

          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500 mt-4">
            <p className="mb-4">
              Your cart is empty
            </p>
            <Link
              to="/home"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md"
            >
              Browse products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">
          Create New Order
        </h1>
        <Link to="/home" className="text-sm text-gray-600 hover:text-gray-900 mb-6 inline-flex items-center gap-1">
          Back to Home
        </Link>

        <div className="bg-blue-50/30 border border-gray-200 rounded-lg p-6 mt-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <table className="w-full text-sm">
            <thead className="text-gray-700">
              <tr>
                <th className="text-left p-3">Item</th>
                <th className="text-left p-3">QTY</th>
                <th className="text-right p-3">Price</th>
                <th className="text-right p-3">Subtotal</th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.product_id} className="border-t border-gray-200">
                  <td className="p-3">{item.description}</td>
                  <td className="p-3">
                    {editingId === item.product_id ? (
                      <input
                        type="number"
                        min="1"
                        value={editQuantity}
                        onChange={(event) => setEditQuantity(event.target.value)}
                        className="w-20 border border-gray-200 rounded px-2 py-1"
                        autoFocus
                      />
                    ) : (
                      <span>{item.quantity} {item.uom}</span>
                    )}
                  </td>
                  <td className="p-3 text-right">${Number(item.sale_price).toFixed(2)}</td>
                  <td className="p-3 text-right">
                    ${(Number(item.sale_price) * item.quantity).toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    {editingId === item.product_id ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => saveEdit(item.product_id)}
                          className="text-green-700 hover:text-green-800 font-medium text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 hover:text-gray-700 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-gray-600 hover:text-gray-800"
                          title="Edit quantity"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemove(item)}
                          className="text-red-600 hover:text-red-700"
                          title="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total row */}
          <div className="flex justify-end items-center gap-4 mt-6 pt-4 border-t border-gray-200">
            <span className="text-base font-semibold text-gray-900">Total :</span>
            <span className="text-base font-semibold text-gray-900">
              $ {total.toFixed(2)}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setConfirmCancelOpen(true)}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-2 rounded-md disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-2 rounded-md disabled:opacity-50"
            >
              {isLoading ? 'Placing order...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmCancelOpen}
        title="Discard cart?"
        message="This will clear all items in your cart and return you to Home."
        confirmLabel="Yes, discard"
        destructive={true}
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancelOpen(false)}
      />
    </div>
  );
};

export default Cart;