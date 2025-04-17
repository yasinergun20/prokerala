const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

// ✅ Prokerala API key’in buraya
const apiKey = "1ecRB9EIVs01sIcfu59WwJaGboIVO8WtgQxYDpIM";

// 🌌 Doğum haritası endpointi
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
    for (const endpoint of endpoints) {
      const url = `https://api.prokerala.com/astrology/v3/${endpoint}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ date, time, latitude, longitude })
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const json = await response.json();
        console.log(`✅ ${endpoint} JSON:`, JSON.stringify(json));
        results[endpoint] = json;
      } else {
        const text = await response.text();
        console.error(`❌ ${endpoint} HATALI YANIT (HTML olabilir):`, text);
        results[endpoint] = { error: "HTML döndü, JSON değil", raw: text };
      }
    }

    res.json(results);
  } catch (err) {
    console.error("🚨 Büyük hata:", err);
    res.status(500).json({ error: "Sunucu hatası", detay: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Sunucu hazır:", PORT));
