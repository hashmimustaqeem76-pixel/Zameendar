const express = require('express');
const { authenticate } = require('../middleware/auth');
const { DB } = require('../models/database');

const router = express.Router();

router.get('/', authenticate, (req, res) => {
  const user = req.user;
  const orders = user.role === 'farmer'
    ? DB.query('orders', o => o.farmerId === user.id)
    : user.role === 'retailer'
      ? DB.query('orders', o => o.buyerId === user.id)
      : DB.findAll('orders');

  const crops = user.role === 'farmer'
    ? DB.query('crops', c => c.farmerId === user.id)
    : DB.findAll('crops');

  const summary = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    confirmedOrders: orders.filter(o => o.status === 'confirmed').length,
    inTransitOrders: orders.filter(o => o.status === 'in_transit').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
    totalListings: crops.length,
    totalRevenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0)
  };

  if (user.role === 'retailer') {
    summary.totalSpend = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }

  if (user.role === 'farmer') {
    summary.totalSales = summary.totalRevenue;
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        district: user.district
      },
      summary
    }
  });
});

module.exports = router;
