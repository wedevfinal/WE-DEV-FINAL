# Quick Start Guide

Get the Personal Investment Management System up and running in 5 minutes!

## Prerequisites

- Python 3.8+
- pip (Python package manager)

## Step 1: Setup Environment

```bash
# Navigate to project directory
cd "backend venture"

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

## Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 3: Run the Server

```bash
python app/main.py
```

You should see output like:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started server process [12345]
```

## Step 4: Access the API

### Swagger UI (Interactive Documentation)
Open your browser and go to: http://localhost:8000/docs

### API Endpoints

Base URL: `http://localhost:8000`

### Quick Test Sequence

#### 1. Register a New User
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo User",
    "email": "demo@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "id": 1,
  "name": "Demo User",
  "email": "demo@example.com",
  "created_at": "2024-03-29T10:00:00"
}
```

#### 2. Login and Get Token
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {...}
}
```

**Save the access_token for next requests!**

#### 3. Create a Portfolio Entry
```bash
curl -X POST http://localhost:8000/portfolio \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "asset_name": "Apple Inc.",
    "asset_type": "stock",
    "quantity": 5,
    "buy_price": 150.00,
    "current_price": 180.00
  }'
```

#### 4. View Your Portfolio
```bash
curl -X GET http://localhost:8000/portfolio \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 5. Get Portfolio Summary
```bash
curl -X GET http://localhost:8000/portfolio/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "total_investment": 750.00,
  "total_current_value": 900.00,
  "total_profit_loss": 150.00,
  "portfolio_items": [...]
}
```

#### 6. Get Investment Education
```bash
curl http://localhost:8000/education
```

#### 7. Get Investment Guide
```bash
curl -X POST http://localhost:8000/investment-guide \
  -H "Content-Type: application/json" \
  -d '{"risk_level": "medium"}'
```

## Using Swagger UI (Recommended for Testing)

1. Go to http://localhost:8000/docs
2. Click "Authorize" button
3. Paste your token: `YOUR_TOKEN_HERE`
4. Click "Authorize"
5. Now you can test all endpoints directly in the browser!

## Common Issues & Solutions

### Issue: `ModuleNotFoundError: No module named 'fastapi'`
- Make sure your virtual environment is activated
- Run `pip install -r requirements.txt` again

### Issue: `Database is locked`
- Delete `finance.db` file
- Restart the server

### Issue: `Invalid token`
- Generate a new token via login endpoint
- Token expires after 30 minutes

### Issue: Port 8000 already in use
```bash
# Run on different port
uvicorn app.main:app --port 8001
```

## Project Structure

```
backend venture/
├── app/
│   ├── main.py              ← Main application
│   ├── database.py          ← DB setup
│   ├── models.py            ← Data models
│   ├── schemas.py           ← Validation schemas
│   ├── auth.py              ← Authentication
│   ├── dependencies.py      ← Dependency injection
│   └── routers/             ← API endpoints
│       ├── auth.py
│       ├── portfolio.py
│       ├── education.py
│       └── investment.py
├── finance.db               ← SQLite database (auto-created)
├── requirements.txt         ← Dependencies
└── README.md               ← Full documentation
```

## Next Steps

1. **Explore Endpoints**: Visit http://localhost:8000/docs
2. **Read Full Docs**: Check out README.md for detailed API documentation
3. **Customize**: Modify code for your specific needs
4. **Deploy**: Use `requirements.txt` for production deployment

## Useful Commands

```bash
# Run with auto-reload (development)
python app/main.py

# Run without reload (production-like)
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Reset database
rm finance.db
python app/main.py

# Deactivate virtual environment
deactivate
```

## API Features Summary

✅ **User Authentication** - Register and login with JWT  
✅ **Portfolio Tracking** - Create, read, update, delete investments  
✅ **Portfolio Summary** - View total value and profit/loss  
✅ **Investment Education** - Learn investing basics  
✅ **Investment Guide** - Get recommendations based on risk level  

## Security Notes

- Default JWT secret key is set in code - **CHANGE IT IN PRODUCTION**
- Passwords are hashed with bcrypt
- All portfolio routes are protected with JWT
- Users can only access their own data

## Questions?

Check the README.md file for comprehensive documentation and more examples!

---

Happy investing! 📈
