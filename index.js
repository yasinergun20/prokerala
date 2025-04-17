const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// 🔐 API key burada
const apiKey = "1ecRB9EIVs01sIcfu59WwJaGboIVO8WtgQxYDpIM";

// 🌌 Ana endpoint: tüm verileri birlikte gönderir
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
      const response = await fetch(`https://api.prokerala.com/v2/astrology/${endpoint}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: date,
          time: time,
          latitude: latitude,
          longitude: longitude
        })
      });

      const json = await response.json();
      console.log(`📡 ${endpoint} cevabı:`, JSON.stringify(json));
      results[endpoint] = json;
    }

    res.json(results);
  } catch (err) {
    console.error("🚨 API çağrısı sırasında hata:", err);
    res.status(500).json({ error: "API çağrısı başarısız", detay: err.message });
  }
});

// 🔁 Test: Ay burcu ayrı çalışmak istersen
app.post("/ayburcu", async (req, res) => {
  const { date, time, latitude, longitude } = req.body;

  try {
    const response = await fetch("https://api.prokerala.com/v2/astrology/moon-sign", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ date, time, latitude, longitude })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Ay burcu hatası:", err);
    res.status(500).json({ error: "Ay burcu alınamadı", detay: err.message });
  }
});

// 🔊 Sunucu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Sunucu çalışıyor:", PORT));
