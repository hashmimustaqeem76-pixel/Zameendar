const express = require('express');
const { DB } = require('../models/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/crops
 * Browse all available crops with optional filtering + pagination
 * Query params: category, search, badge, farmerId, page, limit
 */
router.get('/', (req, res) => {
  const { category, search, badge, farmerId, page = 1, limit = 20 } = req.query;

  let crops = DB.query('crops', c => c.isAvailable);

  if (category) {
    crops = crops.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }
  if (badge) {
    crops = crops.filter(c => c.badge.toLowerCase() === badge.toLowerCase());
  }
  if (farmerId) {
    crops = crops.filter(c => c.farmerId === farmerId);
  }
  if (search) {
    const q = search.toLowerCase();
    crops = crops.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.farmerName.toLowerCase().includes(q) ||
      c.farmerDistrict.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }

  const result = DB.paginate(crops, page, limit);
  res.json({ success: true, ...result });
});

/**
 * GET /api/crops/categories
 * List all distinct categories
 */
router.get('/categories', (req, res) => {
  const all = DB.findAll('crops');
  const categories = [...new Set(all.map(c => c.category))];
  res.json({ success: true, data: categories });
});

/**
 * GET /api/crops/:id
 * Get single crop detail
 */
router.get('/:id', (req, res) => {
  const crop = DB.findById('crops', req.params.id);
  if (!crop) return res.status(404).json({ success: false, message: 'Crop not found.' });

  // Attach farmer info (sans password)
  const farmer = DB.findById('users', crop.farmerId);
  const { passwordHash, ...farmerInfo } = farmer || {};

  res.json({ success: true, data: { ...crop, farmer: farmerInfo } });
});

/**
 * POST /api/crops
 * Farmer posts a new crop listing
 */
router.post('/', authenticate, requireRole('farmer'), (req, res) => {
  const {
    name, emoji, category, badge,
    pricePerKg, originalPricePerKg,
    availableQtyKg, minOrderKg,
    bgColor, harvestDate
  } = req.body;

  if (!name || !category || !pricePerKg || !availableQtyKg) {
    return res.status(400).json({ success: false, message: 'name, category, pricePerKg, and availableQtyKg are required.' });
  }

  const crop = DB.insert('crops', {
    farmerId: req.user.id,
    farmerName: req.user.name,
    farmerDistrict: req.user.district,
    name,
    emoji: emoji || '🌱',
    category,
    badge: badge || 'Fresh',
    pricePerKg: parseFloat(pricePerKg),
    originalPricePerKg: parseFloat(originalPricePerKg || pricePerKg),
    availableQtyKg: parseFloat(availableQtyKg),
    minOrderKg: parseFloat(minOrderKg || 1),
    bgColor: bgColor || '#E8F5E9',
    isAvailable: true,
    harvestDate: harvestDate || new Date().toISOString().split('T')[0]
  });

  res.status(201).json({ success: true, message: 'Crop listed successfully.', data: crop });
});

/**
 * PUT /api/crops/:id
 * Farmer updates their crop listing
 */
router.put('/:id', authenticate, requireRole('farmer'), (req, res) => {
  const crop = DB.findById('crops', req.params.id);
  if (!crop) return res.status(404).json({ success: false, message: 'Crop not found.' });
  if (crop.farmerId !== req.user.id) return res.status(403).json({ success: false, message: 'Not your listing.' });

  const allowedUpdates = ['pricePerKg', 'availableQtyKg', 'badge', 'isAvailable', 'minOrderKg'];
  const updates = {};
  allowedUpdates.forEach(key => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const updated = DB.update('crops', req.params.id, updates);
  res.json({ success: true, message: 'Crop updated.', data: updated });
});

/**
 * DELETE /api/crops/:id
 * Farmer removes a crop listing
 */
router.delete('/:id', authenticate, requireRole('farmer'), (req, res) => {
  const crop = DB.findById('crops', req.params.id);
  if (!crop) return res.status(404).json({ success: false, message: 'Crop not found.' });
  if (crop.farmerId !== req.user.id) return res.status(403).json({ success: false, message: 'Not your listing.' });

  DB.delete('crops', req.params.id);
  res.json({ success: true, message: 'Listing removed.' });
});

module.exports = router;
