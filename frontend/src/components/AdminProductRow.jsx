import { useNavigate } from 'react-router-dom';

// Admin's view of a single product row in the Home table.
// Read-only data plus a View action that goes to ProductDetail.
export const AdminProductRow = ({ product }) => {
  const navigate = useNavigate();

  return (
    <tr className="border-t border-gray-100">
      <td className="p-4">{product.code}</td>
      <td className="p-4">{product.description}</td>
      <td className="p-4">{product.uom}</td>
      <td className="p-4">{product.category}</td>
      <td
        className={`p-4 text-right ${
          product.stock < 15 ? 'text-red-600 font-medium' : ''
        }`}
      >
        {product.stock}
      </td>
      <td className="p-4 text-center">
        <button
          onClick={() => navigate(`/products/${product.id}`)}
          className="text-green-700 hover:text-green-800 text-lg"
          title="View product"
        >
          View
        </button>
      </td>
    </tr>
  );
}