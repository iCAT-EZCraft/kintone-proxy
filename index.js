const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ここに自分の情報を入れる
const KINTONE_DOMAIN = "https://{サブドメイン}.cybozu.com";
const API_TOKEN = "{APIトークンをここに}";
const APP_ID = "{アプリIDをここに}";

app.get("/records", async (req, res) => {
  const url = `${KINTONE_DOMAIN}/k/v1/records.json?app=${APP_ID}`;
  try {
    const response = await fetch(url, {
      headers: {
        "X-Cybozu-API-Token": API_TOKEN,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
