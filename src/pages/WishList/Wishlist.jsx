import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./wishlist.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const WishlistPage = () => {
  const [sidebarWidth, setSidebarWidth] = useState(80);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loadingIds, setLoadingIds] = useState(() => new Set());
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();

  const accessToken = Cookies.get("accessToken");

  const authApi = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken || ""}`,
    },
    withCredentials: true,
  });

  const fetchWishlist = async () => {
    setIsFetching(true);
    try {
      const { data } = await authApi.get("/wishlists");
      const list = Array.isArray(data) ? data : data?.items ?? data?.wishlists ?? [];
      setItems(list);
      setError("");
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      setError("Please sign in to view your wishlist.");
      setItems([]);
      return;
    }
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const removeFromWishlist = async (productId) => {
    try {
      await authApi.delete(`/wishlists/${productId}`);
    } catch (err) {
      if (err?.response?.status !== 404) throw err;
    }
  };

  const onRemoveClick = async (productId) => {
    if (loadingIds.has(productId)) return;
    setLoadingIds((p) => new Set(p).add(productId));

    const prev = items;
    setItems((arr) => arr.filter((x) => x.id !== productId));

    try {
      await removeFromWishlist(productId);
    } catch (err) {
      console.error("Remove failed:", err);
      setItems(prev); // rollback
      alert("Could not remove from wishlist.");
    } finally {
      setLoadingIds((p) => {
        const n = new Set(p);
        n.delete(productId);
        return n;
      });
    }
  };

  const handleAddToCart = (product) => {
    console.log("Add to cart:", { productId: product.id, price: product.price, qty: 1 });
  };

  const usd = (n) =>
    typeof n === "number"
      ? n.toLocaleString("en-US", { style: "currency", currency: "USD" })
      : "";

  const fmtDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "";

  const totals = useMemo(() => {
    const total = items.reduce((s, p) => s + (typeof p.price === "number" ? p.price : 0), 0);
    return { count: items.length, total };
  }, [items]);

  return (
    <div className="wl3-page">
      <Sidebar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
      <div className="wl3-data">
        <Header sidebarWidth={sidebarWidth} />

        {/* SHELL: reserves space for sidebar but keeps inner container centered */}
        <div className="wl3-shell" style={{ "--sidebar-width": `${sidebarWidth}px` }}>
          <div className="wl3-container">
            {/* Header */}
            <div className="wl3-header">
              <h2 className="wl3-title">Wishlist</h2>
              <span className="wl3-count">{totals.count} items</span>
            </div>

            {/* Sticky summary */}
            <div className="wl3-summary" role="region" aria-label="Order summary">
              <div className="wl3-summary-info">
                <span className="wl3-summary-items">{totals.count} items</span>
                <span className="wl3-summary-total">{usd(totals.total)}</span>
              </div>
              <button className="wl3-summary-cta" disabled={!items.length}>
                Checkout
              </button>
            </div>

            {error && <p className="wl3-error">{error}</p>}

            {/* Loading skeleton */}
            {isFetching && !items.length ? (
              <div className="wl3-list">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="wl3-row wl3-skel" key={i}>
                    <div className="wl3-thumb skeleton-box" />
                    <div className="wl3-info">
                      <div className="skeleton-line" />
                      <div className="skeleton-line short" />
                      <div className="skeleton-line tiny" />
                    </div>
                    <div className="wl3-pricecol">
                      <div className="skeleton-pill" />
                      <div className="skeleton-btn" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !items.length && !error ? (
              <div className="wl3-empty">
                <div className="wl3-empty-art" aria-hidden>
                  ♡
                </div>
                <h3>Nothing saved yet</h3>
                <p>Browse products and add your favorites to the wishlist.</p>
                <button className="wl3-browse" onClick={() => navigate("/products")}>
                  Explore products
                </button>
              </div>
            ) : (
              <div className="wl3-list">
                {items.map((p) => {
                  const {
                    id,
                    name,
                    price,
                    image_url,
                    category,
                    stock,
                    view_count,
                    is_active,
                    created_at,
                    updated_at,
                  } = p;

                  const loading = loadingIds.has(id);

                  return (
                    <article className="wl3-row" key={id}>
                      {/* Image */}
                      <button
                        className="wl3-thumb"
                        onClick={() => navigate(`/products/${id}`)}
                        aria-label={`Open ${name || `#${id}`}`}
                      >
                        {image_url ? <img src={image_url} alt={name || `#${id}`} /> : null}
                      </button>

                      {/* Middle: info */}
                      <div className="wl3-info">
                        <h3
                          className="wl3-name"
                          onClick={() => navigate(`/products/${id}`)}
                          title={name}
                        >
                          {name}
                        </h3>

                        {/* Meta row */}
                        <div className="wl3-meta">
                          {category && (
                            <span className="chip">
                              <i className="fa-solid fa-tag" />
                              {category}
                            </span>
                          )}
                          {typeof stock === "number" && (
                            <span className="chip">
                              <i className="fa-solid fa-boxes-stacked" />
                              Stock: {stock}
                            </span>
                          )}
                          {typeof view_count === "number" && (
                            <span className="chip">
                              <i className="fa-regular fa-eye" />
                              {view_count}
                            </span>
                          )}
                          {is_active !== undefined && (
                            <span className={`chip ${is_active ? "ok" : "bad"}`}>
                              <i
                                className={`fa-solid ${
                                  is_active ? "fa-circle-check" : "fa-circle-xmark"
                                }`}
                              />
                              {is_active ? "Active" : "Inactive"}
                            </span>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="wl3-dates">
                          {created_at && (
                            <span title={`Created: ${fmtDate(created_at)}`}>
                              <i className="fa-regular fa-calendar-plus" /> {fmtDate(created_at)}
                            </span>
                          )}
                          {updated_at && (
                            <span title={`Updated: ${fmtDate(updated_at)}`}>
                              <i className="fa-regular fa-clock" /> {fmtDate(updated_at)}
                            </span>
                          )}
                        </div>

                        {/* Inline actions for mobile */}
                        <div className="wl3-actions mobile">
                          <button
                            className="btn ghost"
                            disabled={loading}
                            onClick={() => onRemoveClick(id)}
                          >
                            Remove
                          </button>
                          <button className="btn dark" onClick={() => handleAddToCart(p)}>
                            Add to cart
                          </button>
                        </div>
                      </div>

                      {/* Right: price + actions */}
                      <div className="wl3-pricecol">
                        <div className="wl3-price">{usd(price)}</div>
                        <div className="wl3-actions">
                          <button
                            className="btn ghost"
                            disabled={loading}
                            onClick={() => onRemoveClick(id)}
                            aria-label={`Remove ${name || `#${id}`}`}
                            title="Remove"
                          >
                            Remove
                          </button>
                          <button className="btn dark" onClick={() => handleAddToCart(p)}>
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
