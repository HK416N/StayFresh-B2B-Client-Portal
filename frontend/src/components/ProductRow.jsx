import { useState } from 'react';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';

// One row for the customer Home table. Has a qty input and add-to-cart button.
export const ProductRow = ({ product }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const outOfStock = product.stock === 0;

    const handleAdd = () => {
        const qty = parseInt(quantity, 10);
        if (!qty || qty < 1) {
            toast.error('Enter a valid quantity');
            return;
        }
        if (qty > product.stock) {
            toast.error(`Only ${product.stock} ${product.uom} available`);
            return;
        }
        addToCart(product, qty);
        toast.success(`Added ${qty} ${product.uom} of ${product.description}`);
        setQuantity(1);
    };

    return (
        <tr className="border-t border-gray-100">
            <td className="p-4">{product.code}</td>
            <td className="p-4">{product.description}</td>
            <td className="p-4 text-right">${Number(product.sale_price).toFixed(2)}</td>
            <td className="p-4">{product.uom}</td>
            <td className="p-4">{product.category}</td>
            {/* highlight low stock. stock < 15 */}
            <td className={`p-4 text-right ${product.stock < 15 ? 'text-red-600 font-medium' : ''}`}>
                {product.stock}
            </td>
            <td className="p-4">
                <div className="flex items-center gap-5 justify-center">
                    <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        disabled={outOfStock}
                        className="w-20 border border-gray-200 rounded-md px-2 py-1 disabled:bg-gray-100"
                    />
                    {outOfStock ? (
                        <span className="text-xs text-gray-400">Out of stock</span>
                    ) : (
                        <button
                            onClick={handleAdd}
                            className="text-green-700 hover:text-green-800 text-lg"
                            title="Add to cart"
                        >
                            Add
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}