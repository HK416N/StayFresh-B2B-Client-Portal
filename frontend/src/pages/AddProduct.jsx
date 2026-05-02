import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProduct } from '../services/productService';
import { Field, SelectField } from '../components/SubComponents';
import Navbar from '../components/Navbar';

const UOM_OPTIONS = ['KGS', 'BOX', 'CTN'];
const CATEGORY_OPTIONS = ['FRUIT', 'VEGETABLE'];

const AddProduct = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        code: '',
        description: '',
        price: '',
        sale_price: '',
        uom: 'KGS',
        stock: '',
        category: 'FRUIT',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        if (!formData.code || !formData.description || !formData.price || !formData.stock) {
            setError('Please fill in all required fields.');
            toast.error('Please fill in all required fields.');
            
            setIsLoading(false);
            return;
        }

        const payload = {
            ...formData,
            price: Number(formData.price),
            sale_price: Number(formData.sale_price),
            stock: parseInt(formData.stock, 10) || 0,
        };


        const result = await createProduct(payload);

        if (!result.success) {
            setError(result.error || 'Failed to add product');
            toast.error(result.error || 'Failed to add product');

            //release loading state
            setIsLoading(false);
            return; 
        }

        toast.success(`Product ${formData.code} added`);
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-3xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-medium text-gray-900 mb-2">Add Product</h1>
                <Link to="/home" className="text-sm text-gray-600 hover:text-gray-900 
                mb-6 inline-flex items-center gap-1">
                    Back to Home
                </Link>

                <div className="bg-blue-50/30 border border-gray-200 rounded-lg p-8 mt-4">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border 
                        border-red-200 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Description spans full width */}
                        <Field
                            label="Description"
                            name="description"
                            required
                            value={formData.description}
                            placeholder="e.g. Apple, Fuji"
                            onChange={handleChange}
                        />

                        {/* 2-column grid for the rest */}
                        <div className="grid grid-cols-2 gap-x-6">
                            <Field
                                label="Code"
                                name="code"
                                required
                                value={formData.code}
                                placeholder="e.g. 12345"
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
                                placeholder="$0.00"
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
                                placeholder="$0.00"
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
                                placeholder="0"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex justify-center mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium 
                                px-12 py-2 rounded-md disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddProduct;