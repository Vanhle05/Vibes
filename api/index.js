const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok from bare api/index.js' });
});

module.exports = app;
