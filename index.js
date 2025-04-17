const express = require("express");
const { Astrology } = require("./astro-sdk"); // SDK'yi çağırıyoruz
const app = express();

app.use(express.json());

// 🔐 Prokerala kimlik bilgilerin
const astrology = new Astrology({
  clientId: "9e6d5d64-59ed-445c-bf95-f2896343a1ef",
  clientSecret: "1ecRB9EIVs01sIcfu59WwJaGboIVO8WtgQxYDpIM"
});

app.post("/dogumharitasi", async (req, res) => {
  const { date, time, latitude, longitude } = req.body;
  const coordinates = { latitude, longitude };

  try {
    console.log("📥 İstek alındı:", date, time, latitude, longitude);

    const [moon, asc, planets, houses] = await Promise.all([
      astrology.getMoonSign({ date, time, coordinates }),
      astrology.getAscendant({ date, time, coordinates }),
      astrology.getPlanetPositions({ date, time, coordinates }),
      astrology.getHousePositions({ date, time, coordinates })
    ]);

    res.json({
      "moon-sign": moon.data,
      "ascendant": asc.data,
      "planet-positions": planets.data,
      "house-positions": houses.data
    });
  } catch (err) {
    console.error("🚨 Hata:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sunucu çalışıyor: ${PORT}`));
