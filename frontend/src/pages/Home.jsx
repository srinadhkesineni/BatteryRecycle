import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/home.css";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <h1>Recycle Batteries. Earn Rewards. Save Earth 🌍</h1>
        <p>
          Dispose used lithium batteries responsibly and earn coins that can be
          redeemed for real rewards.
        </p>
      </section>

      {/* BENEFITS */}
      <section className="section">
        <h2>Why Battery Recycling Matters</h2>
        <div className="cards">
          <div className="info-card">
            ♻️ Prevents toxic waste from entering soil & water
          </div>
          <div className="info-card">
            🔋 Recovers valuable metals like lithium & cobalt
          </div>
          <div className="info-card">
            🌱 Reduces environmental pollution
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section light">
        <h2>How It Works</h2>
        <div className="steps">
          <div>📦 Drop batteries in our collection bins</div>
          <div>📸 Upload image via our app</div>
          <div>✅ Admin verifies & assigns coins</div>
          <div>🎁 Redeem coins for rewards</div>
        </div>
      </section>

      {/* EXTRA */}
      <section className="section">
        <h2>Our Impact</h2>
        <p className="impact-text">
          Every recycled battery helps reduce carbon emissions, saves energy,
          and protects future generations. Small actions create big change.
        </p>
      </section>

      <Footer />
    </>
  );
}
