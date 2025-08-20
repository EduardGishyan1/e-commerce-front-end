import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./createProduct.css";

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    image_url: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert numeric fields to numbers
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };
  
    try {
      const accessToken = Cookies.get("accessToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/products`,
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="createProductPage">
      <h2>Create New Product</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="createProductForm">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          value={formData.image_url}
          onChange={handleChange}
        />
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
