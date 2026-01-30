import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/adminDashboard.css";

export default function AdminDashboard() {
  const [images, setImages] = useState([]);
  const [coinsMap, setCoinsMap] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [activeStatus, setActiveStatus] = useState("pending");

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await api.get("/admin/uploads");

    const sorted = res.data.sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);


    setImages(sorted);
  };

  const approveImage = async (imageId) => {
    const coins = coinsMap[imageId];
    if (!coins || coins <= 0) {
      alert("Enter valid coins");
      return;
    }

    await api.post(`/admin/approve/${imageId}`, { coins });
    fetchImages();
    // setActiveStatus("approved");
  };

  const rejectImage = async (imageId) => {
    await api.post(`/admin/reject/${imageId}`);
    fetchImages();
    // setActiveStatus("rejected");
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredImages = images.filter(
    (img) => img.status === activeStatus
  );

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* STATUS TABS */}
      <div className="status-tabs">
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            className={`status-tab ${
              activeStatus === status ? "active" : ""
            }`}
            onClick={() => setActiveStatus(status)}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="admin-content">
        {filteredImages.length === 0 && (
          <p className="empty-text">No {activeStatus} images</p>
        )}

        {filteredImages.map((img) => (
          <div key={img._id} className="admin-card">
            {/* THUMBNAIL */}
            <img
              src={`http://localhost:5000/uploads/${img.imagePath}`}
              alt="upload"
              className="admin-thumb"
              onClick={() =>
                setPreviewImage(
                  `http://localhost:5000/uploads/${img.imagePath}`
                )
              }
            />

            <p>
              <strong>User:</strong>{" "}
              {img.userId?.email || "Unknown user"}
            </p>

            <p className="date-text">
              ⏱ Uploaded: {formatDate(img.createdAt)}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${img.status}`}>
                {img.status}
              </span>
            </p>

            {img.status === "pending" && (
              <>
                <input
                  type="number"
                  placeholder="Coins"
                  className="coin-input"
                  value={coinsMap[img._id] || ""}
                  onChange={(e) =>
                    setCoinsMap({
                      ...coinsMap,
                      [img._id]: e.target.value,
                    })
                  }
                />

                <div className="admin-actions">
                  <button
                    className="approve-btn"
                    onClick={() => approveImage(img._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => rejectImage(img._id)}
                  >
                    Reject
                  </button>
                </div>
              </>
            )}

            {img.status === "approved" && (
              <p className="approved-text">
                ✅ Coins Given: {img.coins}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="image-modal" onClick={() => setPreviewImage(null)}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={previewImage} alt="preview" />
            <span
              className="close-btn"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
