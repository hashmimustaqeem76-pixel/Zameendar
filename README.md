# 🌾 ZameenDar Backend API

**Pakistan's Farm-to-Table Platform** — connecting small farmers directly with buyers, removing middlemen, and delivering fair prices.

---

## 🚀 Quick Start

```bash
# Install backend dependencies
npm install

# Install client dependencies
cd client && npm install

# Copy env config
cp .env.example .env

# Start the server
npm start          # production
npm run dev        # backend development (auto-reload)

# Start the client separately in development
cd client && npm run dev
```

Server starts at → **http://localhost:3000**

Client starts at → **http://localhost:5173**

---

## 🏗️ Architecture

```
zameen_dar_backend/
├── server.js               # Express app entry point
├── middleware/
│   └── auth.js             # JWT authentication & role guards
├── models/
│   └── database.js         # In-memory DB + seed data + CRUD helpers
├── routes/
│   ├── auth.js             # Register / Login / Profile
│   ├── crops.js            # Marketplace listings (CRUD)
│   ├── orders.js           # Order management
│   ├── prices.js           # Live price ticker
│   ├── disease.js          # AI crop disease scanner
│   ├── centers.js          # Collection centers
│   ├── reviews.js          # Customer reviews
│   ├── training.js         # Farmer training modules
│   └── dashboard.js        # Role-based dashboard stats
├── uploads/                # Uploaded crop scan images
├── .env.example
├── .gitignore
└── package.json
```

---

## 🔐 Authentication

All protected routes require a **Bearer JWT token** in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

### Roles
| Role       | Capabilities                                        |
|------------|-----------------------------------------------------|
| `farmer`   | Post/edit/delete crop listings, confirm orders      |
| `retailer` | Browse market, place orders, cancel pending orders  |
| `admin`    | Full access to all resources                        |

---

## 📋 Demo Accounts

| Phone           | Role     | Name            |
|-----------------|----------|-----------------|
| +923001234567   | Farmer   | Ali Raza        |
| +923009876543   | Farmer   | Kasuri Brothers |
| +923331234567   | Retailer | Sana Khan       |
| +923214567890   | Retailer | Raja General Store |

> Password: any string works for demo accounts

---

## 📡 API Reference

### Base URL
`http://localhost:3000/api`

---

### Auth

#### `POST /auth/register`
Register a new farmer or retailer.

> Client UI: open `http://localhost:3000/client/` after starting the server.
```json
{
  "name": "Malik Farms",
  "phone": "+923001112222",
  "password": "secure123",
  "role": "farmer",
  "district": "Lahore"
}
```

#### `POST /auth/login`
```json
{ "phone": "+923001234567", "password": "any" }
```
**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "u-001", "name": "Ali Raza", "role": "farmer", ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### `GET /auth/me` 🔒
Get current user profile.

#### `PUT /auth/me` 🔒
Update name / district.

---

### Crops (Marketplace)

#### `GET /crops`
Browse all available crops.

Query params:
- `category` — vegetable | fruit | grain | pulse
- `search` — full-text search
- `badge` — Fresh | Organic | New
- `farmerId` — filter by farmer
- `page`, `limit` — pagination

#### `GET /crops/:id`
Get crop detail including farmer info.

#### `POST /crops` 🔒 (farmer)
List a new crop for sale.
```json
{
  "name": "Fresh Spinach",
  "emoji": "🥬",
  "category": "vegetable",
  "badge": "Organic",
  "pricePerKg": 15,
  "originalPricePerKg": 25,
  "availableQtyKg": 200,
  "minOrderKg": 5,
  "harvestDate": "2025-05-01"
}
```

#### `PUT /crops/:id` 🔒 (farmer, own listing)
Update price, quantity, availability.

#### `DELETE /crops/:id` 🔒 (farmer, own listing)
Remove a listing.

---

### Orders

#### `GET /orders` 🔒
Get orders (farmers see their sales; retailers see their purchases).

Query params: `status`, `page`, `limit`

**Response includes:**
```json
{
  "summary": { "thisMonthSales": 24650, "activeOrders": 12 },
  "data": [ ... ]
}
```

#### `GET /orders/:id` 🔒
Get order detail.

#### `POST /orders` 🔒 (retailer)
Place a new order.
```json
{
  "cropId": "c-001",
  "qtyKg": 50,
  "deliveryAddress": "Shop 14, Hall Road, Lahore",
  "collectionCenterId": "cc-001",
  "scheduledDelivery": "2025-05-05T10:00:00Z"
}
```

#### `PUT /orders/:id/status` 🔒
Update order status.
```json
{ "status": "confirmed" }
```

| Who        | Allowed transitions                          |
|------------|----------------------------------------------|
| Farmer     | pending → confirmed → in_transit → delivered |
| Retailer   | pending → cancelled                          |
| Admin      | Any                                          |

---

### Prices (Live Ticker)

#### `GET /prices`
Get all commodity prices.

#### `GET /prices/:cropName`
Get price for one crop (case-insensitive).

#### `PUT /prices/:id` 🔒 (admin)
Update a price.

---

### Disease AI Scanner

#### `GET /disease/crops`
List all supported crops for scanning.

#### `GET /disease/info/:cropKey`
Get disease info for: `tomato`, `wheat`, `potato`, `mango`, `cotton`, `rice`

**Example response:**
```json
{
  "success": true,
  "data": {
    "name": "Early Blight (Alternaria solani)",
    "severity": "High Risk",
    "symptoms": ["Dark brown spots", "Yellow halos on leaves", ...],
    "treatments": [
      { "icon": "💊", "label": "Fungicide", "text": "Apply Mancozeb 80% WP..." }
    ],
    "prevention": "Rotate crops every season..."
  }
}
```

#### `POST /disease/scan`
Upload a crop image for AI detection.
- Form data: `image` (file) + optional `cropHint` (string)

#### `POST /disease/scan/demo`
Quick demo without image upload.
```json
{ "cropKey": "wheat" }
```

> **Production Note:** Wire `classifyDisease()` in `routes/disease.js` to a vision AI model (GPT-4o, Gemini Vision, or a fine-tuned plant disease classifier).

---

### Collection Centers

#### `GET /centers`
List all centers. Query: `district`, `status`

#### `GET /centers/search/nearby?lat=30.66&lng=73.10&radiusKm=50`
Find centers within radius using Haversine formula.

#### `GET /centers/:id`
Get center detail.

---

### Reviews

#### `GET /reviews`
List reviews. Query: `role`, `page`, `limit`

#### `POST /reviews` 🔒
Submit a review.
```json
{ "stars": 5, "text": "Got 2x income directly from farmer!" }
```

---

### Training

#### `GET /training`
List all training modules.

#### `GET /training/:id`
Get module detail.

---

### Dashboard

#### `GET /dashboard` 🔒
Role-based dashboard:
- **Farmer:** thisMonthSales, activeOrders, myListings
- **Retailer:** thisMonthSpend, activeOrders
- **Admin:** platform-wide metrics

#### `GET /dashboard/platform-stats`
Public hero stats (registered farmers, retailers, districts, income improvement).

---

## 🗺️ Production Roadmap

| Feature               | How to upgrade                                             |
|-----------------------|------------------------------------------------------------|
| Database              | Replace `database.js` in-memory store with PostgreSQL + Prisma |
| Image AI              | Wire `classifyDisease()` to GPT-4o Vision or PlantNet API  |
| Live Prices           | Connect to AMIS Pakistan / commodity market data feed      |
| SMS Notifications     | Add Twilio for order updates (critical for farmers without internet) |
| Payments              | Integrate JazzCash / EasyPaisa APIs                        |
| File Storage          | Replace local `uploads/` with AWS S3 or Cloudinary         |
| Rate Limiting         | Swap express-rate-limit store with Redis                   |
| Maps                  | Integrate Google Maps API for collection center navigation |

---

## 📊 Data Model Summary

```
User        id, name, phone, role, district, verified, stats
Crop        id, farmerId, name, category, badge, pricePerKg, availableQtyKg, ...
Order       id, buyerId, farmerId, cropId, qtyKg, totalAmount, status, ...
Price       id, cropName, pricePerKg, change, unit
Disease     cropKey → { name, severity, symptoms, treatments, prevention }
Center      id, name, district, lat, lng, status
Review      id, userId, stars, text, verified
Training    id, title, description, tags, durationMin
```
