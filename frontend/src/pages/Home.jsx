import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProducts, getProductStats } from '../services/productService';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import { FilterPill, StatCard } from '../components/SubComponents';
import { AdminProductRow } from '../components/AdminProductRow';
import { ProductRow } from '../components/ProductRow';

const Home = () => {
    const { user } = useAuth();

    const isAdmin = user?.role === 'Staff';

    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch products whenever search changes
    useEffect(() => {
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

                setStats(statsData?.data || null);

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
                        {/* optional chain in case api returns empty obj */}
                        <StatCard label="Active Products" value={stats?.activeProducts} />
                        <StatCard label="Pending Orders" value={stats?.pendingOrders} />
                        <StatCard label="Total Orders" value={stats?.totalOrders} />
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
                    <div className="flex justify-end items-center gap-4">
                        {isAdmin && (
                            <Link
                                to="/products/new"
                                className="whitespace-nowrap inline-flex items-center gap-1 border border-gray-200 bg-white 
                                hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-md"
                            >
                                {/* add lucide icon */}
                                <span className="text-green-600"></span> New Product
                            </Link>
                        )}
                        
                        <SearchBar onChange={setSearch} placeholder="Search products..." />
                        
                    </div>
                </div>

                {/* Error state */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Loading ? empty : (isAdmin ? <AdminProductRow /> : <ProductRow />) */}
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
                                    {isAdmin && <th className="text-center p-4">View</th>}
                                    {!isAdmin && <th className="text-center p-4">Add to Order</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map((product) =>
                                    isAdmin ? (
                                        <AdminProductRow key={product.id} product={product} />
                                    ) : (
                                        <ProductRow key={product.id} product={product} />
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;