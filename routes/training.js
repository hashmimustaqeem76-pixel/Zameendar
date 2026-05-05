const express = require('express');
const { DB } = require('../models/database');

const router = express.Router();

router.get('/', (req, res) => {
  const modules = DB.findAll('trainingModules');
  res.json({ success: true, data: modules });
});

router.get('/:id', (req, res) => {
  const module = DB.findById('trainingModules', req.params.id);
  if (!module) {
    return res.status(404).json({ success: false, message: 'Training module not found.' });
  }
  res.json({ success: true, data: module });
});

module.exports = router;
