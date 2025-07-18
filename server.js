const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// POST: /update-kintone
app.post('/update-kintone', async (req, res) => {
  const { recordId, recordData } = req.body;

  const url = `${process.env.KINTONE_DOMAIN}/k/v1/record.json`;

  const payload = {
    app: process.env.KINTONE_APP_ID,
    id: recordId,
    record: recordData
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Cybozu-API-Token': process.env.KINTONE_API_TOKEN
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Kintone API Error:', result);
      return res.status(response.status).json(result);
    }

    res.status(200).json({ message: 'Kintone更新成功', result });
  } catch (error) {
    console.error('中継サーバー エラー:', error);
    res.status(500).json({ message: '中継サーバーエラー', error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`中継サーバーが起動中 http://localhost:${PORT}`);
});

// GET: /ping
app.get('/ping', (req, res) => {
  res.json({ message: '中継サーバーは稼働中です' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'GETリクエスト成功', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});

