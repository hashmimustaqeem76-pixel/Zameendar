const express = require('express');
const { DB } = require('../models/database');

const router = express.Router();

router.get('/', (req, res) => {
  const reviews = DB.findAll('reviews');
  res.json({ success: true, data: reviews });
});

router.get('/recent', (req, res) => {
  const reviews = DB.findAll('reviews').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, data: reviews.slice(0, 5) });
});

module.exports = router;
