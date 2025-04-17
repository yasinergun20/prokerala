const fetch = require("node-fetch");

class Astrology {
  constructor({ clientId, clientSecret }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.token = null;
  }

  async authenticate() {
    const response = await fetch("https://api.prokerala.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret
      })
    });

    const data = await response.json();
    if (data.access_token) {
      this.token = data.access_token;
    } else {
      throw new Error("Token alınamadı: " + JSON.stringify(data));
    }
  }

  async fetchData(endpoint, payload) {
    if (!this.token) {
      await this.authenticate();
    }

    const url = `https://api.prokerala.com/v2/astrology/${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const contentType = response.headers.get("content-type");
    if (contentType.includes("application/json")) {
      return await response.json();
    } else {
      const html = await response.text();
      throw new Error(`❌ ${endpoint} HTML döndü:\n${html.substring(0, 200)}`);
    }
  }

  getMoonSign(payload) {
    return this.fetchData("moon-sign", payload);
  }

  getAscendant(payload) {
    return this.fetchData("ascendant", payload);
  }

  getPlanetPositions(payload) {
    return this.fetchData("planet-positions", payload);
  }

  getHousePositions(payload) {
    return this.fetchData("house-positions", payload);
  }
}

module.exports = {
  Astrology
};
