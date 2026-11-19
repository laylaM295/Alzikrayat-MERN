
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Alzikrayat
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        {isAuthenticated ? (
          <>
            <Link to="/upload">Upload Photo</Link>
            <Link to="/profile">Profile</Link>

            <span className="navbar-user">
              {user?.firstName || "User"}
            </span>

            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
