// src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import ProductDetail from './pages/ProductDetail';


function HomePlaceholder() {
  return <div className="p-8">Home page placeholder — coming soon</div>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route
        path="/products/new"
        element={<PrivateRoute requireStaff><AddProduct /></PrivateRoute>}
      />
      <Route
        path="/products/:id"
        element={<PrivateRoute requireStaff><ProductDetail /></PrivateRoute>}
      />
    </Routes>
  );
}