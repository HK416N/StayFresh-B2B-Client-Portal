import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProducts, getProductStats } from '../services/productService';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';

export default function Home() {
    const { user } = useAuth();

    const isAdmin = user?.role === 'Staff';

    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); //instead of being lazy and toastifying everythin while console logging the errors

    // Fetch products whenever search changes
    useEffect(()=>{
        const fetchProducts = async () => {
            try {
                const response = await getProducts(search);
                setProducts(response.data || []);
                setError(''); //ensure error cleared upon success
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, [search]);

    // fetch stats for staff only
    useEffect(() => {
        const fetchStats = async () => {
       
            if (!isAdmin) return;
       
            try {
                const statsData = await getProductStats();
                setStats(statsData);
            } catch (error) {
                console.error("Failed to fetch stats", error);
                setStats(null);
            }
        };
        fetchStats()
    }, [isAdmin]);

    // Client-side filtering by category pill
    const visible = category === 'ALL'
        ? products
        : products.filter((p) => p.category === category);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-medium text-gray-900">
                        {isAdmin ? 'Inventory' : 'Products'}
                    </h1>
                </div>

                {/* Admin stat cards */}
                {isAdmin && stats && (
                    <div className="grid grid-cols-3 gap-6 mb-6">
                        <StatCard label="Active Products" value={stats.activeProducts} />
                        <StatCard label="Pending Orders" value={stats.pendingOrders} />
                        <StatCard label="Total Orders" value={stats.totalOrders} />
                    </div>
                )}

                {/* Filter pills + search */}
                <div className="flex items-center justify-between mb-6 gap-4">
                    <div className="flex gap-2">
                        <FilterPill active={category === 'ALL'} onClick={() => setCategory('ALL')}>
                            All
                        </FilterPill>
                        <FilterPill active={category === 'FRUIT'} onClick={() => setCategory('FRUIT')}>
                            Fruits
                        </FilterPill>
                        <FilterPill active={category === 'VEGETABLE'} onClick={() => setCategory('VEGETABLE')}>
                            Vegetables
                        </FilterPill>
                    </div>
                    <SearchBar onChange={setSearch} placeholder="Search products..." />
                </div>

                {/* Error state */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Loading ? empty : data states */}
                {loading ? (
                    <div className="text-center text-gray-500 py-12">Loading...</div>
                ) : visible.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">No products found.</div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="text-left p-4">Code</th>
                                    <th className="text-left p-4">Description</th>
                                    {!isAdmin && <th className="text-right p-4">Price</th>}
                                    <th className="text-left p-4">UOM</th>
                                    <th className="text-left p-4">Category</th>
                                    <th className="text-right p-4">Stock</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map((product) => (
                                    <tr key={product.id} className="border-t border-gray-100">
                                        <td className="p-4">{product.code}</td>
                                        <td className="p-4">{product.description}</td>
                                        {!isAdmin && (
                                            <td className="p-4 text-right">${Number(product.sale_price).toFixed(2)}</td>
                                        )}
                                        <td className="p-4">{product.uom}</td>
                                        <td className="p-4">{product.category}</td>
                                        <td className={`p-4 text-right ${product.stock < 15 ? 'text-red-600 font-medium' : ''}`}>
                                            {product.stock}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 mb-1">{label}</div>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
        </div>
    );
}

function FilterPill({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-1 rounded-full text-sm border ${active
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }`}
        >
            {children}
        </button>
    );
}