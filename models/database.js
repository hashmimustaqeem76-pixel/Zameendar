/**
 * ZameenDar — In-Memory Database
 * --------------------------------
 * Pure in-memory store for MVP. Replace with SQLite / PostgreSQL in production
 * by swapping out the CRUD helpers below with your ORM calls.
 */

const { v4: uuidv4 } = require('uuid');

// ─── SEED DATA ────────────────────────────────────────────────────────────────

const db = {

  users: [
    {
      id: 'u-001',
      name: 'Ali Raza',
      phone: '+923001234567',
      role: 'farmer', // farmer | retailer | admin
      district: 'Sahiwal',
      verified: true,
      passwordHash: '$2a$10$dummyhashfarmer001',
      createdAt: '2024-01-15T08:00:00Z',
      stats: { totalSales: 245600, totalOrders: 87, rating: 4.9 }
    },
    {
      id: 'u-002',
      name: 'Kasuri Brothers',
      phone: '+923009876543',
      role: 'farmer',
      district: 'Okara',
      verified: true,
      passwordHash: '$2a$10$dummyhashfarmer002',
      createdAt: '2024-02-10T09:00:00Z',
      stats: { totalSales: 189000, totalOrders: 62, rating: 4.7 }
    },
    {
      id: 'u-003',
      name: 'Sana Khan',
      phone: '+923331234567',
      role: 'retailer',
      district: 'Lahore',
      verified: true,
      passwordHash: '$2a$10$dummyhashretailer001',
      createdAt: '2024-01-20T10:00:00Z',
      stats: { totalPurchases: 320000, totalOrders: 124, rating: 4.8 }
    },
    {
      id: 'u-004',
      name: 'Raja General Store',
      phone: '+923214567890',
      role: 'retailer',
      district: 'Lahore',
      verified: true,
      passwordHash: '$2a$10$dummyhashretailer002',
      createdAt: '2024-03-01T11:00:00Z',
      stats: { totalPurchases: 178000, totalOrders: 68, rating: 4.6 }
    }
  ],

  crops: [
    {
      id: 'c-001',
      farmerId: 'u-001',
      farmerName: 'Ali Raza Farm',
      farmerDistrict: 'Sahiwal',
      name: 'Farm Tomatoes',
      emoji: '🍅',
      category: 'vegetable',
      badge: 'Fresh',
      pricePerKg: 45,
      originalPricePerKg: 70,
      availableQtyKg: 500,
      minOrderKg: 10,
      bgColor: '#FFF3E0',
      isAvailable: true,
      harvestDate: '2025-04-28',
      createdAt: '2025-04-28T06:00:00Z'
    },
    {
      id: 'c-002',
      farmerId: 'u-002',
      farmerName: 'Kasuri Brothers',
      farmerDistrict: 'Okara',
      name: 'Premium Onion',
      emoji: '🧅',
      category: 'vegetable',
      badge: 'Organic',
      pricePerKg: 38,
      originalPricePerKg: 55,
      availableQtyKg: 1200,
      minOrderKg: 20,
      bgColor: '#F3E5F5',
      isAvailable: true,
      harvestDate: '2025-04-20',
      createdAt: '2025-04-20T07:00:00Z'
    },
    {
      id: 'c-003',
      farmerId: 'u-001',
      farmerName: 'Bhutta Farm',
      farmerDistrict: 'Faisalabad',
      name: 'White Potato',
      emoji: '🥔',
      category: 'vegetable',
      badge: 'Fresh',
      pricePerKg: 28,
      originalPricePerKg: 40,
      availableQtyKg: 2000,
      minOrderKg: 50,
      bgColor: '#E8F5E9',
      isAvailable: true,
      harvestDate: '2025-04-15',
      createdAt: '2025-04-15T05:00:00Z'
    },
    {
      id: 'c-004',
      farmerId: 'u-002',
      farmerName: 'Mirpurkhas Orchards',
      farmerDistrict: 'Mirpurkhas',
      name: 'Sindhri Mango',
      emoji: '🥭',
      category: 'fruit',
      badge: 'Organic',
      pricePerKg: 120,
      originalPricePerKg: 180,
      availableQtyKg: 800,
      minOrderKg: 20,
      bgColor: '#FFF9C4',
      isAvailable: true,
      harvestDate: '2025-05-01',
      createdAt: '2025-05-01T08:00:00Z'
    },
    {
      id: 'c-005',
      farmerId: 'u-001',
      farmerName: 'Sheikh Farms',
      farmerDistrict: 'Multan',
      name: 'Wheat (40kg bag)',
      emoji: '🌾',
      category: 'grain',
      badge: 'New',
      pricePerKg: 80, // 3200 / 40
      originalPricePerKg: 95,
      availableQtyKg: 8000,
      minOrderKg: 40,
      bgColor: '#E3F2FD',
      isAvailable: true,
      harvestDate: '2025-04-10',
      createdAt: '2025-04-10T06:00:00Z'
    },
    {
      id: 'c-006',
      farmerId: 'u-002',
      farmerName: 'Swat Valley Farms',
      farmerDistrict: 'Swat',
      name: 'Kala Kulu Apple',
      emoji: '🍎',
      category: 'fruit',
      badge: 'Fresh',
      pricePerKg: 180,
      originalPricePerKg: 250,
      availableQtyKg: 300,
      minOrderKg: 10,
      bgColor: '#FCE4EC',
      isAvailable: true,
      harvestDate: '2025-05-02',
      createdAt: '2025-05-02T09:00:00Z'
    },
    {
      id: 'c-007',
      farmerId: 'u-001',
      farmerName: 'Basmati Rice Farms',
      farmerDistrict: 'Sheikhupura',
      name: 'Basmati Rice (40kg)',
      emoji: '🍚',
      category: 'grain',
      badge: 'Organic',
      pricePerKg: 120, // 4800 / 40
      originalPricePerKg: 145,
      availableQtyKg: 4000,
      minOrderKg: 40,
      bgColor: '#E8F5E9',
      isAvailable: true,
      harvestDate: '2025-03-25',
      createdAt: '2025-03-25T07:00:00Z'
    }
  ],

  orders: [
    {
      id: 'o-001',
      buyerId: 'u-004',
      buyerName: 'Raja General Store',
      farmerId: 'u-001',
      cropId: 'c-001',
      cropName: 'Tomatoes',
      emoji: '🍅',
      qtyKg: 50,
      pricePerKg: 45,
      totalAmount: 2250,
      status: 'in_transit',
      deliveryAddress: 'Shop 14, Hall Road, Lahore',
      collectionCenterId: 'cc-001',
      createdAt: '2025-05-04T14:30:00Z',
      updatedAt: '2025-05-04T16:00:00Z',
      scheduledDelivery: '2025-05-05T10:00:00Z'
    },
    {
      id: 'o-002',
      buyerId: 'u-003',
      buyerName: 'City Mart',
      farmerId: 'u-002',
      cropId: 'c-002',
      cropName: 'Onions',
      emoji: '🧅',
      qtyKg: 100,
      pricePerKg: 38,
      totalAmount: 3800,
      status: 'delivered',
      deliveryAddress: '45 Susan Road, Faisalabad',
      collectionCenterId: 'cc-002',
      createdAt: '2025-05-04T10:00:00Z',
      updatedAt: '2025-05-04T14:00:00Z',
      scheduledDelivery: '2025-05-04T14:00:00Z'
    },
    {
      id: 'o-003',
      buyerId: 'u-003',
      buyerName: 'Fresh Bazaar',
      farmerId: 'u-002',
      cropId: 'c-004',
      cropName: 'Mangoes',
      emoji: '🥭',
      qtyKg: 200,
      pricePerKg: 120,
      totalAmount: 24000,
      status: 'delivered',
      deliveryAddress: 'Bahadurabad, Karachi',
      collectionCenterId: 'cc-003',
      createdAt: '2025-05-03T09:00:00Z',
      updatedAt: '2025-05-03T18:00:00Z',
      scheduledDelivery: '2025-05-03T18:00:00Z'
    },
    {
      id: 'o-004',
      buyerId: 'u-004',
      buyerName: 'Green Valley',
      farmerId: 'u-001',
      cropId: 'c-003',
      cropName: 'Potatoes',
      emoji: '🥔',
      qtyKg: 80,
      pricePerKg: 28,
      totalAmount: 2240,
      status: 'pending',
      deliveryAddress: 'Gulgasht Colony, Multan',
      collectionCenterId: 'cc-002',
      createdAt: '2025-05-04T18:00:00Z',
      updatedAt: '2025-05-04T18:00:00Z',
      scheduledDelivery: '2025-05-05T08:00:00Z'
    },
    {
      id: 'o-005',
      buyerId: 'u-003',
      buyerName: 'Al-Barkat Mill',
      farmerId: 'u-001',
      cropId: 'c-005',
      cropName: 'Wheat',
      emoji: '🌾',
      qtyKg: 200,
      pricePerKg: 80,
      totalAmount: 16000,
      status: 'pending',
      deliveryAddress: 'Industrial Area, Multan',
      collectionCenterId: 'cc-002',
      createdAt: '2025-05-03T12:00:00Z',
      updatedAt: '2025-05-03T12:00:00Z',
      scheduledDelivery: '2025-05-05T10:00:00Z'
    }
  ],

  prices: [
    { id: 'p-001', cropName: 'Tomato', pricePerKg: 45, change: 2.3, unit: 'kg', updatedAt: new Date().toISOString() },
    { id: 'p-002', cropName: 'Onion',  pricePerKg: 38, change: -1.1, unit: 'kg', updatedAt: new Date().toISOString() },
    { id: 'p-003', cropName: 'Potato', pricePerKg: 28, change: 0.5, unit: 'kg', updatedAt: new Date().toISOString() },
    { id: 'p-004', cropName: 'Mango',  pricePerKg: 120, change: 4.2, unit: 'kg', updatedAt: new Date().toISOString() },
    { id: 'p-005', cropName: 'Wheat',  pricePerKg: 80, change: -0.8, unit: '40kg bag', displayPrice: 3200, updatedAt: new Date().toISOString() },
    { id: 'p-006', cropName: 'Rice (Basmati)', pricePerKg: 120, change: 1.5, unit: '40kg bag', displayPrice: 4800, updatedAt: new Date().toISOString() }
  ],

  collectionCenters: [
    {
      id: 'cc-001',
      name: 'Sahiwal Central Hub',
      district: 'Sahiwal',
      address: 'Near Sahiwal Bus Stand, Sahiwal',
      lat: 30.6680,
      lng: 73.1064,
      status: 'open',
      closingTime: null,
      phone: '+924038000001',
      capacity: 5000
    },
    {
      id: 'cc-002',
      name: 'Okara Agri Point',
      district: 'Okara',
      address: 'Main GT Road, Okara',
      lat: 30.8100,
      lng: 73.4500,
      status: 'closing_soon',
      closingTime: '18:00',
      phone: '+924428000002',
      capacity: 3000
    },
    {
      id: 'cc-003',
      name: 'Faisalabad Grain Center',
      district: 'Faisalabad',
      address: 'D-Ground, Faisalabad',
      lat: 31.4188,
      lng: 73.0791,
      status: 'open_24h',
      closingTime: null,
      phone: '+924198000003',
      capacity: 10000
    },
    {
      id: 'cc-004',
      name: 'Multan Agri Hub',
      district: 'Multan',
      address: 'New Multan, Multan',
      lat: 30.1575,
      lng: 71.5249,
      status: 'open',
      closingTime: '20:00',
      phone: '+926198000004',
      capacity: 6000
    }
  ],

  reviews: [
    {
      id: 'r-001',
      userId: 'u-001',
      userName: 'Ahmad Mehmood',
      userInitials: 'AM',
      avatarColor: '#2E7D32',
      role: 'Farmer · Sahiwal',
      stars: 5,
      text: 'ZameenDar ne meri zindagi badal di! Pehle middlemen se Rs.25/kg milte thay, ab seedha Rs.45/kg mil raha hai.',
      verified: true,
      verifiedLabel: 'Verified Farmer',
      createdAt: '2025-03-15T10:00:00Z'
    },
    {
      id: 'r-002',
      userId: 'u-003',
      userName: 'Sana Khan',
      userInitials: 'SK',
      avatarColor: '#1565C0',
      role: 'Grocery Owner · Lahore',
      stars: 5,
      text: 'Fresh vegetables direct from farm, delivery on time, prices are 20% lower than wholesale market.',
      verified: true,
      verifiedLabel: 'Verified Retailer',
      createdAt: '2025-04-01T09:00:00Z'
    },
    {
      id: 'r-003',
      userId: 'u-004',
      userName: 'Fatima Iqbal',
      userInitials: 'FI',
      avatarColor: '#6A1B9A',
      role: 'Urban Consumer · Karachi',
      stars: 4,
      text: 'Finally I know exactly which farmer grew my vegetables. The transparency is amazing.',
      verified: true,
      verifiedLabel: 'Verified Buyer',
      createdAt: '2025-04-10T14:00:00Z'
    }
  ],

  diseases: {
    tomato: {
      id: 'dis-001',
      emoji: '🍅',
      crop: 'Tomato',
      name: 'Early Blight (Alternaria solani)',
      severity: 'High Risk',
      severityClass: 'sev-high',
      symptoms: ['Dark brown spots', 'Yellow halos on leaves', 'Stem lesions', 'Fruit rot at bottom'],
      treatments: [
        { icon: '💊', label: 'Fungicide (Chemical)', text: 'Apply Mancozeb 80% WP @ 2.5g/Liter water. Spray every 7-10 days.' },
        { icon: '🌿', label: 'Organic Treatment', text: 'Neem oil spray (3ml/L water) + Trichoderma viride application in soil.' },
        { icon: '🏥', label: 'Systemic Treatment', text: 'Iprodione 50% WP or Carbendazim 50% WP for severe infection. Apply 2-3 times at 10-day intervals.' }
      ],
      prevention: 'Rotate crops every season. Remove infected leaves immediately. Avoid overhead watering. Plant resistant varieties like Rio Grande or Pusa Hybrid.'
    },
    wheat: {
      id: 'dis-002',
      emoji: '🌾',
      crop: 'Wheat',
      name: 'Yellow Rust (Puccinia striiformis)',
      severity: 'High Risk',
      severityClass: 'sev-high',
      symptoms: ['Yellow-orange stripe pustules', 'Powdery yellow spores', 'Reduced grain size', 'Yellowing of leaves'],
      treatments: [
        { icon: '💊', label: 'Fungicide (Chemical)', text: 'Propiconazole 25% EC @ 0.5ml/L. Apply at first sign of disease.' },
        { icon: '💉', label: 'Systemic Fungicide', text: 'Tebuconazole 25.9% EW @ 1ml/L. Highly effective against rust diseases.' },
        { icon: '🌿', label: 'Preventive Spray', text: 'Sulfur 80% WP @ 2g/L as early preventive measure.' }
      ],
      prevention: 'Use resistant wheat varieties (NARC-2009, Punjab-2011). Timely sowing (Nov 1-15). Monitor crops weekly during Feb-March.'
    },
    potato: {
      id: 'dis-003',
      emoji: '🥔',
      crop: 'Potato',
      name: 'Late Blight (Phytophthora infestans)',
      severity: 'Very High Risk',
      severityClass: 'sev-high',
      symptoms: ['Dark water-soaked lesions', 'White mold under leaves', 'Brown rotten tubers', 'Rapid spread in wet weather'],
      treatments: [
        { icon: '💊', label: 'Immediate Action', text: 'Cymoxanil+Mancozeb (Curzate M) @ 2.5g/L. Apply within 24hrs of symptom detection.' },
        { icon: '💉', label: 'Systemic Treatment', text: 'Metalaxyl+Mancozeb (Ridomil Gold) @ 2.5g/L. Apply preventively in rainy season.' },
        { icon: '🌿', label: 'Organic Option', text: 'Copper hydroxide (Kocide) @ 2g/L. Apply every 5-7 days in humid conditions.' }
      ],
      prevention: 'Plant certified disease-free seed. Ensure good drainage. Destroy infected plants immediately.'
    },
    mango: {
      id: 'dis-004',
      emoji: '🥭',
      crop: 'Mango',
      name: 'Anthracnose (Colletotrichum gloeosporioides)',
      severity: 'Medium Risk',
      severityClass: 'sev-med',
      symptoms: ['Black spots on fruit skin', 'Flower blight', 'Twig dieback', 'Post-harvest fruit rot'],
      treatments: [
        { icon: '💊', label: 'Pre-harvest Spray', text: 'Carbendazim 50% WP @ 1g/L water. Spray at flowering and fruit set stage.' },
        { icon: '🏥', label: 'Post-harvest Treatment', text: 'Hot water treatment at 52°C for 5 minutes before storage.' },
        { icon: '🌿', label: 'Organic Control', text: 'Bordeaux mixture (1%) spray. Apply 3 times during flowering.' }
      ],
      prevention: 'Prune dead wood annually. Ensure good air circulation. Avoid wet conditions at harvest.'
    },
    cotton: {
      id: 'dis-005',
      emoji: '🌱',
      crop: 'Cotton',
      name: 'Cotton Leaf Curl Virus (CLCuV)',
      severity: 'Very High Risk',
      severityClass: 'sev-high',
      symptoms: ['Upward curling of leaves', 'Vein thickening', 'Stunted plant growth', 'Reduced boll size'],
      treatments: [
        { icon: '💊', label: 'Vector Control', text: 'Imidacloprid 70% WS (for whitefly control) @ 7g/kg seed.' },
        { icon: '💉', label: 'Foliar Spray', text: 'Thiamethoxam 25% WG @ 0.3g/L to control whitefly vector.' },
        { icon: '🌿', label: 'Biological Control', text: 'Release Encarsia formosa (whitefly parasite). Use yellow sticky traps.' }
      ],
      prevention: 'Plant virus-resistant varieties (NIAB-846, CIM-600). Control whitefly population. Avoid late planting.'
    },
    rice: {
      id: 'dis-006',
      emoji: '🍚',
      crop: 'Rice',
      name: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
      severity: 'Medium Risk',
      severityClass: 'sev-med',
      symptoms: ['Water-soaked yellow margins', 'Wilting at seedling stage', 'Milky ooze on lesions', 'Grain sterility'],
      treatments: [
        { icon: '💊', label: 'Copper Bactericide', text: 'Copper oxychloride 50% WP @ 3g/L. Most effective against bacterial diseases.' },
        { icon: '💉', label: 'Antibiotic Spray', text: 'Streptocycline (100ppm) + Copper oxychloride (0.3%). Apply at tillering stage.' },
        { icon: '🌿', label: 'Bio-agent', text: 'Pseudomonas fluorescens @ 5g/L as seed treatment + foliar spray.' }
      ],
      prevention: 'Use resistant varieties (IR-64, Basmati-2000). Balanced nitrogen fertilizer. Treat seeds with Agrimycin before sowing.'
    }
  },

  trainingModules: [
    {
      id: 'tm-001',
      icon: '📱',
      title: 'How to Use ZameenDar App',
      description: 'Complete guide for posting crops, setting prices, and getting orders from retailers.',
      tags: ['urdu', 'video', 'free'],
      durationMin: 25,
      language: 'Urdu',
      videoUrl: null
    },
    {
      id: 'tm-002',
      icon: '💰',
      title: 'Understanding Market Prices',
      description: 'Learn to read price charts and know the best time to sell your crops for maximum profit.',
      tags: ['urdu', 'free'],
      durationMin: 18,
      language: 'Urdu',
      videoUrl: null
    },
    {
      id: 'tm-003',
      icon: '🌿',
      title: 'Organic Farming Basics',
      description: 'How to grow organic crops to earn 30-50% more in premium markets.',
      tags: ['video', 'free'],
      durationMin: 35,
      language: 'English/Urdu',
      videoUrl: null
    },
    {
      id: 'tm-004',
      icon: '🔬',
      title: 'Crop Disease Prevention',
      description: 'Identify diseases early and apply correct treatments to protect your harvest.',
      tags: ['urdu', 'video', 'free'],
      durationMin: 40,
      language: 'Urdu',
      videoUrl: null
    },
    {
      id: 'tm-005',
      icon: '📦',
      title: 'Post-Harvest Storage',
      description: 'Reduce crop wastage with simple storage techniques and local collection center usage.',
      tags: ['free'],
      durationMin: 20,
      language: 'Urdu',
      videoUrl: null
    }
  ],

  // Simple token store (replace with Redis in production)
  tokens: {}
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const DB = {
  // Generic CRUD
  findAll: (table) => [...db[table]],
  findById: (table, id) => db[table].find(r => r.id === id) || null,
  insert: (table, record) => {
    const newRecord = { ...record, id: record.id || uuidv4(), createdAt: new Date().toISOString() };
    db[table].push(newRecord);
    return newRecord;
  },
  update: (table, id, updates) => {
    const idx = db[table].findIndex(r => r.id === id);
    if (idx === -1) return null;
    db[table][idx] = { ...db[table][idx], ...updates, updatedAt: new Date().toISOString() };
    return db[table][idx];
  },
  delete: (table, id) => {
    const idx = db[table].findIndex(r => r.id === id);
    if (idx === -1) return false;
    db[table].splice(idx, 1);
    return true;
  },
  query: (table, filterFn) => db[table].filter(filterFn),

  // Paginate
  paginate: (items, page = 1, limit = 20) => {
    const p = parseInt(page), l = Math.min(parseInt(limit), 100);
    const start = (p - 1) * l;
    return {
      data: items.slice(start, start + l),
      pagination: {
        total: items.length,
        page: p,
        limit: l,
        totalPages: Math.ceil(items.length / l)
      }
    };
  }
};

module.exports = { DB, db };
