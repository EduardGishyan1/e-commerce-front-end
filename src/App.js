import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login/Login';
import UserPage from './pages/User/UserPage';
import CreateProduct from './pages/Products/Products';
import ProductsPage from "./pages/Products/GetProducts";
import ProductDetailPage from "./pages/Products/productDetailPage";
import Logout from './pages/Login/Logout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<UserPage />} />
        <Route path="*" element={<LoginPage />} /> {/* fallback */}
        <Route path='/create-product' element={<CreateProduct />}/>
        <Route path='/products' element={<ProductsPage />}/>
        <Route path='/products/:id' element={<ProductDetailPage />}/>
        <Route path='/logout' element={<Logout />}/>
      </Routes>
    </Router>
  );
}

export default App;
