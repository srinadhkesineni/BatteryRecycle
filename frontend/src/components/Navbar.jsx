import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">🔋 BatteryRecycle</div>

      <div className="nav-links">
        <Link to="/">About Us</Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-btn">
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <span className="coins-badge">💰 {user.coins || 0} Coins</span>
            <Link to="/redeem">Redeem</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
