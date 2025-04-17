const express = require("express");
const { Astrology } = require("@prokerala/astrology");

const app = express();
app.use(express.json());

// 🚨 BURAYA kendi Prokerala bilgilerini yaz
const astrology = new Astrology({
  clientId: "9e6d5d64-59ed-445c-bf95-f2896343a1efZ",
  clientSecret: "1ecRB9EIVs01sIcfu59WwJaGboIVO8WtgQxYDpIM",
});

// 🌌 Doğum Haritası
app.post("/dogumharitasi", async (req, res) => {
  const { date, time, latitude, longitude } = req.body;

  console.log("📥 İstek alındı:", date, time, latitude, longitude);

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
    console.error("❌ API HATASI:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
});
