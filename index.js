const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const apiKey = "1ecRB9EIVs01sIcfu59WwJaGboIVO8WtgQxYDpIM"; // .env kullanmıyorsan

// 🌙 AY BURCU
app.post("/prokerala", async (req, res) => {
  const { date, time, latitude, longitude } = req.body;

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
});

// 🪐 GEZEGENLERİN KONUMU
app.post("/gezegenler", async (req, res) => {
  const { date, time, latitude, longitude } = req.body;

  const response = await fetch("https://api.prokerala.com/v2/astrology/planet-positions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ date, time, latitude, longitude })
  });

  const data = await response.json();
  res.json(data);
});

// 🏠 EV KONUMU
app.post("/evler", async (req, res) => {
  const { date, time, latitude, longitude } = req.body;

  const response = await fetch("https://api.prokerala.com/v2/astrology/house-positions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ date, time, latitude, longitude })
  });

  const data = await response.json();
  res.json(data);
});

// ♓️ YÜKSELEN BURÇ
app.post("/yukselen", async (req, res) => {
  const { date, time, latitude, longitude } = req.body;

  const response = await fetch("https://api.prokerala.com/v2/astrology/ascendant", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ date, time, latitude, longitude })
  });

  const data = await response.json();
  res.json(data);
});

// 🌌 TAM DOĞUM HARİTASI (Toplu)
app.post("/dogumharitasi", async (req, res) => {
  const { date, time, latitude, longitude } = req.body;

  try {
    const endpoints = [
      "moon-sign",
      "planet-positions",
      "house-positions",
      "ascendant"
    ];

    const results = {};

    for (const endpoint of endpoints) {
      const response = await fetch(`https://api.prokerala.com/v2/astrology/${endpoint}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ date, time, latitude, longitude })
      });

      results[endpoint] = await response.json();
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Toplu doğum haritası alınamadı", detay: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Sunucu aktif:", PORT));
