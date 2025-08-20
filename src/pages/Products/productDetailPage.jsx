import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/products/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product");
      }
    };
    fetchProduct();
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!product) return <p className="loading">Loading...</p>;

  return (
    <div className="productDetailPage">
      <div className="productDetailCard">
        <img
          src={product.image_url}
          alt={product.name}
          className="productDetailImage"
        />
        <div className="productDetailInfo">
          <h2 className="productDetailName">{product.name}</h2>
          <h3 className="productDetailPrice">${product.price}</h3>
          <p className="productDetailDescription">{product.description}</p>
          <p className="productDetailCategory">
            <strong>Category:</strong> {product.category}
          </p>
          <p className="productDetailStock">
            <strong>Stock:</strong> {product.stock}
          </p>
          <p className="productDetailViews">{product.view_count} Views</p>
          <button className="addToCartBtn">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
