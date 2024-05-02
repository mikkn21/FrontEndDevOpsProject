import React from "react";
import Cookies from "js-cookie";
import { NavLink, useNavigate } from "react-router-dom"; // Import NavLink
import "./navBar.css";
import logo from "../../../public/favicon.png";
import Button from "../Button/Button";
import { getCookieUsername, TOKEN_NAME } from "../../utils/cookieUtils";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  let username = getCookieUsername();

  const handleLogout = () => {
    Cookies.remove(TOKEN_NAME);
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
