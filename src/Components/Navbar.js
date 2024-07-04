import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { useTheme } from "../ThemeContext";
import { useAuth } from "../store/auth";
import img from "./logowhitemode.png";
import imgDark from "./logodarkmode.png";
import "./Navbar.css";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    navigate("/logout");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className="nav"
      style={{
        backgroundColor: darkMode ? "#191919" : "#fff",
        color: darkMode ? "#fff" : "#333",
      }}
    >
      <div className="logo">
        <img src={darkMode ? imgDark : img} alt="Logo" className="logoImg" />
      </div>
      <div className={`nav-menu ${isMenuOpen ? "open" : ""}`} style={{
        backgroundColor: darkMode ? "#191919" : "#fff",
        color: darkMode ? "#fff" : "#333",
      }}>
        <ul className="nav-ul">
          <li>
            <NavLink
              to="/"
              onClick={toggleMenu}
              style={{
                backgroundColor: darkMode ? "#191919" : "#fff",
                color: darkMode ? "#fff" : "#333",
              }}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contributors"
              onClick={toggleMenu}
              style={{
                backgroundColor: darkMode ? "#191919" : "#fff",
                color: darkMode ? "#fff" : "#333",
              }}
            >
              Contributors
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              onClick={toggleMenu}
              style={{
                backgroundColor: darkMode ? "#191919" : "#fff",
                color: darkMode ? "#fff" : "#333",
              }}
            >
              Report a Bug
            </NavLink>
          </li>
        </ul>
        <div className="rightIcons">
          <button onClick={toggleDarkMode} className="darkModeButton">
            {darkMode ? <FaSun color="#FFD700" /> : <FaMoon color="#4B0082" />}
          </button>
          {isLoggedIn ? (
            <button onClick={handleLogoutClick} className="logoutButton">
              Logout
            </button>
          ) : (
            <button onClick={handleLoginClick} className="loginButton">
              Login
            </button>
          )}
        </div>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;


   