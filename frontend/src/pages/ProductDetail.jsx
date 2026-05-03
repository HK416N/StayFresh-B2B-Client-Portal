import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductById, updateProduct, deleteProduct, } from '../services/productService';
import { Field, Row, SelectField } from '../components/SubComponents';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';

const UOM_OPTIONS = ['KGS', 'BOX', 'CTN'];
const CATEGORY_OPTIONS = ['FRUIT', 'VEGETABLE'];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    price: '',
    sale_price: '',
    uom: 'KGS',
    stock: '',
    category: 'FRUIT',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductById(id);
        setProduct(response.data);
        setFormData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  //prefill
  const startEdit = () => {
    setFormData(product);
    setIsEditing(true);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSave = async () => {
    setIsLoading(true);

    const payload = {
      code: formData.code,
      description: formData.description,
      price: Number(formData.price),
      sale_price: Number(formData.sale_price),
      uom: formData.uom,
      stock: parseInt(formData.stock, 10),
      category: formData.category,
    };

    const response = await updateProduct(id, payload)

    if (!response.success) {
      toast.error(response.error || 'Failed to update');
      setIsLoading(false);
      return;
    }

    setProduct(response.data);
    setFormData(response.data);
    setIsEditing(false);
    setIsLoading(false);
    toast.success('Product updated');
  };

  const handleDelete = async () => {
    setConfirmOpen(false);
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      navigate('/home');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center text-gray-500 py-12">Loading...</div>
      </div>
    );

    if (error || !product) {
      return (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="max-w-3xl mx-auto px-6 py-8">
            <div className="p-3 bg-red-50 border border-red-200 
                    text-red-700 rounded-md text-sm">
              {error || 'Product not found'}
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">
          {isEditing ? 'Edit Product' : 'Product Details'}
        </h1>
        <Link to="/home" className="text-sm text-gray-600 hover:text-gray-900 mb-6 inline-flex items-center gap-1">
          Back to Home
        </Link>

        <div className="bg-blue-50/30 border border-gray-200 rounded-lg p-8 mt-4">
          {isEditing ? (
            // EDIT MODE, 2-column form
            <>
              <Field
                label="Description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
              />

              <div className="grid grid-cols-2 gap-x-6">
                <Field
                  label="Code"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                />
                <Field
                  label="Price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleChange}
                />

                <SelectField
                  label="UOM"
                  name="uom"
                  required
                  value={formData.uom}
                  options={UOM_OPTIONS}
                  onChange={handleChange}
                />
                <Field
                  label="Sale Price"
                  name="sale_price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.sale_price}
                  onChange={handleChange}
                />

                <SelectField
                  label="Category"
                  name="category"
                  value={formData.category}
                  options={CATEGORY_OPTIONS}
                  onChange={handleChange}
                />
                <Field
                  label="Stock"
                  name="stock"
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium px-12 py-2 rounded-md disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </>
          ) : (
            // VIEW MODE, labelled rows, Edit + Delete buttons
            <>
              <Row label="Description" value={product.description} />
              <Row label="Code" value={product.code} />
              <Row label="Price" value={`$${Number(product.price).toFixed(2)}`} />
              <Row label="Sale Price" value={`$${Number(product.sale_price).toFixed(2)}`} />
              <Row label="UOM" value={product.uom} />
              <Row label="Stock" value={product.stock} />
              <Row label="Category" value={product.category} />

              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={startEdit}
                  className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-medium px-8 py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this product?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        destructive={true}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};
