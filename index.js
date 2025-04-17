const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const apiKey = "1ecRB9EIVs01sIcfu59WwJaGboIVO8WtgQxYDpIM"; // senin API key

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
      const response = await fetch(`https://api.prokerala.com/astrology/v3/${endpoint}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ date, time, latitude, longitude })
      });

      const json = await response.json();
      console.log(`📡 ${endpoint} cevabı:`, JSON.stringify(json));
      results[endpoint] = json;
    }

    res.json(results);
  } catch (err) {
    console.error("🚨 API çağrısı hatası:", err);
    res.status(500).json({ error: "API çağrısı başarısız", detay: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Sunucu çalışıyor:", PORT));
