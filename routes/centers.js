const express = require('express');
const { DB } = require('../models/database');

const router = express.Router();

router.get('/', (req, res) => {
  const centers = DB.findAll('collectionCenters');
  res.json({ success: true, data: centers });
});

router.get('/:id', (req, res) => {
  const center = DB.findById('collectionCenters', req.params.id);
  if (!center) {
    return res.status(404).json({ success: false, message: 'Collection center not found.' });
  }
  res.json({ success: true, data: center });
});

module.exports = router;
