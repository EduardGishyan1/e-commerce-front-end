import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product");
      }
    };

    fetchProduct();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{product.name}</h2>
      <img 
        src={product.image_url} 
        alt={product.name} 
        style={{ width: "300px", borderRadius: "12px" }}
      />
      <h3>Price: ${product.price}</h3>
      <p>{product.description}</p>
      <p>Category: {product.category}</p>
      <p>Stock: {product.stock}</p>
      <p>{product.view_count} Viewers</p>
    </div>
  );
};

export default ProductDetailPage;
