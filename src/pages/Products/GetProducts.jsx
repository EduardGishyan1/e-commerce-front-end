import { useEffect, useState } from "react";
import axios from "axios";
import "./getProducts.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

const ProductsPage = () => {
  const [sidebarWidth, setSidebarWidth] = useState(80);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10); // products per page
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async (pageNumber) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/products`,
        { params: { page: pageNumber, size } }
      );
      setProducts(response.data.products.items);
      setPage(response.data.products.page);
      setTotalPages(response.data.products.pages);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return (
    <div className="productsPage">
      <Sidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
      <div className="productsData">
        <Header />

        {/* Add inline style to dynamically adjust margin-left */}
        <div
          className="productsInfo"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          
          <h2 className="headerText">All Products</h2>

          {error && <p className="error">{error}</p>}
          {products.length === 0 && !error && <p>No products found.</p>}

          {products.map((product) => (
            <div
              key={product.id}
              className="productCard"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <img
                src={
                  product.image_url ||
                  "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                }
                alt={product.name}
                className="productImage"
              />
              <h3 className="productPrice">${product.price}</h3>
              <h2 className="productName">{product.name}</h2>
              <p className="productCategory">{product.category}</p>

              <div className="productStats">
                <span className="statBadge">
                  {product.view_count} <i className="fa-solid fa-eye"></i>
                </span>
                <span className="statBadge">
                  <strong>Stock:</strong> {product.stock}
                </span>
              </div>

              <a className="cartBtn">In the cart</a>
            </div>
          ))}
        </div>

        <div className="pagination">
          <div className="wrapper">
            <button
              className="next_previous"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              &lt; Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="next_previous"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next &gt;
            </button>
          </div>
        </div>
        </div>
      </div>
  );
};

export default ProductsPage;
