// Sidebar.jsx
import { useState } from "react";
import "./sidebar.css";

const Sidebar = ({ user, sidebarWidth, setSidebarWidth }) => {
  const COLLAPSED = 80;
  const EXPANDED = 250;

  const toggleSidebarWidth = () => {
    setSidebarWidth(sidebarWidth <= COLLAPSED ? EXPANDED : COLLAPSED);
  };

  return (
    <div
      className={`userPages ${sidebarWidth <= COLLAPSED ? "collapsed" : ""}`}
      style={{ width: sidebarWidth }}
    >
      <div className="sidebarContent">
        <div className="avatar">
          <img
            src="https://avataaars.io/?avatarStyle=Transparent&topType=Hat&accessoriesType=Blank&hairColor=Black&facialHairType=BeardLight&facialHairColor=Auburn&clotheType=Hoodie&eyeType=Side&eyebrowType=UnibrowNatural&mouthType=Disbelief&skinColor=Tanned"
            alt="Avatar"
          />
          <h2 className="username">
            {user ? `${user.name} ${user.surname}` : "Loading..."}
          </h2>
        </div>
        <a href="/profile" className="icon">
          <div className="pageInfo"> <i class="fa-solid fa-user"></i> <p className="textLabel">Profile</p></div>
        </a>
        <a href="#" className="icon">
          <div className="pageInfo"> <i class="fa-solid fa-boxes-stacked"></i> <p className="textLabel">Orders</p></div>
        </a>
        <a href="/products" className="icon">
          <div className="pageInfo"> <i class="fa-solid fa-cart-shopping"></i> <p className="textLabel">Products</p></div>
        </a>
        <a href="#" className="icon">
          <div className="pageInfo"> <i class="fa-solid fa-bag-shopping"></i> <p className="textLabel">Cart Items</p></div>
        </a>
        <a href="#" className="icon">
          <div className="pageInfo">     <i class="fa-solid fa-clipboard-list"></i>
            <p className="textLabel">Order Items</p></div>
        </a>
      </div>

      <button className="toggleBtn" onClick={toggleSidebarWidth}>
        {sidebarWidth <= COLLAPSED ? "➡" : "⬅"}
      </button>
    </div>
  );
};

export default Sidebar;
