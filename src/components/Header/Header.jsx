import "./header.css";

const Header = ({ sidebarWidth, placeholder = "Search..." }) => {
  return (
    <div
      className="header"
      style={{ 
        marginLeft: `${sidebarWidth}px`, 
        width: `calc(100% - ${sidebarWidth}px)` 
      }}
    >
      <h1>Contect</h1>
      <a className="logout" href="/logout">logout</a>
    </div>
  );
};

export default Header;
