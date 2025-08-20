import "./header.css";

const Header = ({ placeholder = "Search..." }) => {
  return (
    <div className="header">
      <h1>Contect</h1>
      <a href="/logout">logout</a>
    </div>
  );
};

export default Header;
