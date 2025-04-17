const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

// 🔐 Kendi Prokerala API bilgilerin
const clientId = "9e6d5d64-59ed-445c-bf95-f2896343a1ef";
const clientSecret = "1ecRB9EIVs01sIcfu59WwJaGboIVO8WtgQxYDpIM";

// ⛽ Önce Access Token al
async function getAccessToken() {
  const response = await fetch("https://api.prokerala.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret
    })
  });

  const data = await response.json();

  if (data.access_token) {
    return data.access_token;
  } else {
    throw new Error("Access token alınamadı: " + JSON.stringify(data));
  }
}

// 🌌 Doğum haritası endpoint’i
app.post("/dogumharitasi", async (req, res) => {
  const { date, time, latitude, longitude } = req.body;
  console.log("📥 İstek alındı:", date, time, latitude, longitude);

  const endpoints = [
    "moon-sign",
    "planet-positions",
    "house-positions",
    "ascendant"
  ];

  const results = {};

  try {
    const token = await getAccessToken();

    for (const endpoint of endpoints) {
      const response = await fetch(`https://api.prokerala.com/api/v4/astrology/${endpoint}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ date, time, latitude, longitude })
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const json = await response.json();
        console.log(`✅ ${endpoint}:`, JSON.stringify(json));
        results[endpoint] = json;
      } else {
        const raw = await response.text();
        console.log(`❌ ${endpoint} Hatalı içerik:`, raw);
        results[endpoint] = { error: "HTML geldi", detay: raw };
      }
    }

    res.json(results);
  } catch (err) {
    console.error("🚨 Hata:", err);
    res.status(500).json({ error: "Sunucu hatası", detay: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Sunucu hazır:", PORT));
