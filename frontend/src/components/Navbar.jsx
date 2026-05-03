import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const isClient = user?.role === 'Client';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-800 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/home" className="text-xl font-bold">
          StayFresh
        </Link>

        <div className="flex items-center gap-6 flex-1 ml-10">
          <div className="flex items-center gap-6 flex-1">
            <Link to="/home" className="hover:text-green-200">Home</Link>
            <Link to="/orders" className="hover:text-green-200">Orders</Link>
            <Link to="/orders/history" className="hover:text-green-200">History</Link>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-green-200 text-sm">{user?.email}</span>

            {/* only clients will see cart */}
            {isClient && (
              <Link to="/cart" className="relative hover:text-green-200">
                Cart
                {itemCount > 0 && (
                  <span className="
                                absolute -top-2 -right-4 bg-white text-green-800 
                                text-xs font-bold rounded-full w-5 h-5 
                                flex items-center justify-center
                                ">
                    {/* todo: adjust itemCount logic */}
                    {itemCount}
                  </span>
                )}
              </Link>
            )}

            <button onClick={handleLogout} className="hover:text-green-200">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;