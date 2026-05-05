const express = require('express');
const multer = require('multer');
const path = require('path');
const { DB, db } = require('../models/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ─── FILE UPLOAD CONFIG ───────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `crop_scan_${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, HEIC, WEBP images are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024 }
});

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/**
 * Stub AI disease classifier.
 * In production: send image to a vision model (e.g. GPT-4o, Gemini Vision,
 * or a fine-tuned plant disease model) and parse the response.
 * Returns a disease key from the db.diseases object.
 */
const classifyDisease = async (imagePath, cropHint) => {
  // Simulate processing delay
  await new Promise(r => setTimeout(r, 500));

  if (cropHint && db.diseases[cropHint.toLowerCase()]) {
    return cropHint.toLowerCase();
  }

  // Random fallback for demo
  const keys = Object.keys(db.diseases);
  return keys[Math.floor(Math.random() * keys.length)];
};

// ─── ROUTES ──────────────────────────────────────────────────────────────────

/**
 * GET /api/disease/crops
 * List supported crops for disease scanning
 */
router.get('/crops', (req, res) => {
  const crops = Object.keys(db.diseases).map(key => ({
    key,
    name: db.diseases[key].crop,
    emoji: db.diseases[key].emoji
  }));
  res.json({ success: true, data: crops });
});

/**
 * GET /api/disease/info/:cropKey
 * Get disease info for a specific crop (quick-select / demo mode)
 */
router.get('/info/:cropKey', (req, res) => {
  const cropKey = req.params.cropKey.toLowerCase();
  const info = db.diseases[cropKey];
  if (!info) {
    return res.status(404).json({ success: false, message: `No disease data for crop: ${cropKey}. Try: ${Object.keys(db.diseases).join(', ')}.` });
  }
  res.json({ success: true, data: info });
});

/**
 * POST /api/disease/scan
 * Upload a crop image for AI disease detection
 * Optionally provide cropHint in form data to improve accuracy
 * Optionally protect with authenticate middleware — left open for easy demo
 */
router.post('/scan', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a crop image.' });
    }

    const cropHint = req.body.cropHint || null;

    // Classify
    const diseaseKey = await classifyDisease(req.file.path, cropHint);
    const diseaseInfo = db.diseases[diseaseKey];

    // Log scan (could store in DB for history)
    const scanRecord = {
      id: `scan-${Date.now()}`,
      userId: req.user?.id || 'anonymous',
      imagePath: req.file.path,
      cropHint,
      detectedDisease: diseaseKey,
      scannedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Disease scan complete.',
      data: {
        ...diseaseInfo,
        scanId: scanRecord.id,
        scannedAt: scanRecord.scannedAt,
        note: process.env.NODE_ENV === 'development'
          ? 'This is a demo response. Integrate a real vision AI model for production.'
          : undefined
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Scan failed.', error: err.message });
  }
});

/**
 * POST /api/disease/scan/demo
 * Demo scan without image upload — just pass cropKey in body
 * { cropKey: 'tomato' }
 */
router.post('/scan/demo', (req, res) => {
  const { cropKey } = req.body;

  if (!cropKey) {
    return res.status(400).json({ success: false, message: 'cropKey is required. E.g. { "cropKey": "tomato" }' });
  }

  const key = cropKey.toLowerCase();
  const info = db.diseases[key];
  if (!info) {
    return res.status(404).json({
      success: false,
      message: `Unknown crop: ${cropKey}. Supported: ${Object.keys(db.diseases).join(', ')}.`
    });
  }

  res.json({
    success: true,
    message: 'Demo scan complete.',
    data: {
      ...info,
      scanId: `demo-${Date.now()}`,
      scannedAt: new Date().toISOString()
    }
  });
});

module.exports = router;
