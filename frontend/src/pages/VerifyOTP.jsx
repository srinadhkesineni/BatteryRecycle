import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // Safety check
  if (!email) {
    navigate("/register");
    return null;
  }

  const handleVerify = async () => {
    try {
      setError("");

      await api.post("/auth/verify-otp", {
        email,
        otp
      });

      alert("Email verified successfully");
      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Verify Email</h2>

        <p style={{ fontSize: "14px" }}>
          OTP sent to <strong>{email}</strong>
        </p>

        {error && (
          <p style={{ color: "red", textAlign: "center" }}>
            {error}
          </p>
        )}

        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button onClick={handleVerify}>
          Verify OTP
        </button>
      </div>
    </div>
  );
}
