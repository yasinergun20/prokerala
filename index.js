const express = require("express");
const { Astrology } = require("./astro-sdk"); // ← klasör adın neyse burası

const app = express();
app.use(express.json());

// 🔐 Prokerala giriş bilgilerin
const astrology = new Astrology({
  clientId: "BURAYA_CLIENT_ID",
  clientSecret: "BURAYA_CLIENT_SECRET"
});

app.post("/dogumharitasi", async (req, res) => {
  const { date, time, latitude, longitude } = req.body;

  try {
    const moonSign = await astrology.getMoonSign({
      date,
      time,
      coordinates: { latitude, longitude },
    });

    const ascendant = await astrology.getAscendant({
      date,
      time,
      coordinates: { latitude, longitude },
    });

    const planets = await astrology.getPlanetPositions({
      date,
      time,
      coordinates: { latitude, longitude },
    });

    const houses = await astrology.getHousePositions({
      date,
      time,
      coordinates: { latitude, longitude },
    });

    res.json({
      "moon-sign": moonSign.data,
      "ascendant": ascendant.data,
      "planet-positions": planets.data,
      "house-positions": houses.data,
    });
  } catch (err) {
    console.error("❌ HATA:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sunucu hazır: ${PORT}`));
