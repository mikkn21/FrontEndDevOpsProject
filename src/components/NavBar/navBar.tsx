import React from "react";
import Cookies from "js-cookie";
import { NavLink, useNavigate } from "react-router-dom"; // Import NavLink
import "./navBar.css";
import logo from "../../../public/favicon.png";
import Button from "../Button/Button";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const adminToken = Cookies.get("adminToken");
  let username: string | null = null;

  if (adminToken) {
    const parts = adminToken.split("|");
    if (parts.length > 1 && parts[0] === "adminToken") {
      username = parts[1];
    }
  }

  const handleLogout = () => {
    Cookies.remove("adminToken");
    navigate("/login"); // Assuming you have a login route
  };

  return (
    <div className="navbar">
      <div className="menu">
        <div className="navbar-logo">
          <NavLink to="/">
            <img src={logo} />
          </NavLink>
        </div>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/p1"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Page 1
        </NavLink>
        <NavLink
          to="/p2"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Page 2
        </NavLink>
      </div>
      <div className="dropdown">
        <span className="username-container">
          <p>{username ? username : "UserName"}</p>
          <span className="dropdown-icon">▼</span>
        </span>

        <div className="dropdown-content">
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
