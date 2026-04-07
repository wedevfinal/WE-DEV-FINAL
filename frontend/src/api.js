/* API Integration Module - Axios-based wrapper */
import axios from 'axios'

const API_BASE_URL = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://tangy-parts-doubt.loca.lt'
  : 'http://127.0.0.1:8000'

const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` }
  return config
})

const unwrap = (res) => (res && res.data !== undefined ? res.data : res)

/* ============================================
   AUTH APIs
   ============================================ */
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password })
    return unwrap(response)
  } catch (err) {
    // Return backend error payload (if available) so UI can show precise messages
    if (err && err.response && err.response.data) return err.response.data
    return { detail: String(err) }
  }
}

export const register = async (payload) => {
  try {
    const response = await api.post('/auth/register', payload)
    return unwrap(response)
  } catch (err) {
    if (err && err.response && err.response.data) return err.response.data
    return { detail: String(err) }
  }
}

export const me = async () => {
  const response = await api.get('/auth/me')
  return unwrap(response)
}

/* ============================================
   MARKET DATA APIs
   ============================================ */
export const getMarketData = async () => {
  const response = await api.get('/ai/market-data')
  const data = unwrap(response)
  // backend returns { status, data }
  return data?.data ?? data
}

// Get news
export const getNews = async () => {
  const response = await api.get('/ai/news')
  const data = unwrap(response)
  // backend returns { status, count, data }
  return data?.data ?? data
}

// Get investment advice
export const getInvestmentAdvice = async (monthlySavings) => {
  const params = monthlySavings ? { monthly_savings: monthlySavings } : {}
  const response = await api.get('/ai/investment-advice', { params })
  return unwrap(response)
}

/* ============================================
   EDUCATION APIs
   ============================================ */
export const getEducationTopics = async () => {
  const response = await api.get('/education/')
  const data = unwrap(response)
  // backend returns { topics, total }
  return data?.topics ?? data
}

export const getEducationTopic = async (topicId) => {
  const response = await api.get(`/education/${topicId}`)
  return unwrap(response)
}

// Get complete dashboard
export const getAIDashboard = async (monthlySavings) => {
  const params = monthlySavings ? { monthly_savings: monthlySavings } : {}
  const response = await api.get('/ai/dashboard', { params })
  const data = unwrap(response)
  // backend returns { status, market_data, news, investment_advice }
  return data
}

/* ============================================
   EXPENSE APIs (if available)
   ============================================ */
export const getExpenses = async () => {
  const response = await api.get('/expenses')
  return unwrap(response)
}

export const getExpenseSummary = async () => {
  const response = await api.get('/expenses/summary')
  return unwrap(response)
}

export const addExpense = async (expense) => {
  const body = { ...expense, date: expense.date || new Date().toISOString() }
  const response = await api.post('/expenses', body)
  return unwrap(response)
}

export const updateExpense = async (id, expense) => {
  const response = await api.put(`/expenses/${id}`, expense)
  return unwrap(response)
}

export const deleteExpense = async (id) => {
  await api.delete(`/expenses/${id}`)
  return true
}

/* ============================================
   ACHIEVEMENT APIs (if available)
   ============================================ */
export const getAchievements = async () => {
  const response = await api.get('/achievements')
  return unwrap(response)
}

/* ============================================
   PROFILE APIs
   ============================================ */
export const getProfile = async () => {
  const response = await api.get('/profile/')
  return unwrap(response)
}
export const updateProfile = async (payload) => {
  const response = await api.put('/profile/', payload)
  return unwrap(response)
}

export const unlockAchievement = async (id) => {
  const response = await api.post(`/achievements/${id}/unlock`)
  return unwrap(response)
}

export const createAchievement = async (achievement) => {
  const response = await api.post('/achievements', achievement)
  return unwrap(response)
}

/* ============================================
   FINANCIAL PROFILE APIs
   ============================================ */
export const getFinancialProfile = async () => {
  try {
    const response = await api.get('/financial-profile/')
    return unwrap(response)
  } catch (err) {
    // If not found, return null so UI can redirect to profile setup
    if (err?.response?.status === 404) return null
    throw err
  }
}

export const createFinancialProfile = async (payload) => {
  const response = await api.post('/financial-profile/', payload)
  return unwrap(response)
}

export const updateFinancialProfile = async (payload) => {
  const response = await api.put('/financial-profile/', payload)
  return unwrap(response)
}

/* ============================================
   PORTFOLIO APIs (if available)
   ============================================ */
export const getPortfolio = async () => {
  const response = await api.get('/portfolio')
  return unwrap(response)
}

export const createPortfolioItem = async (payload) => {
  const body = JSON.stringify({
    symbol: payload.symbol,
    asset_name: payload.name || payload.asset_name,
    quantity: parseFloat(payload.quantity),
    price: parseFloat(payload.price),
  })
  const response = await api.post('/portfolio', JSON.parse(body))
  return unwrap(response)
}

export const deletePortfolioItem = async (id) => {
  await api.delete(`/portfolio/${id}`)
  return true
}

/* ============================================
   RISK CALCULATOR
   ============================================ */
export const calculateRisk = async (data) => {
  const body = {
    income: parseFloat(data.income),
    savings: parseFloat(data.savings),
    age: parseInt(data.age),
    goals: data.goals,
  }

  const response = await api.post('/investment/calculate-risk', body)

  if (response?.data?.risk_level || response?.risk_level) {
    return unwrap(response)
  }
  
  // Fallback: simple calculation
  const { income, savings, goals } = data
  const savingsRate = (savings / income) * 100
  
  let risk = 'Low Risk'
  if (savingsRate > 20) risk = 'Medium Risk'
  if (savingsRate > 40) risk = 'High Risk'
  
  return {
    risk_level: risk,
    savings_rate: savingsRate,
    recommendation: 'Diversify your portfolio accordingly',
    allocation: { Stocks: 50, Bonds: 30, Cash: 20 },
  }
}

/* ============================================
   HEALTH CHECK
   ============================================ */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health', { timeout: 3000 })
    return response.status === 200
  } catch {
    return false
  }
}

/* ============================================
   API Status Demo
   ============================================ */
export const checkAPIStatus = async () => {
  const isHealthy = await healthCheck()
  
  return {
    connected: isHealthy,
    message: isHealthy 
      ? 'Connected to backend API' 
      : 'Using fallback mock data (API not available)',
    timestamp: new Date().toISOString(),
  }
}
