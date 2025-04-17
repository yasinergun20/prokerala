const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/ayburcu", async (req, res) => {
  const { date, time, latitude, longitude } = req.body;

  try {
    const response = await fetch("https://api.prokerala.com/v2/astrology/moon-sign", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PROKERALA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ date, time, latitude, longitude })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Hesaplama başarısız", detay: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Sunucu ayakta:", PORT));
