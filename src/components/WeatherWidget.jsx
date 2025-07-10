import React from "react";

const WeatherWidget = ({ city = "Грозный", temp = 18, icon = "☀️" }) => {
  return (
    <div style={{ position: "absolute", top: 20, right: 20, background: "#fff", borderRadius: 16, padding: "8px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", color: "#4A4039", display: "flex", alignItems: "center", gap: 8 }}>
      <span>{icon}</span>
      <span>{city}: {temp}°C</span>
    </div>
  );
};

export default WeatherWidget; 