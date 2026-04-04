# WeDev - AI-Powered Wealth Developer Dashboard

A complete React + Vite frontend for the Personal Investment Management System. This SPA connects to your FastAPI backend and provides a modern, responsive interface for managing investments, expenses, and financial education.

## 📋 Project Structure

```
backend venture/
├── app/                          # FastAPI backend (unchanged)
│   ├── main.py
│   ├── routers/
│   ├── ai/
│   └── ...
│
└── frontend/                     # React + Vite frontend
    ├── src/
    │   ├── main.jsx             # React entry point
    │   ├── App.jsx              # Main app component
    │   ├── api.js               # API integration
    │   ├── data.js              # Mock data
    │   ├── ui-components.jsx    # Reusable components
    │   ├── layout.jsx           # Sidebar + Navbar
    │   └── pages.jsx            # All 9 pages
    ├── index.html               # HTML template
    ├── styles.css               # Global styles (no frameworks)
    ├── package.json
    ├── vite.config.js
    └── README.md
```

## 🎯 Features

- **9 Pages**: Dashboard, Expense Tracker, Portfolio, Risk Calculator, Investment Guide, Market Dashboard, Finance News, Education, Achievements
- **API Integration**: Connects to FastAPI backend with mock data fallback
- **Authentication**: Demo mode - any email/password works
- **Responsive Design**: Works on desktop, tablet, mobile
- **No External Dependencies**: Pure CSS, no Tailwind or UI frameworks
- **Real-time Data**: Market data, financial news, investment advice from backend API

## 🔧 Technology Stack

- **React 19** RC
- **Vite 8** (dev server & bundler)
- **Fetch API** (no axios)
- **Pure CSS** (glassmorphism, animations)
- **State Management**: useState, useContext

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ (for React 19 RC support)
- Python 3.8+ (for FastAPI backend)

### 1️⃣ Backend Setup

```bash
cd "c:\Users\bhavy\Downloads\backend venture"

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
python -m uvicorn app.main:app --reload
```

Backend will run at: `http://127.0.0.1:8000`

### 2️⃣ Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend will run at: `http://localhost:5173`

## 🚀 Running Both Simultaneously

### Option 1: Two Terminal Windows

**Terminal 1** (Backend):
```bash
cd "c:\Users\bhavy\Downloads\backend venture"
python -m uvicorn app.main:app --reload
```

**Terminal 2** (Frontend):
```bash
cd "c:\Users\bhavy\Downloads\backend venture\frontend"
npm run dev
```

### Option 2: Single Terminal (Background Process)

```bash
# Terminal 1 - Start backend
cd "c:\Users\bhavy\Downloads\backend venture"
python -m uvicorn app.main:app --reload &

# Terminal 2 - Start frontend  
cd frontend
npm install && npm run dev
```

## 🔗 API Integration

The frontend connects to these backend endpoints:

```javascript
// Market Data
GET /ai/market-data
// Response: { nifty, sensex, gold, bitcoin }

// Financial News
GET /ai/news
// Response: array of articles

// Investment Advice
GET /ai/investment-advice?monthly_savings=2500
// Response: risk_level, recommendation

// Complete Dashboard
GET /ai/dashboard?monthly_savings=2000
// Response: market_data + news + advice
```

**All API calls have fallback to mock data if backend is unavailable.**

## 📱 Pages & Features

| Page | Features |
|------|----------|
| **Dashboard** | KPI cards, savings rate, market overview, expense chart |
| **Expense Tracker** | Add/edit/delete expenses, category filters, totals |
| **Portfolio** | View holdings, asset values, performance |
| **Risk Calculator** | Calculate risk profile based on income/savings |
| **Investment Guide** | Personalized advice, fundamentals education |
| **Market Dashboard** | Live market indices, asset trends |
| **Finance News** | Financial headlines, latest articles |
| **Education** | Courses, learning modules, completion tracking |
| **Achievements** | Gamification, unlocked badges |

## 🎨 Design System

### Colors
- **Primary**: Green (#00C853) → Cyan (#00BCD4)
- **Secondary**: Indigo (#3F51B5)
- **Accent**: Amber (#FFC107), Orange (#FF5722)
- **Error**: Red (#F44336)
- **Dark Sidebar**: #0f172a
- **Light Content**: #f8fafc

### Components
- Glassmorphism cards (backdrop blur)
- Rounded corners (10-20px)
- Smooth animations (0.3-0.6s)
- Progress rings
- Simple bar/pie charts
- Modal dialogs
- Toast notifications

### Typography
- **Headings**: Space Grotesk (700)
- **Body**: System sans-serif
- Responsive font sizes

## 🔐 Authentication

Demo mode - no backend validation:
```javascript
// Any email/password combination works
Email: user@example.com
Password: anything
```

User data stored in localStorage:
```javascript
localStorage.setItem('user', JSON.stringify({ email, name }))
```

## 📤 API Functions (api.js)

### Market Data
```javascript
import { getMarketData, getNews, getInvestmentAdvice } from './api'

const market = await getMarketData()
// Returns: { nifty, sensex, gold, bitcoin }

const news = await getNews()
// Returns: array of articles

const advice = await getInvestmentAdvice(2500)
// Returns: { risk_level, recommendation }
```

### Expenses
```javascript
const expenses = await getExpenses()
const added = await addExpense({ category, amount, date, description })
const deleted = await deleteExpense(id)
```

### Error Handling
```javascript
// All API calls have built-in fallback
// If backend is down → use mock data
// No try/catch needed in components
```

## 🛠️ Development

### File Structure Explanation

```
src/
├── main.jsx              # React DOM render
├── App.jsx              # App logic, auth, routing
├── api.js               # Reusable fetch functions
├── data.js              # Mock data for all pages
├── ui-components.jsx    # Reusable UI components
├── layout.jsx           # Sidebar + Navbar layout
└── pages.jsx            # All 9 page components
```

### Component Example
```javascript
import { Card, StatCard } from './ui-components'

function MyPage() {
  return (
    <Card title="My Card">
      <StatCard label="Value" value="$5000" icon="💰" />
    </Card>
  )
}
```

### Adding a New Page
1. Create component in `pages.jsx`
2. Add to navigation in `layout.jsx`
3. Add route case in `App.jsx`
4. Optional: Add mock data in `data.js`

## 🚨 No Backend Fallback

If FastAPI backend is not running, the app still works:
- Displays mock data
- All interactions remain functional
- Simulates API responses locally

Check status:
```javascript
import { checkAPIStatus } from './api'

const status = await checkAPIStatus()
// { connected: true/false, message, timestamp }
```

## 📊 Build & Deploy

### Development Build
```bash
cd frontend
npm run dev
```

### Production Build
```bash
cd frontend
npm run build
```

Output: `frontend/dist/` folder (ready for deployment)

### Deploy to Vercel/Netlify
```bash
cd frontend
npm run build
# Upload `dist/` folder
```

## 🔗 CORS Configuration

Backend already allows all origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

No changes needed. Frontend communicates with `http://127.0.0.1:8000`

## 📝 Notes

- **No React Router**: Uses `useState` for page navigation
- **No Tailwind CSS**: All styles in `styles.css`
- **fetch() Only**: No axios, built-in fetch
- **Mock Data**: `data.js` provides fallback
- **localStorage**: User auth data persisted
- **Responsive**: CSS media queries for mobile

## ⚡ Performance

- Vite HMR: Fast hot module replacement
- Lazy animations: GPU-accelerated
- No bundle bloat: Pure vanilla styles
- Lightweight: ~100KB gzipped

## 🐛 Troubleshooting

### Frontend won't connect to backend
```javascript
// Check if backend is running on 127.0.0.1:8000
// Check /health endpoint in browser
// App automatically falls back to mock data
```

### CORS errors
- Backend CORS is set to `allow_origins=["*"]`
- No configuration needed
- Both should run on same machine

### Node dependencies fail
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### React version issues
- Uses React 19 RC
- Requires Node.js 18+
- Vite handles bundling

## 📞 Support

For issues:
1. Check if backend is running: `http://127.0.0.1:8000/health`
2. Check browser console for errors
3. Inspect Network tab for API calls
4. Verify Node.js version: `node --version`

## 📄 License

MIT - Free to use and modify
