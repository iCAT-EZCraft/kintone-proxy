// server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const KINTONE_DOMAIN = process.env.KINTONE_DOMAIN;
const KINTONE_API_TOKEN = process.env.KINTONE_API_TOKEN;

// ヘッダー共通
const headers = {
  "X-Cybozu-API-Token": KINTONE_API_TOKEN,
  "Content-Type": "application/json"
};

//  レコード取得
app.post("/get-records", async (req, res) => {
  const { appId, query } = req.body;

  try {
    const url = `https://${KINTONE_DOMAIN}/k/v1/records.json?app=${appId}` + (query ? `&query=${encodeURIComponent(query)}` : "");
    const response = await fetch(url, {
      method: "GET",
      headers: headers
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("get-records error:", error);
    res.status(500).json({ error: "Failed to get records" });
  }
});

//  レコード追加
app.post("/add-record", async (req, res) => {
  const { appId, record } = req.body;

  try {
    const url = `https://${KINTONE_DOMAIN}/k/v1/record.json`;
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        app: appId,
        record: record
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("add-record error:", error);
    res.status(500).json({ error: "Failed to add record" });
  }
});

//  レコード更新
app.post("/update-record", async (req, res) => {
  const { appId, recordId, record } = req.body;

  try {
    const url = `https://${KINTONE_DOMAIN}/k/v1/record.json`;
    const response = await fetch(url, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        app: appId,
        id: recordId,
        record: record
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("update-record error:", error);
    res.status(500).json({ error: "Failed to update record" });
  }
});

//  レコード削除
app.post("/delete-record", async (req, res) => {
  const { appId, ids } = req.body;

  try {
    const url = `https://${KINTONE_DOMAIN}/k/v1/records.json`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: headers,
      body: JSON.stringify({
        app: appId,
        ids: ids // 配列 [1, 2, 3]
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("delete-record error:", error);
    res.status(500).json({ error: "Failed to delete records" });
  }
});

//  起動
app.listen(PORT, () => {
  console.log(`Kintone proxy server running on port ${PORT}`);
});
