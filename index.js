const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const apiKey = "BURAYA_API_KEYİN"; // .env kullanmıyorsan

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
    res.status(500).json({ error: "API çağrısı başarısız", detay: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Sunucu çalışıyor:", PORT));
