import { useEffect, useState } from "react";
import axios from "axios";
import "./getProducts.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProductsPage = () => {
  const [sidebarWidth, setSidebarWidth] = useState(80);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState(() => new Set());
  const [wlLoading, setWlLoading] = useState(() => new Set());
  const navigate = useNavigate();

  const accessToken = Cookies.get("accessToken");

  const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  const authApi = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken || ""}`,
    },
    withCredentials: true,
  });

  const fetchProducts = async (pageNumber) => {
    const { data } = await api.get("/products", { params: { page: pageNumber, size } });
    const items = data?.products?.items ?? [];
    setProducts(items);
    setPage(data?.products?.page ?? pageNumber);
    setTotalPages(data?.products?.pages ?? 1);
    return items;
  };

  // For current page only: GET /wishlists/:productId for each product (marks heart)
  const fetchWishlistForPage = async (productIds) => {
    if (!accessToken || !productIds?.length) return;
    const results = await Promise.allSettled(
      productIds.map((id) => authApi.get(`/wishlists/${id}`))
    );
    const prefilled = new Set();
    results.forEach((res, idx) => {
      if (res.status === "fulfilled") {
        prefilled.add(productIds[idx]); // 200 means exists
      } else {
        const status = res.reason?.response?.status;
        if (status !== 404) {
          console.warn("Wishlist check failed for", productIds[idx], status);
        }
      }
    });
    setWishlist(prefilled);
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const items = await fetchProducts(page);
        if (!alive) return;
        await fetchWishlistForPage(items.map((p) => p.id));
      } catch (e) {
        console.error(e);
        setError("Failed to fetch products");
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, accessToken]);

  // Helpers
  const addToWishlist = async (productId) => {
    try {
      await authApi.post("/wishlists", { product_id: productId });
      return "added";
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        // Exists -> toggle off per your requirement
        await removeFromWishlist(productId);
        return "removed";
      }
      throw err;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await authApi.delete(`/wishlists/${productId}`);
      return "removed";
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        // Already removed on server; treat as success
        return "removed";
      }
      throw err;
    }
  };

  const handleWishlistClick = async (productId) => {
    if (wlLoading.has(productId)) return;

    setWlLoading((prev) => new Set(prev).add(productId));

    const isWished = wishlist.has(productId);

    // Optimistic toggle
    if (isWished) {
      // Optimistically remove
      setWishlist((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });

      try {
        await removeFromWishlist(productId);
      } catch (err) {
        // Rollback on unexpected error
        setWishlist((prev) => new Set(prev).add(productId));
        console.error("Wishlist remove failed:", err);
        alert("Could not remove from wishlist.");
      } finally {
        setWlLoading((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }
    } else {
      // Optimistically add
      setWishlist((prev) => new Set(prev).add(productId));

      try {
        const result = await addToWishlist(productId);
        if (result === "removed") {
          // Server said 409 → we deleted instead; reflect that by un-filling
          setWishlist((prev) => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
          });
        }
      } catch (err) {
        // Rollback on unexpected error
        setWishlist((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        console.error("Wishlist add failed:", err);
        alert("Could not add to wishlist.");
      } finally {
        setWlLoading((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }
    }
  };

  const handleAddToCart = (product) => {
    console.log("Add to cart:", product.id);
    // TODO: call your cart API/context
  };

  return (
    <div className="productsPage">
      <Sidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
      <div className="productsData">
        <Header sidebarWidth={sidebarWidth} />

        <div className="productsInfo" style={{ marginLeft: `${sidebarWidth}px` }}>
          <h2 className="headerText">All Products</h2>

          {error && <p className="error">{error}</p>}
          {products.length === 0 && !error && <p>No products found.</p>}

          {products.map((product) => {
            const wished = wishlist.has(product.id);
            const loading = wlLoading.has(product.id);

            return (
              <div
                key={product.id}
                className="productCard"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="productMedia">
                  <img
                    src={
                      product.image_url ||
                      "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                    }
                    alt={product.name}
                    className="productImage"
                  />

                  <button
                    className={`wishlistFab ${wished ? "is-active" : ""}`}
                    aria-label={wished ? "In wishlist" : "Add to wishlist"}
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistClick(product.id);
                    }}
                  >
                    <i className={wished ? "fa-solid fa-heart" : "fa-regular fa-heart"} />
                  </button>
                </div>

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

                <div className="productActions" onClick={(e) => e.stopPropagation()}>
                  <a
                    className="cartBtn"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                  >
                    Add to cart <i className="fa-solid fa-bag-shopping"></i>
                  </a>
                </div>
              </div>
            );
          })}
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
            <span>Page {page} of {totalPages}</span>
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
