const express = require('express');
const { DB } = require('../models/database');

const router = express.Router();

router.get('/', (req, res) => {
  const prices = DB.findAll('prices');
  res.json({ success: true, data: prices });
});

module.exports = router;
