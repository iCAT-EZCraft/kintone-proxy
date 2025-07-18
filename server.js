require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

const KINTONE_DOMAIN = process.env.KINTONE_DOMAIN;
const API_TOKEN = process.env.KINTONE_API_TOKEN;

app.use(cors());
app.use(express.json());

app.get("/get-records", async (req, res) => {
  try {
    const appId = req.query.app || "183"; // デフォルトは183

    const response = await fetch(
      `https://${KINTONE_DOMAIN}/k/v1/records.json?app=${appId}`,
      {
        method: "GET",
        headers: {
          "X-Cybozu-API-Token": API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Kintone APIエラー:", errorText);
      return res.status(500).send("Kintone APIからの応答エラー: " + errorText);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("サーバーエラー:", err);
    res.status(500).send("サーバー内でエラーが発生しました");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
