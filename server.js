const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { predictFit } = require('./fit-ml-engine');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client')));

app.post('/predict-fit', (req, res) => {
  try {
    const { body, garment } = req.body;
    if (!body || !garment) {
      return res.status(400).json({ error: 'Missing body or garment data' });
    }
    const prediction = predictFit(body, garment);
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});