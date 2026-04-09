import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Admin Routes - Different UI with AdminLayout */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminRoute>
          } />
          
          {/* Regular User Routes - Normal UI with Navbar + Footer */}
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/products" element={<><Navbar /><Products /><Footer /></>} />
          <Route path="/products/:id" element={<><Navbar /><ProductDetails /><Footer /></>} />
          <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
          <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />
          
          <Route path="/cart" element={<><Navbar /><ProtectedRoute><Cart /></ProtectedRoute><Footer /></>} />
          <Route path="/wishlist" element={<><Navbar /><ProtectedRoute><Wishlist /></ProtectedRoute><Footer /></>} />
          <Route path="/checkout" element={<><Navbar /><ProtectedRoute><Checkout /></ProtectedRoute><Footer /></>} />
          <Route path="/order-success/:id" element={<><Navbar /><ProtectedRoute><OrderSuccess /></ProtectedRoute><Footer /></>} />
          <Route path="/orders" element={<><Navbar /><ProtectedRoute><Orders /></ProtectedRoute><Footer /></>} />
          <Route path="/orders/:id" element={<><Navbar /><ProtectedRoute><OrderDetails /></ProtectedRoute><Footer /></>} />
          <Route path="/profile" element={<><Navbar /><ProtectedRoute><Profile /></ProtectedRoute><Footer /></>} />
        </Routes>
        <ScrollToTop />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
