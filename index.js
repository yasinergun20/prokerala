const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

// 🔐 Prokerala Client ID ve Secret
const clientId = "9e6d5d64-59ed-445c-bf95-f2896343a1ef";
const clientSecret = "1ecRB9EIVs01sIcfu59WwJaGboIVO8WtgQxYDpIM";

// ⛽ Token alma fonksiyonu
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
    console.error("❌ Token alınamadı:", data);
    throw new Error("Token alınamadı");
  }
}

// 🌌 Doğum haritası endpoint'i
app.post("/dogumharitasi", async (req, res) => {
  const { date, time, latitude, longitude } = req.body;
  console.log("📥 İstek alındı:", date, time, latitude, longitude);

  const endpoints = [
    "moon-sign",
    "ascendant",
    "planet-positions",
    "house-positions"
  ];

  const results = {};

  try {
    const token = await getAccessToken();

    for (const endpoint of endpoints) {
   const url = `https://api.prokerala.com/v2/astrology/${endpoint}`;

      console.log("🔗 İstek:", url);

      const response = await fetch(url, {
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
        console.log(`✅ ${endpoint} JSON geldi`);
        results[endpoint] = json;
      } else {
        const text = await response.text();
        console.error(`❌ ${endpoint} HTML döndü:\n`, text.substring(0, 200));
        results[endpoint] = { error: "HTML döndü", detay: text };
      }
    }

    res.json(results);
  } catch (err) {
    console.error("🚨 Fatal hata:", err.message);
    res.status(500).json({ error: "Sunucu hatası", detay: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Sunucu hazır, port:", PORT));
