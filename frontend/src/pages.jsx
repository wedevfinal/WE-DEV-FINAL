/* All Pages for WeDev Application */
import React, { useState, useEffect } from 'react'
import {
  Card,
  StatCard,
  ProgressRing,
  BarChart,
  SimpleChart,
  Toast,
  Modal,
  EmptyState,
  Loading,
  Badge,
} from './ui-components'
import { formatINR } from './utils'
import {
  getMarketData,
  getNews,
  getInvestmentAdvice,
  getExpenses,
  getPortfolio,
  calculateRisk,
  updateProfile,
} from './api'
import { mockNews, mockPortfolio, mockEducation, mockAchievements } from './data'

/* ============================================
   DASHBOARD PAGE
   ============================================ */
export function DashboardPage({ profile } = {}) {
  const [marketData, setMarketData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const data = await getMarketData()
      setMarketData(data)
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) return <Loading />

  // Use profile values when available, otherwise fallbacks
  const monthlyIncome = profile?.monthly_income ?? 5000
  const monthlySavings = profile?.monthly_savings ?? (monthlyIncome ? Math.max(0, monthlyIncome - 2400) : 0)
  const investedAmount = profile?.investable_amount ?? 15000
  const savingsRate = monthlyIncome ? Math.round((monthlySavings / monthlyIncome) * 100) : 0

  return (
    <div>
      {/* show profile summary if available */}
      {profile && (
        <Card title='Profile Summary' style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>Monthly Income: {formatINR(profile.monthly_income || 0)}</div>
            <div>Monthly Savings: {formatINR(profile.monthly_savings || 0)}</div>
            <div>Investable: {formatINR(profile.investable_amount || 0)}</div>
            <div>Goal: {profile.risk_goal || '—'}</div>
          </div>
        </Card>
      )}
      <div className='kpi-grid'>
        <StatCard
          label='Monthly Income'
          value={formatINR(monthlyIncome || 0)}
          change='Steady'
          icon='💰'
          color='#00C853'
        />
        <StatCard
          label='Monthly Expenses'
          value={formatINR(monthlyIncome - monthlySavings || 0)}
          change='-5% vs last month'
          icon='💸'
          color='#FFC107'
        />
        <StatCard
          label='Monthly Savings'
          value={formatINR(monthlySavings || 0)}
          change='+8% vs last month'
          icon='📈'
          color='#00BCD4'
        />
        <StatCard
          label='Investable Amount'
          value={formatINR(investedAmount || 0)}
          change='+12% YTD'
          icon='📊'
          color='#9C27B0'
        />
      </div>

      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <ProgressRing percentage={savingsRate} label='Savings Rate' />

        <Card title='Market Overview'>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Nifty 50</span>
              <strong>{marketData?.nifty || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Sensex</span>
              <strong>{marketData?.sensex || 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Gold (per oz)</span>
              <strong>{formatINR(marketData?.gold || 0)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Bitcoin</span>
              <strong>{formatINR(marketData?.bitcoin || 0)}</strong>
            </div>
          </div>
        </Card>
      </div>

      <BarChart
        title='Expense Distribution (Last 30 Days)'
        data={[
          { label: 'Food', value: 450 },
          { label: 'Transport', value: 250 },
          { label: 'Entertainment', value: 300 },
          { label: 'Books', value: 100 },
          { label: 'Clothing', value: 200 },
        ]}
        maxValue={500}
      />
    </div>
  )
}

/* ============================================
   PROFILE SETUP PAGE
   ============================================ */
export function ProfileSetupPage({ profile = {}, onSave }) {
  const [form, setForm] = useState({
    monthly_income: profile?.monthly_income || '',
    monthly_savings: profile?.monthly_savings || '',
    investable_amount: profile?.investable_amount || '',
    risk_goal: profile?.risk_goal || 'balanced',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e && e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        monthly_income: form.monthly_income ? parseFloat(form.monthly_income) : null,
        monthly_savings: form.monthly_savings ? parseFloat(form.monthly_savings) : null,
        investable_amount: form.investable_amount ? parseFloat(form.investable_amount) : null,
        risk_goal: form.risk_goal,
      }
      const res = await updateProfile(payload)
      // fallback to payload if API returns null
      const saved = res || payload
      if (onSave) onSave(saved)
    } catch (err) {
      console.error('Failed to save profile', err)
      if (onSave) onSave(form)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card title='Set Up Your Profile'>
        <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
          <div className='form-group'>
            <label className='form-label'>Monthly Income (₹)</label>
            <input type='number' className='form-control' value={form.monthly_income} onChange={(e) => setForm({ ...form, monthly_income: e.target.value })} />
          </div>

          <div className='form-group'>
            <label className='form-label'>Monthly Savings (₹)</label>
            <input type='number' className='form-control' value={form.monthly_savings} onChange={(e) => setForm({ ...form, monthly_savings: e.target.value })} />
          </div>

          <div className='form-group'>
            <label className='form-label'>Investable Amount (₹)</label>
            <input type='number' className='form-control' value={form.investable_amount} onChange={(e) => setForm({ ...form, investable_amount: e.target.value })} />
          </div>

          <div className='form-group'>
            <label className='form-label'>Risk Goal</label>
            <select className='form-control' value={form.risk_goal} onChange={(e) => setForm({ ...form, risk_goal: e.target.value })}>
              <option value='conservative'>Conservative</option>
              <option value='balanced'>Balanced</option>
              <option value='aggressive'>Aggressive</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className='btn btn-primary' type='button' onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save Profile'}</button>
          </div>
        </form>
      </Card>
    </div>
  )
}

/* ============================================
   EXPENSE TRACKER PAGE
   ============================================ */
export function ExpenseTrackerPage() {
  const [expenses, setExpenses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ category: 'Food', amount: '', date: new Date().toISOString().split('T')[0], description: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(false)
      // In real app, fetch from API
      setExpenses([
        { id: 1, category: 'Food', amount: 45.99, date: '2026-04-01', description: 'Grocery' },
        { id: 2, category: 'Transport', amount: 25.00, date: '2026-04-01', description: 'Gas' },
        { id: 3, category: 'Entertainment', amount: 30.00, date: '2026-04-02', description: 'Movie' },
      ])
    }
    loadExpenses()
  }, [])

  const handleAddExpense = () => {
    if (formData.amount && formData.category) {
      setExpenses([...expenses, { id: Date.now(), ...formData, amount: parseFloat(formData.amount) }])
      setFormData({ category: 'Food', amount: '', date: new Date().toISOString().split('T')[0], description: '' })
      setShowModal(false)
    }
  }

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  if (loading) return <Loading />

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '5px' }}>
            Total Expenses: {formatINR(totalExpenses)}
          </h2>
          <p style={{ color: '#64748b' }}>Track and manage your daily expenses</p>
        </div>
        <button className='btn btn-primary' onClick={() => setShowModal(true)}>
          + Add Expense
        </button>
      </div>

      <Modal
        isOpen={showModal}
        title='Add New Expense'
        onClose={() => setShowModal(false)}
        onSubmit={handleAddExpense}
        submitText='Add'
      >
        <div className='form-group'>
          <label className='form-label'>Category</label>
          <select
            className='form-control'
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Books</option>
            <option>Clothing</option>
            <option>Other</option>
          </select>
        </div>
        <div className='form-group'>
          <label className='form-label'>Amount</label>
          <input
            type='number'
            className='form-control'
            placeholder='0.00'
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>
        <div className='form-group'>
          <label className='form-label'>Date</label>
          <input
            type='date'
            className='form-control'
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className='form-group'>
          <label className='form-label'>Description</label>
          <input
            type='text'
            className='form-control'
            placeholder='Brief description'
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </Modal>

      {expenses.length === 0 ? (
        <EmptyState
          icon='📭'
          title='No Expenses Yet'
          message='Start tracking your expenses by adding your first entry.'
          action={
            <button className='btn btn-primary' onClick={() => setShowModal(true)}>
              Add First Expense
            </button>
          }
        />
      ) : (
        <table className='table'>
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
                <td>{formatINR(expense.amount)}</td>
                <td>{expense.date}</td>
                <td>
                  <button
                    className='btn btn-sm btn-danger'
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

/* ============================================
   PORTFOLIO PAGE
   ============================================ */
export function PortfolioPage() {
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(false)
      setPortfolio(mockPortfolio)
    }
    loadPortfolio()
  }, [])

  if (loading) return <Loading />

  const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0)

  return (
    <div>
      <StatCard
        label='Portfolio Value'
        value={formatINR(totalValue)}
        change='+12% YTD'
        icon='📈'
      />

      <Card title='Holdings' style={{ marginTop: '30px' }}>
        {portfolio.length === 0 ? (
          <EmptyState title='No Holdings' message='Start building your portfolio' />
        ) : (
          <table className='table' style={{ marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.symbol}</strong></td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatINR(item.price)}</td>
                  <td>{formatINR(item.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

/* ============================================
   RISK CALCULATOR PAGE
   ============================================ */
export function RiskCalculatorPage() {
  const [formData, setFormData] = useState({ income: '', savings: '', age: '25', goals: 'balanced' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await calculateRisk(formData)
      setResult(response)
    } catch (error) {
      console.error('Error calculating risk:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card title='Calculate Your Risk Profile'>
        <form onSubmit={handleCalculate}>
          <div className='form-row'>
            <div className='form-group'>
              <label className='form-label'>Monthly Income (₹)</label>
              <input
                type='number'
                className='form-control'
                required
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
              />
            </div>
            <div className='form-group'>
              <label className='form-label'>Monthly Savings (₹)</label>
              <input
                type='number'
                className='form-control'
                required
                value={formData.savings}
                onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label className='form-label'>Age</label>
              <input
                type='number'
                className='form-control'
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className='form-group'>
              <label className='form-label'>Investment Goal</label>
              <select className='form-control' value={formData.goals} onChange={(e) => setFormData({ ...formData, goals: e.target.value })}>
                <option value='conservative'>Conservative</option>
                <option value='balanced'>Balanced</option>
                <option value='aggressive'>Aggressive</option>
              </select>
            </div>
          </div>

          <button type='submit' className='btn btn-primary' disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Risk Profile'}
          </button>
        </form>
      </Card>

      {result && (
        <Card title='Your Risk Profile' style={{ marginTop: '30px' }}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#00C853', marginBottom: '10px' }}>
              {result.risk_level}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
              Savings Rate: {result.savings_rate?.toFixed(1) || 'N/A'}%
            </div>
            <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
              <strong>Recommendation:</strong>
              <p style={{ color: '#64748b', marginTop: '10px' }}>
                {result.recommendation}
              </p>
            </div>
            {result.allocation && (
              <div style={{ textAlign: 'left', lineHeight: '1.8', marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                <strong>Recommended Allocation:</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' }}>
                  {Object.entries(result.allocation).map(([asset, percentage]) => (
                    <div key={asset} style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', fontSize: '14px' }}>
                      <strong>{asset}</strong>
                      <div style={{ color: '#00C853', fontSize: '18px', fontWeight: '700' }}>{percentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

/* ============================================
   INVESTMENT GUIDE PAGE
   ============================================ */
export function InvestmentGuidePage() {
  const [savings, setSavings] = useState('')
  const [advice, setAdvice] = useState(null)

  const handleGetAdvice = async () => {
    if (savings) {
      const data = await getInvestmentAdvice(parseFloat(savings))
      setAdvice(data)
    }
  }

  return (
    <div>
      <Card title='Get Investment Advice'>
        <div className='form-group' style={{ maxWidth: '400px' }}>
          <label className='form-label'>Monthly Savings Amount (₹)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type='number'
              className='form-control'
              placeholder='Enter amount'
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
            />
            <button className='btn btn-primary' onClick={handleGetAdvice}>
              Get Advice
            </button>
          </div>
        </div>
      </Card>

      {advice && (
        <Card title='Personalized Advice' style={{ marginTop: '30px' }}>
          <div style={{ padding: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>
              Risk Level: <Badge text={advice.risk_level} type='green' />
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.8', marginBottom: '20px' }}>
              {advice.recommendation}
            </p>
            <p style={{ fontSize: '12px', color: '#f44336', fontStyle: 'italic' }}>
              {advice.disclaimer}
            </p>
          </div>
        </Card>
      )}

      <Card title='Investment Fundamentals' style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4>📚 Diversification</h4>
            <p style={{ color: '#64748b', marginTop: '5px' }}>Spread investments across different asset classes to reduce risk.</p>
          </div>
          <div>
            <h4>⏱️ Time Horizon</h4>
            <p style={{ color: '#64748b', marginTop: '5px' }}>Longer investment periods allow for higher risk exposure.</p>
          </div>
          <div>
            <h4>💰 Emergency Fund</h4>
            <p style={{ color: '#64748b', marginTop: '5px' }}>Keep 3-6 months of expenses in liquid savings before investing.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ============================================
   MARKET DASHBOARD PAGE
   ============================================ */
export function MarketDashboardPage() {
  const [marketData, setMarketData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const data = await getMarketData()
      setMarketData(data)
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) return <Loading />

  return (
    <div>
      <div className='kpi-grid'>
        <StatCard label='Nifty 50' value={marketData?.nifty} icon='📈' color='#00C853' />
        <StatCard label='Sensex' value={marketData?.sensex} icon='📊' color='#00BCD4' />
        <StatCard label='Gold (oz)' value={formatINR(marketData?.gold)} icon='⭐' color='#FFC107' />
        <StatCard label='Bitcoin' value={`$${marketData?.bitcoin}`} icon='₿' color='#FF5722' />
      </div>

      <Card title='Market Trends' style={{ marginTop: '30px' }}>
        <BarChart
          title='Asset Performance'
          data={[
            { label: 'Stocks', value: 8.5 },
            { label: 'Bonds', value: 2.3 },
            { label: 'Gold', value: 5.1 },
            { label: 'Crypto', value: 12.4 },
          ]}
          maxValue={15}
        />
      </Card>
    </div>
  )
}

/* ============================================
   FINANCE NEWS PAGE (Full Width)
   ============================================ */
export function FinanceNewsPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNews = async () => {
      const data = await getNews()
      setNews(data || mockNews)
      setLoading(false)
    }
    loadNews()
  }, [])

  if (loading) return <Loading />

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Latest Financial News</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {news.map((article, idx) => (
          <Card key={idx} title={article.title}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#64748b', marginBottom: '10px' }}>
                  {article.source} • {article.published_at?.split('T')[0] || 'Unknown'}
                </p>
              </div>
              <button className='btn btn-secondary btn-sm'>
                Read More →
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ============================================
   EDUCATION PAGE
   ============================================ */
export function EducationPage() {
  const [courses, setCourses] = useState(mockEducation)

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Learn & Grow</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {courses.map((course) => (
          <Card key={course.id} title={course.title}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <Badge text={course.category} type='amber' />
                <p style={{ color: '#64748b', margin: '10px 0', fontSize: '14px' }}>
                  {course.description}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  ⏱️ {course.duration}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                {course.completed ? (
                  <Badge text='Completed' type='green' />
                ) : (
                  <button className='btn btn-secondary btn-sm'>
                    Start Course
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ============================================
   ACHIEVEMENTS PAGE
   ============================================ */
export function AchievementsPage() {
  const [achievements] = useState(mockAchievements)

  return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Your Achievements</h2>

      <div className='kpi-grid'>
        {achievements.map((achievement) => (
          <Card key={achievement.id} style={{ textAlign: 'center', opacity: achievement.unlocked ? 1 : 0.6 }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>
              {achievement.icon}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '5px' }}>
              {achievement.title}
            </h3>
            <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '15px' }}>
              {achievement.description}
            </p>
            {achievement.unlocked ? (
              <Badge text='Unlocked' type='green' />
            ) : (
              <Badge text='Locked' type='red' />
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
