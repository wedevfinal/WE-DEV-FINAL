# Personal Investment Management System - FastAPI Backend

A production-ready FastAPI backend for managing personal investments with JWT authentication, portfolio tracking, and investment education.

## Features

✅ **User Authentication**
- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Token expiry: 30 minutes

✅ **Portfolio Management**
- Create, read, update, delete portfolio entries
- Track multiple investments
- User-isolated data access
- Real-time profit/loss calculation

✅ **Portfolio Summary**
- Total investment amount
- Current portfolio value
- Overall profit/loss calculation
- Detailed asset breakdown

✅ **Investment Education**
- 4 comprehensive topics
- Investing basics
- Types of investments
- Risk vs return relationship
- Portfolio diversification

✅ **Investment Guide**
- Risk-based recommendations
- 3 risk levels: low, medium, high
- Tailored asset recommendations
- Strategy descriptions

## Tech Stack

- **Framework**: FastAPI 0.104.1
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT with python-jose
- **Password Hashing**: Passlib + bcrypt
- **Validation**: Pydantic
- **API Server**: Uvicorn

## Project Structure

```
backend venture/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Main FastAPI application
│   ├── database.py             # Database configuration
│   ├── models.py               # SQLAlchemy ORM models
│   ├── schemas.py              # Pydantic schemas
│   ├── auth.py                 # Authentication utilities
│   ├── dependencies.py         # Dependency injection
│   └── routers/
│       ├── __init__.py
│       ├── auth.py             # Authentication endpoints
│       ├── portfolio.py        # Portfolio endpoints
│       ├── education.py        # Education endpoints
│       └── investment.py       # Investment guide endpoints
├── finance.db                  # SQLite database (auto-created)
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## Installation & Setup

### 1. Create Virtual Environment

```bash
# Using venv
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Application

```bash
# Method 1: Direct Python execution
python app/main.py

# Method 2: Using Uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Method 3: Production deployment
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The application will start at `http://localhost:8000`

## API Endpoints

### Authentication Routes

#### Register User
```
POST /auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
}

Response (200):
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-03-29T10:00:00"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "securepassword123"
}

Response (200):
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2024-03-29T10:00:00"
    }
}
```

### Portfolio Routes (Protected - Requires JWT Token)

#### Create Portfolio Entry
```
POST /portfolio
Authorization: Bearer <token>
Content-Type: application/json

{
    "asset_name": "Apple Inc.",
    "asset_type": "stock",
    "quantity": 10,
    "buy_price": 150.00,
    "current_price": 175.00
}

Response (200):
{
    "id": 1,
    "user_id": 1,
    "asset_name": "Apple Inc.",
    "asset_type": "stock",
    "quantity": 10,
    "buy_price": 150.00,
    "current_price": 175.00,
    "created_at": "2024-03-29T10:05:00"
}
```

#### Get All Portfolio Entries
```
GET /portfolio
Authorization: Bearer <token>

Response (200):
[
    {
        "id": 1,
        "user_id": 1,
        "asset_name": "Apple Inc.",
        "asset_type": "stock",
        "quantity": 10,
        "buy_price": 150.00,
        "current_price": 175.00,
        "created_at": "2024-03-29T10:05:00"
    }
]
```

#### Get Portfolio Summary
```
GET /portfolio/summary
Authorization: Bearer <token>

Response (200):
{
    "total_investment": 1500.00,
    "total_current_value": 1750.00,
    "total_profit_loss": 250.00,
    "portfolio_items": [
        {
            "id": 1,
            "user_id": 1,
            "asset_name": "Apple Inc.",
            "asset_type": "stock",
            "quantity": 10,
            "buy_price": 150.00,
            "current_price": 175.00,
            "created_at": "2024-03-29T10:05:00"
        }
    ]
}
```

#### Update Portfolio Entry
```
PUT /portfolio/{portfolio_id}
Authorization: Bearer <token>
Content-Type: application/json

{
    "current_price": 180.00,
    "quantity": 12
}

Response (200):
{
    "id": 1,
    "user_id": 1,
    "asset_name": "Apple Inc.",
    "asset_type": "stock",
    "quantity": 12,
    "buy_price": 150.00,
    "current_price": 180.00,
    "created_at": "2024-03-29T10:05:00"
}
```

#### Delete Portfolio Entry
```
DELETE /portfolio/{portfolio_id}
Authorization: Bearer <token>

Response (204): No Content
```

### Education Routes (Public - No Authentication Required)

#### Get All Topics
```
GET /education

Response (200):
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
        ...
    ],
    "total": 4
}
```

#### Get Specific Topic
```
GET /education/{topic}

Response (200):
{
    "topic_id": "investing_basics",
    "title": "Investing Basics",
    "description": "Learn the fundamentals of investing",
    "content": "Detailed content about investing basics..."
}
```

Available topics:
- `investing_basics`
- `types_of_investments`
- `risk_vs_return`
- `diversification`

### Investment Guide Routes (Public - No Authentication Required)

#### Get Investment Recommendations
```
POST /investment-guide
Content-Type: application/json

{
    "risk_level": "medium"
}

Response (200):
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

Risk levels: `low`, `medium`, `high`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Portfolios Table
```sql
CREATE TABLE portfolios (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL FOREIGN KEY REFERENCES users(id),
    asset_name VARCHAR NOT NULL,
    asset_type VARCHAR NOT NULL,
    quantity FLOAT NOT NULL,
    buy_price FLOAT NOT NULL,
    current_price FLOAT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Documentation

Once the server is running, access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## Security Notes

⚠️ **Important for Production**

1. **Change Secret Key**: Update `SECRET_KEY` in `app/auth.py`
   ```python
   SECRET_KEY = "your-very-secure-random-secret-key-here"
   ```

2. **CORS Configuration**: Restrict allowed origins in `app/main.py`
   ```python
   allow_origins=["https://yourdomain.com"]
   ```

3. **Database**: Switch to PostgreSQL for production
   ```python
   DATABASE_URL = "postgresql://user:password@localhost/finance"
   ```

4. **Environment Variables**: Use `.env` file for sensitive data
   ```
   SECRET_KEY=your-secret-key
   DATABASE_URL=postgresql://...
   ```

5. **HTTPS**: Always use HTTPS in production

6. **Token Expiry**: Adjust `ACCESS_TOKEN_EXPIRE_MINUTES` based on requirements

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'

# Create Portfolio (use token from login)
curl -X POST http://localhost:8000/portfolio \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "asset_name": "Apple",
    "asset_type": "stock",
    "quantity": 10,
    "buy_price": 150,
    "current_price": 175
  }'

# Get Portfolio
curl -X GET http://localhost:8000/portfolio \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get Portfolio Summary
curl -X GET http://localhost:8000/portfolio/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get Education Topics
curl http://localhost:8000/education

# Get Investment Guide
curl -X POST http://localhost:8000/investment-guide \
  -H "Content-Type: application/json" \
  -d '{"risk_level": "medium"}'
```

### Using Python Requests

```python
import requests

BASE_URL = "http://localhost:8000"

# Register
response = requests.post(
    f"{BASE_URL}/auth/register",
    json={
        "name": "John Doe",
        "email": "john@example.com",
        "password": "securepassword123"
    }
)
print(response.json())

# Login
response = requests.post(
    f"{BASE_URL}/auth/login",
    json={
        "email": "john@example.com",
        "password": "securepassword123"
    }
)
token = response.json()["access_token"]

# Create Portfolio
headers = {"Authorization": f"Bearer {token}"}
response = requests.post(
    f"{BASE_URL}/portfolio",
    json={
        "asset_name": "Apple",
        "asset_type": "stock",
        "quantity": 10,
        "buy_price": 150,
        "current_price": 175
    },
    headers=headers
)
print(response.json())

# Get Portfolio Summary
response = requests.get(
    f"{BASE_URL}/portfolio/summary",
    headers=headers
)
print(response.json())
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- **200 OK**: Request successful
- **201 Created**: Resource created
- **204 No Content**: Successful deletion
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: User not authorized to access resource
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

Example error response:
```json
{
    "detail": "Email already registered"
}
```

## Development

### Hot Reload
The application includes hot reload by default when run with `python app/main.py`. Any code changes will automatically restart the server.

### Database Reset
To reset the database, delete `finance.db` file and restart the application. It will automatically create a fresh database.

### Logging
Add logging to track API calls and errors:

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("Portfolio created for user")
```

## Performance Considerations

1. **Database Indexing**: User_id is indexed on portfolios table
2. **Connection Pooling**: SQLAlchemy manages connection pools
3. **Pagination**: Can be added to portfolio endpoints for large datasets
4. **Caching**: Consider Redis for frequently accessed data
5. **Rate Limiting**: Can be added using rate limiting middleware

## Future Enhancements

- [ ] Add pagination to portfolio list
- [ ] Implement refresh tokens
- [ ] Add email verification
- [ ] Historical price tracking
- [ ] Portfolio performance analytics
- [ ] Real-time price integration
- [ ] Export portfolio to CSV/PDF
- [ ] Multi-currency support
- [ ] Mobile app integration
- [ ] WebSocket for real-time updates

## Troubleshooting

### Issue: "Database is locked"
**Solution**: Close other connections and restart the server

### Issue: "Invalid token"
**Solution**: Regenerate token via login endpoint

### Issue: "CORS error"
**Solution**: Check CORS configuration in `app/main.py`

### Issue: "Module not found"
**Solution**: Ensure virtual environment is activated and dependencies installed

## License

MIT License - Feel free to use this project for your applications.

## Support

For issues and questions:
1. Check the API documentation at `/docs`
2. Review error messages carefully
3. Verify all required fields in requests
4. Ensure authentication token is valid and not expired

---

**Built with ❤️ using FastAPI**
