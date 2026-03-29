# API Testing Examples - Personal Investment Management System

## 🧪 Quick Testing Examples

### 1. Register a User
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Response:**
```json
{
  "id": 1,
  "name": "Test User",
  "email": "test@example.com",
  "created_at": "2024-03-29T10:00:00"
}
```

---

### 2. Login User (Get Token)
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "created_at": "2024-03-29T10:00:00"
  }
}
```

**Save token for next requests:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. Create Portfolio Entry
```bash
curl -X POST http://localhost:8000/portfolio \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "asset_name": "Apple Inc.",
    "asset_type": "stock",
    "quantity": 10,
    "buy_price": 150.00,
    "current_price": 185.50
  }'
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "asset_name": "Apple Inc.",
  "asset_type": "stock",
  "quantity": 10,
  "buy_price": 150.00,
  "current_price": 185.50,
  "created_at": "2024-03-29T10:05:00"
}
```

---

### 4. Get Portfolio
```bash
curl -X GET http://localhost:8000/portfolio \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "asset_name": "Apple Inc.",
    "asset_type": "stock",
    "quantity": 10,
    "buy_price": 150.00,
    "current_price": 185.50,
    "created_at": "2024-03-29T10:05:00"
  }
]
```

---

### 5. Get Portfolio Summary
```bash
curl -X GET http://localhost:8000/portfolio/summary \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "total_investment": 1500.00,
  "total_current_value": 1855.00,
  "total_profit_loss": 355.00,
  "portfolio_items": [
    {
      "id": 1,
      "user_id": 1,
      "asset_name": "Apple Inc.",
      "asset_type": "stock",
      "quantity": 10,
      "buy_price": 150.00,
      "current_price": 185.50,
      "created_at": "2024-03-29T10:05:00"
    }
  ]
}
```

---

### 6. Update Portfolio
```bash
curl -X PUT http://localhost:8000/portfolio/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "current_price": 200.00,
    "quantity": 15
  }'
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "asset_name": "Apple Inc.",
  "asset_type": "stock",
  "quantity": 15,
  "buy_price": 150.00,
  "current_price": 200.00,
  "created_at": "2024-03-29T10:05:00"
}
```

---

### 7. Delete Portfolio
```bash
curl -X DELETE http://localhost:8000/portfolio/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Response:** 204 No Content

---

### 8. Get Education Topics
```bash
curl http://localhost:8000/education
```

**Response:**
```json
{
  "topics": [
    {
      "topic_id": "investing_basics",
      "title": "Investing Basics",
      "description": "Learn the fundamentals of investing"
    },
    {
      "topic_id": "types_of_investments",
      "title": "Types of Investments",
      "description": "Understand different investment types"
    },
    {
      "topic_id": "risk_vs_return",
      "title": "Risk vs Return",
      "description": "Understanding the relationship between risk and returns"
    },
    {
      "topic_id": "diversification",
      "title": "Portfolio Diversification",
      "description": "Reduce risk through portfolio diversification"
    }
  ],
  "total": 4
}
```

---

### 9. Get Specific Topic
```bash
curl http://localhost:8000/education/investing_basics
```

**Response:**
```json
{
  "topic_id": "investing_basics",
  "title": "Investing Basics",
  "description": "Learn the fundamentals of investing",
  "content": "[detailed content about investing basics...]"
}
```

---

### 10. Get Investment Guide
```bash
curl -X POST http://localhost:8000/investment-guide \
  -H "Content-Type: application/json" \
  -d '{"risk_level": "medium"}'
```

**Response:**
```json
{
  "risk_level": "medium",
  "recommendations": [
    "Balanced Mutual Funds",
    "Index ETFs",
    "Blue-Chip Stocks",
    "Government Bonds",
    "REITs",
    "Dividend Stocks"
  ],
  "description": "Balanced strategy mixing growth and stability. Best for: Regular investors, moderate time horizon, balanced goals."
}
```

---

## 🎯 Test Different Risk Levels

### Low Risk
```bash
curl -X POST http://localhost:8000/investment-guide \
  -H "Content-Type: application/json" \
  -d '{"risk_level": "low"}'
```

### Medium Risk
```bash
curl -X POST http://localhost:8000/investment-guide \
  -H "Content-Type: application/json" \
  -d '{"risk_level": "medium"}'
```

### High Risk
```bash
curl -X POST http://localhost:8000/investment-guide \
  -H "Content-Type: application/json" \
  -d '{"risk_level": "high"}'
```

---

## 📊 Sample Test Data

### User 1
```
Email: alice@test.com
Password: password123
```

### User 2
```
Email: bob@test.com
Password: password456
```

### Sample Assets to Add
```
1. Stock - Apple - Qty: 10 - Buy: $150 - Current: $185.50
2. Stock - Microsoft - Qty: 5 - Buy: $300 - Current: $425.75
3. ETF - S&P 500 - Qty: 20 - Buy: $400 - Current: $485
4. Gold - Qty: 2 - Buy: $1800 - Current: $2050
```

---

## ✅ Testing Workflow

1. **Register** → Create 2 test users
2. **Login** → Get tokens for both users
3. **Create** → Add 3-4 assets to each user's portfolio
4. **Read** → Verify portfolio lists
5. **Update** → Change prices/quantities
6. **Delete** → Remove an asset
7. **Summary** → Check profit/loss calculations
8. **Education** → Get all topics
9. **Guide** → Test different risk levels

---

## 🔗 API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /auth/register | ❌ | Register user |
| POST | /auth/login | ❌ | Login & get token |
| POST | /portfolio | ✅ | Create asset |
| GET | /portfolio | ✅ | Get all assets |
| GET | /portfolio/summary | ✅ | Get summary |
| PUT | /portfolio/{id} | ✅ | Update asset |
| DELETE | /portfolio/{id} | ✅ | Delete asset |
| GET | /education | ❌ | Get all topics |
| GET | /education/{topic} | ❌ | Get specific topic |
| POST | /investment-guide | ❌ | Get recommendations |
| GET | /health | ❌ | Health check |
| GET | / | ❌ | Root endpoint |
