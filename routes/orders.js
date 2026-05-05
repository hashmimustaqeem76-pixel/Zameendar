const express = require('express');
const { DB } = require('../models/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

const VALID_STATUSES = ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'];

/**
 * GET /api/orders
 * Get orders for current user (buyer sees their purchases, farmer sees their sales)
 * Query params: status, page, limit
 */
router.get('/', authenticate, (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const user = req.user;

  let orders;
  if (user.role === 'farmer') {
    orders = DB.query('orders', o => o.farmerId === user.id);
  } else if (user.role === 'admin') {
    orders = DB.findAll('orders');
  } else {
    orders = DB.query('orders', o => o.buyerId === user.id);
  }

  if (status) {
    orders = orders.filter(o => o.status === status);
  }

  // Sort newest first
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Compute summary stats
  const thisMonthSales = orders
    .filter(o => {
      const d = new Date(o.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'in_transit'].includes(o.status)).length;

  const result = DB.paginate(orders, page, limit);
  res.json({
    success: true,
    summary: { thisMonthSales, activeOrders },
    ...result
  });
});

/**
 * GET /api/orders/:id
 * Get single order detail
 */
router.get('/:id', authenticate, (req, res) => {
  const order = DB.findById('orders', req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

  const canView = order.buyerId === req.user.id ||
                  order.farmerId === req.user.id ||
                  req.user.role === 'admin';
  if (!canView) return res.status(403).json({ success: false, message: 'Access denied.' });

  res.json({ success: true, data: order });
});

/**
 * POST /api/orders
 * Retailer places a new order
 */
router.post('/', authenticate, requireRole('retailer', 'admin'), (req, res) => {
  const { cropId, qtyKg, deliveryAddress, collectionCenterId, scheduledDelivery } = req.body;

  if (!cropId || !qtyKg || !deliveryAddress) {
    return res.status(400).json({ success: false, message: 'cropId, qtyKg, and deliveryAddress are required.' });
  }

  const crop = DB.findById('crops', cropId);
  if (!crop) return res.status(404).json({ success: false, message: 'Crop not found.' });
  if (!crop.isAvailable) return res.status(400).json({ success: false, message: 'This crop is no longer available.' });
  if (parseFloat(qtyKg) < crop.minOrderKg) {
    return res.status(400).json({ success: false, message: `Minimum order is ${crop.minOrderKg} kg.` });
  }
  if (parseFloat(qtyKg) > crop.availableQtyKg) {
    return res.status(400).json({ success: false, message: `Only ${crop.availableQtyKg} kg available.` });
  }

  const totalAmount = parseFloat(qtyKg) * crop.pricePerKg;

  const order = DB.insert('orders', {
    buyerId: req.user.id,
    buyerName: req.user.name,
    farmerId: crop.farmerId,
    cropId,
    cropName: crop.name,
    emoji: crop.emoji,
    qtyKg: parseFloat(qtyKg),
    pricePerKg: crop.pricePerKg,
    totalAmount,
    status: 'pending',
    deliveryAddress,
    collectionCenterId: collectionCenterId || null,
    scheduledDelivery: scheduledDelivery || null,
    updatedAt: new Date().toISOString()
  });

  // Reduce available stock
  DB.update('crops', cropId, {
    availableQtyKg: crop.availableQtyKg - parseFloat(qtyKg)
  });

  res.status(201).json({
    success: true,
    message: 'Order placed successfully.',
    data: order
  });
});

/**
 * PUT /api/orders/:id/status
 * Update order status (farmer confirms/ships, admin can set any)
 * Body: { status: 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' }
 */
router.put('/:id/status', authenticate, (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, message: `Status must be one of: ${VALID_STATUSES.join(', ')}.` });
  }

  const order = DB.findById('orders', req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

  // Permission: farmer can confirm/ship their orders; buyer can cancel pending; admin can do anything
  const isFarmer = req.user.id === order.farmerId;
  const isBuyer  = req.user.id === order.buyerId;
  const isAdmin  = req.user.role === 'admin';

  const allowed =
    isAdmin ||
    (isFarmer && ['confirmed', 'in_transit', 'delivered'].includes(status)) ||
    (isBuyer  && status === 'cancelled' && order.status === 'pending');

  if (!allowed) {
    return res.status(403).json({ success: false, message: 'You are not allowed to perform this status transition.' });
  }

  const updated = DB.update('orders', req.params.id, { status });
  res.json({ success: true, message: `Order status updated to "${status}".`, data: updated });
});

/**
 * GET /api/orders/stats/summary
 * Platform-wide stats (admin only)
 */
router.get('/stats/summary', authenticate, requireRole('admin'), (req, res) => {
  const orders = DB.findAll('orders');
  const revenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0);

  res.json({
    success: true,
    data: {
      totalOrders: orders.length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      inTransit: orders.filter(o => o.status === 'in_transit').length,
      pending: orders.filter(o => o.status === 'pending').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: revenue
    }
  });
});

module.exports = router;
