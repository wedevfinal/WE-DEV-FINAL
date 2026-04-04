/* API Integration Module - Unified API calls with Mock Data Fallback */

// Use public backend tunnel when served via localtunnel, otherwise use localhost
const API_BASE_URL = (typeof window !== 'undefined' && window.location.hostname.includes('loca.lt'))
  ? 'https://tangy-parts-doubt.loca.lt'
  : 'http://127.0.0.1:8000'

/**
 * Generic fetch wrapper with error handling
 */
const fetchWithFallback = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.warn(`API call failed for ${endpoint}, using fallback:`, error)
    return null
  }
}

/* ============================================
   MARKET DATA APIs
   ============================================ */
export const getMarketData = async () => {
  const response = await fetchWithFallback('/ai/market-data')
  
  if (response?.data) {
    return response.data
  }
  
  // Fallback mock data
  return {
    nifty: 22713.1,
    sensex: 73319.55,
    gold: 4651.5,
    bitcoin: 66906.98,
    timestamp: new Date().toISOString(),
  }
}

// Get news
export const getNews = async () => {
  const response = await fetchWithFallback('/ai/news')
  
  if (response?.data) {
    return response.data
  }
  
  // Fallback mock data
  return [
    {
      title: 'Global markets rally on positive economic data',
      source: 'Reuters',
      published_at: new Date().toISOString(),
      url: '#'
    },
    {
      title: 'Tech stocks surge as AI investments continue',
      source: 'Bloomberg',
      published_at: new Date().toISOString(),
      url: '#'
    },
  ]
}

// Get investment advice
export const getInvestmentAdvice = async (monthlySavings) => {
  const response = await fetchWithFallback(
    `/ai/investment-advice?monthly_savings=${monthlySavings}`
  )
  
  if (response?.data) {
    return response.data
  }
  
  // Fallback: Calculate locally
  let riskLevel = 'Low Risk'
  let recommendation = 'Fixed Deposit (FD), Recurring Deposit, Safe SIP'
  
  if (monthlySavings >= 1000 && monthlySavings < 3000) {
    riskLevel = 'Medium Risk'
    recommendation = 'Mutual Funds, Index Funds, Balanced Portfolio'
  } else if (monthlySavings >= 3000) {
    riskLevel = 'High Risk'
    recommendation = 'Stocks, Growth-focused SIP'
  }
  
  return {
    monthly_savings: monthlySavings,
    risk_level: riskLevel,
    recommendation: `Recommended: ${recommendation}`,
    disclaimer: 'This is educational advice only. Consult a financial advisor before investing.',
  }
}

// Get complete dashboard
export const getAIDashboard = async (monthlySavings) => {
  const response = await fetchWithFallback(
    `/ai/dashboard?monthly_savings=${monthlySavings}`
  )
  
  if (response?.data) {
    return response
  }
  
  // Fallback: combine individual data
  return {
    status: 'success',
    market_data: await getMarketData(),
    news: await getNews(),
    investment_advice: await getInvestmentAdvice(monthlySavings),
  }
}

/* ============================================
   EXPENSE APIs (if available)
   ============================================ */
export const getExpenses = async () => {
  const response = await fetchWithFallback('/expenses')
  
  if (response?.length >= 0) {
    return response
  }
  
  // Fallback mock data
  return [
    { id: 1, category: 'Food', amount: 45.99, date: '2026-04-01', description: 'Grocery shopping' },
    { id: 2, category: 'Transport', amount: 25.00, date: '2026-04-01', description: 'Gas' },
    { id: 3, category: 'Entertainment', amount: 30.00, date: '2026-04-02', description: 'Movie' },
  ]
}

export const getExpenseSummary = async () => {
  const response = await fetchWithFallback('/expenses/summary')
  
  if (response?.total_expenses !== undefined) {
    return response
  }
  
  // Fallback calculation
  const expenses = await getExpenses()
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const byCategory = {}
  
  expenses.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount
  })
  
  return {
    total_expenses: total,
    by_category: byCategory,
    expenses: expenses
  }
}

export const addExpense = async (expense) => {
  const response = await fetchWithFallback('/expenses', {
    method: 'POST',
    body: JSON.stringify({
      ...expense,
      date: expense.date || new Date().toISOString()
    }),
  })
  
  if (response?.id) {
    return response
  }
  
  // Fallback: return with mock ID
  return { ...expense, id: Date.now() }
}

export const updateExpense = async (id, expense) => {
  const response = await fetchWithFallback(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expense),
  })
  
  return response || expense
}

export const deleteExpense = async (id) => {
  const response = await fetchWithFallback(`/expenses/${id}`, {
    method: 'DELETE',
  })
  
  return true
}

/* ============================================
   ACHIEVEMENT APIs (if available)
   ============================================ */
export const getAchievements = async () => {
  const response = await fetchWithFallback('/achievements')
  
  if (response?.achievements) {
    return response
  }
  
  // Fallback mock data
  return {
    total_achievements: 5,
    unlocked_count: 2,
    achievements: [
      { id: 1, title: 'First Steps', description: 'Create your first investment', icon: '🚀', unlocked: true },
      { id: 2, title: 'Saver', description: 'Accumulate $5,000 in savings', icon: '💰', unlocked: true },
      { id: 3, title: 'Portfolio Pro', description: 'Create a portfolio with 5+ assets', icon: '📈', unlocked: false },
      { id: 4, title: 'Knowledge Seeker', description: 'Complete 5 educational courses', icon: '🎓', unlocked: true },
      { id: 5, title: 'Consistent Saver', description: 'Save money for 30 consecutive days', icon: '⭐', unlocked: false },
    ]
  }
}

/* ============================================
   PROFILE APIs
   ============================================ */
export const getProfile = async () => {
  const response = await fetchWithFallback('/profile/')
  if (response) return response
  return { monthly_income: null, monthly_savings: null, investable_amount: null, risk_goal: null }
}

export const updateProfile = async (payload) => {
  const response = await fetchWithFallback('/profile/', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

  return response
}

export const unlockAchievement = async (id) => {
  const response = await fetchWithFallback(`/achievements/${id}/unlock`, {
    method: 'POST',
  })
  
  return response || { id, unlocked: true }
}

export const createAchievement = async (achievement) => {
  const response = await fetchWithFallback('/achievements', {
    method: 'POST',
    body: JSON.stringify(achievement),
  })
  
  return response || { ...achievement, id: Date.now() }
}

/* ============================================
   PORTFOLIO APIs (if available)
   ============================================ */
export const getPortfolio = async () => {
  const response = await fetchWithFallback('/portfolio')
  
  if (response?.data) {
    return response.data
  }
  
  // Fallback mock data
  return [
    { id: 1, symbol: 'AAPL', name: 'Apple Inc', quantity: 10, price: 180.50, value: 1805 },
    { id: 2, symbol: 'MSFT', name: 'Microsoft', quantity: 5, price: 420.75, value: 2103.75 },
    { id: 3, symbol: 'GOOGL', name: 'Google', quantity: 3, price: 140.25, value: 420.75 },
  ]
}

/* ============================================
   RISK CALCULATOR
   ============================================ */
export const calculateRisk = async (data) => {
  const response = await fetchWithFallback('/investment/calculate-risk', {
    method: 'POST',
    body: JSON.stringify({
      income: parseFloat(data.income),
      savings: parseFloat(data.savings),
      age: parseInt(data.age),
      goals: data.goals,
    }),
  })
  
  if (response?.risk_level) {
    return response
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
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    })
    return response.ok
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
