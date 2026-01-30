import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/userDashboard.css";

export default function UserDashboard() {
  const [coins, setCoins] = useState(0);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [uploads, setUploads] = useState([]);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    fetchUserData();
    fetchUploads();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/users/me");
      setCoins(res.data.coins);
    } catch (err) {
      console.error("Failed to fetch user data");
    }
  };

  const fetchUploads = async () => {
    try {
      const res = await api.get("/images/my-images");
      setUploads(res.data);
    } catch (err) {
      console.error("Failed to fetch uploads");
    }
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      await api.post("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Image uploaded successfully");
      setImage(null);
      fetchUploads();
    } catch (err) {
      setMessage("❌ Upload failed");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="user-dashboard">
      {/* HEADER */}
      <div className="user-dashboard-header">
        <div>
          <h2>User Dashboard</h2>
          <p>Upload batteries • Earn coins • Help environment 🌱</p>
        </div>

        <button className="user-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="user-dashboard-content">
        {/* STATS + ACTION */}
        <div className="user-stats-row">
          <div className="user-stats">
            <div className="user-stat-card">
              <span className="user-stat-title">Total Coins</span>
              <span className="user-stat-value">💰 {coins}</span>
            </div>

            <div className="user-stat-card">
              <span className="user-stat-title">Uploads</span>
              <span className="user-stat-value">📸 {uploads.length}</span>
            </div>
          </div>

          <button className="redeem-btn" onClick={() => navigate("/redeem")}>
            Redeem Rewards 🎁
          </button>
        </div>

        {/* UPLOAD SECTION */}
        <div className="user-upload-card">
          <h3>Upload Battery Image</h3>
          <p>
            Upload a clear image of the battery placed in the collection bin.
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button className="user-upload-btn" onClick={handleUpload}>
            Upload Image
          </button>

          {message && <p className="user-success">{message}</p>}
        </div>

        {/* UPLOADS */}
        <h3>Your Uploads</h3>

        {uploads.length === 0 && (
          <p className="user-muted">No images uploaded yet.</p>
        )}

        <div className="user-uploads-grid">
          {uploads.map((img) => (
            <div key={img._id} className="user-upload-card-item">
              <img
                src={`http://localhost:5000/uploads/${img.imagePath}`}
                alt="upload"
              />

              <div className="user-upload-info">
                <span className={`user-status ${img.status}`}>
                  {img.status}
                </span>

                <span className="user-upload-date">
                  {formatDate(img.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
