import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/redeemRewards.css";

export default function RedeemRewards() {
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    const res = await api.get("/users/me");
    setCoins(res.data.coins);
  };

  const rewards = [
    { name: "Amazon Gift Card", coins: 100, icon: "🎁" },
    { name: "Flipkart Gift Card", coins: 150, icon: "🛒" },
    { name: "Food Voucher", coins: 80, icon: "🍔" },
    { name: "Fuel Voucher", coins: 200, icon: "⛽" },
  ];

  return (
    <div className="redeem-page">
      {/* HEADER */}
      <div className="redeem-header">
        <h2>Redeem Rewards 🎁</h2>
        <p>Turn your recycling efforts into real rewards</p>
      </div>

      {/* COINS SUMMARY */}
      <div className="redeem-summary">
        <span>Your Balance</span>
        <strong>💰 {coins} Coins</strong>
      </div>

      {/* BATTERY POINTS */}
      <div className="redeem-section">
        <h3>Battery → Points System</h3>
        <ul className="points-list">
          <li>AA / AAA batteries – 1 point</li>
          <li>C / D batteries – 2 points</li>
          <li>9V batteries – 3 points</li>
          <li>Button / Coin cell batteries – 5 points</li>
          <li>Rechargeable (NiMH / NiCd) – 6 points</li>
          <li>Lithium-ion batteries – 10 points</li>
          <li>Power tool / e-bike batteries – 20 points</li>
        </ul>
      </div>

      {/* REWARDS */}
      <div className="redeem-section">
        <h3>Available Rewards</h3>

        <div className="reward-grid">
          {rewards.map((reward) => {
            const disabled = coins < reward.coins;

            return (
              <div
                key={reward.name}
                className={`reward-card ${disabled ? "disabled" : ""}`}
              >
                <div className="reward-icon">{reward.icon}</div>
                <div className="reward-name">{reward.name}</div>
                <div className="reward-coins">
                  {reward.coins} Coins
                </div>

                <button disabled={disabled}>
                  {disabled ? "Not Enough Coins" : "Redeem"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
