/* All Pages for WeDev Application */
import React, { useState, useEffect, useContext } from 'react'
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
  getAchievements,
  unlockAchievement,
  getInvestmentAdvice,
  getExpenses,
  getPortfolio,
  createPortfolioItem,
  deletePortfolioItem,
  calculateRisk,
  updateProfile,
  getFinancialProfile,
  createFinancialProfile,
  updateFinancialProfile,
  getEducationTopics,
  getEducationTopic,
} from './api'
import { mockNews, mockPortfolio, mockEducation, mockAchievements } from './data'
import { FinancialContext } from './contexts/FinancialContext'

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
  const { profile: ctxProfile } = useContext(FinancialContext)
  const profileObj = ctxProfile || profile || {}
  const monthlyIncome = profileObj?.monthly_income ?? 5000
  const monthlySavings = profileObj?.monthly_savings ?? (monthlyIncome ? Math.max(0, monthlyIncome - 2400) : 0)
  const investedAmount = profileObj?.investable_amount ?? 15000
  const savingsRate = monthlyIncome ? Math.round((monthlySavings / monthlyIncome) * 100) : 0

  return (
    <div>
      {/* show profile summary if available */}
      {profileObj && (
        <Card title='Profile Summary' style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>Monthly Income: {formatINR(profileObj.monthly_income || 0)}</div>
            <div>Monthly Savings: {formatINR(profileObj.monthly_savings || 0)}</div>
            <div>Investable: {formatINR(profileObj.investable_amount || 0)}</div>
            <div>Goal: {profileObj.risk_goal || '—'}</div>
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
export function ProfileSetupPage() {
  const { profile, saveProfile } = useContext(FinancialContext)
  const existing = profile || {}
  const [form, setForm] = useState({
    monthly_income: existing.monthly_income || '',
    monthly_savings: existing.monthly_savings || '',
    investable_amount: existing.investable_amount || '',
    risk_goal: existing.risk_goal || 'balanced',
    age: existing.age || '',
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
        age: form.age ? parseInt(form.age) : null,
      }

      // Validation: investable_amount <= monthly_savings
      if (payload.investable_amount && payload.monthly_savings && payload.investable_amount > payload.monthly_savings) {
        alert('Investable amount must be less than or equal to monthly savings')
        setLoading(false)
        return
      }

      const saved = await saveProfile(payload)
      // saved will be persisted in context/localStorage
      setForm({
        monthly_income: saved.monthly_income || '',
        monthly_savings: saved.monthly_savings || '',
        investable_amount: saved.investable_amount || '',
        risk_goal: saved.risk_goal || 'balanced',
        age: saved.age || '',
      })
      alert('Profile saved')
    } catch (err) {
      console.error('Failed to save profile', err)
      alert('Failed to save profile')
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

          <div className='form-group'>
            <label className='form-label'>Age</label>
            <input type='number' min='18' max='100' className='form-control' value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
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
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ symbol: '', name: '', quantity: '', price: '' })

  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true)
      try {
        const data = await getPortfolio()
        setPortfolio(Array.isArray(data) ? data : (data.portfolio_items || []))
      } catch (e) {
        setError('Unable to load portfolio')
        setPortfolio(mockPortfolio)
      }
      setLoading(false)
    }
    loadPortfolio()
  }, [])

  const totalValue = portfolio.reduce((sum, item) => sum + (item.value ?? ((item.current_price || item.price || 0) * (item.quantity || 0))), 0)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await createPortfolioItem(form)
      const data = await getPortfolio()
      setPortfolio(Array.isArray(data) ? data : (data.portfolio_items || []))
      setForm({ symbol: '', name: '', quantity: '', price: '' })
    } catch (err) {
      setError(err.message || 'Failed to add item')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deletePortfolioItem(id)
      setPortfolio((p) => p.filter(x => x.id !== id))
    } catch (err) {
      setError('Failed to delete item')
    }
  }

  return (
    <div>
      <StatCard
        label='Portfolio Value'
        value={formatINR(totalValue)}
        change='+12% YTD'
        icon='📈'
      />

      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        <div>
          <Card title='Holdings'>
            {loading ? (
              <Loading />
            ) : portfolio.length === 0 ? (
              <EmptyState title='No Investments' message='No investments added yet' />
            ) : (
              <table className='table' style={{ marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Value</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.symbol || item.asset_name}</strong></td>
                      <td>{item.asset_name || item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatINR(item.current_price || item.price || 0)}</td>
                      <td>{formatINR(item.value ?? ((item.current_price || item.price || 0) * item.quantity || 0))}</td>
                      <td><button className='btn btn-sm btn-danger' onClick={() => handleDelete(item.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ marginTop: 12, textAlign: 'right', fontWeight: 700 }}>
              Total: {formatINR(totalValue)}
            </div>
          </Card>
        </div>

        <div>
          <Card title='Add Investment'>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input name='symbol' placeholder='Symbol (e.g., AAPL)' value={form.symbol} onChange={handleChange} required />
              <input name='name' placeholder='Name (Company)' value={form.name} onChange={handleChange} required />
              <input name='quantity' placeholder='Quantity' value={form.quantity} onChange={handleChange} required type='number' step='any' />
              <input name='price' placeholder='Price per unit' value={form.price} onChange={handleChange} required type='number' step='any' />
              {error && <div style={{ color: 'red' }}>{error}</div>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className='btn btn-secondary' type='submit'>Add</button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   RISK CALCULATOR PAGE
   ============================================
*/
export function RiskCalculatorPage() {
  const { profile } = useContext(FinancialContext)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCalculate = async () => {
    if (!profile) {
      alert('Please complete your financial profile first')
      return
    }
    setLoading(true)
    try {
      const payload = {
        income: parseFloat(profile.monthly_income || 0),
        savings: parseFloat(profile.monthly_savings || 0),
        age: profile.age || null,
        goals: profile.risk_goal || 'balanced',
      }
      const resp = await calculateRisk(payload)
      setResult(resp)
    } catch (err) {
      console.error('Error calculating risk:', err)
      alert('Failed to calculate risk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card title='Calculate Your Risk Profile'>
        <div style={{ maxWidth: 600 }}>
          <p style={{ color: '#64748b' }}>This uses your stored financial profile. Click below to calculate your risk profile.</p>
          <button className='btn btn-primary' onClick={handleCalculate} disabled={loading || !profile}>
            {loading ? 'Calculating...' : 'Calculate Risk'}
          </button>
        </div>
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
   ACCOUNT PAGE
   ============================================
*/
export function AccountPage({ navigate }) {
  const { profile } = useContext(FinancialContext)
  let user = null
  try { user = JSON.parse(localStorage.getItem('user')) } catch { user = null }

  return (
    <div>
      <Card title='Account'>
        <div style={{ display: 'grid', gap: 10 }}>
          <div><strong>Name:</strong> {user?.name || '—'}</div>
          <div><strong>Email:</strong> {user?.email || '—'}</div>
          <div style={{ marginTop: 12 }}><strong>Financial Profile</strong></div>
          {profile ? (
            <div style={{ display: 'flex', gap: 20, flexDirection: 'column' }}>
              <div>Monthly Income: {formatINR(profile.monthly_income || 0)}</div>
              <div>Monthly Savings: {formatINR(profile.monthly_savings || 0)}</div>
              <div>Investable Amount: {formatINR(profile.investable_amount || 0)}</div>
              <div>Risk Goal: {profile.risk_goal || '—'}</div>
              <div>Age: {profile.age || '—'}</div>
            </div>
          ) : (
            <div>No financial profile found.</div>
          )}
          <div style={{ marginTop: 12 }}>
            <button className='btn btn-primary' onClick={() => navigate && navigate('profile-setup')}>Edit Profile</button>
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ============================================
   INVESTMENT GUIDE PAGE
   ============================================ */
export function InvestmentGuidePage() {
  const { profile } = useContext(FinancialContext)
  const [advice, setAdvice] = useState(null)
  const [loading, setLoading] = useState(false)

  const calculateAndAdvise = async () => {
    if (!profile) {
      alert('Please complete your financial profile first')
      return
    }
    setLoading(true)
    try {
      const payload = {
        income: parseFloat(profile.monthly_income || 0),
        savings: parseFloat(profile.monthly_savings || 0),
        age: profile.age || null,
        goals: profile.risk_goal || 'balanced',
      }
      const resp = await calculateRisk(payload)
      // Map risk to suggestions
      const risk = resp?.risk_level || 'Medium'
      let suggestions = []
      if (/low/i.test(risk)) suggestions = ['Fixed Deposits', 'Bonds']
      else if (/medium/i.test(risk)) suggestions = ['Mutual Funds', 'ETFs']
      else suggestions = ['Stocks', 'Crypto']

      setAdvice({ risk_level: risk, recommendation: resp?.recommendation || '', allocation: resp?.allocation || {}, suggestions })
    } catch (err) {
      console.error('Failed to calculate advice', err)
      alert('Unable to get advice right now')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Card title='Investment Advisor (Risk + Guide)'>
        <p style={{ color: '#64748b' }}>This advisor uses your stored financial profile to compute your risk level and recommended investments.</p>
        <div style={{ marginTop: 12 }}>
          <button className='btn btn-primary' onClick={calculateAndAdvise} disabled={loading || !profile}>{loading ? 'Working...' : 'Calculate & Advise'}</button>
        </div>
      </Card>

      {advice && (
        <Card title='Recommendations' style={{ marginTop: '20px' }}>
          <div style={{ padding: 16 }}>
            <h3>Risk Level: <Badge text={advice.risk_level} type='green' /></h3>
            <p style={{ color: '#64748b' }}>{advice.recommendation}</p>
            <h4>Suggested Instruments</h4>
            <ul>
              {advice.suggestions.map((s) => (<li key={s}>{s}</li>))}
            </ul>
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
      // if backend returned an empty array, fall back to mock data for UX
      setNews((data && data.length) ? data : mockNews)
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
              <a
                className='btn btn-secondary btn-sm'
                href={article.url || '#'}
                target="_blank"
                rel="noreferrer"
              >
                Read More →
              </a>
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
  const [topics, setTopics] = useState([])
  const [selected, setSelected] = useState(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await getEducationTopics()
        setTopics(res || mockEducation)
      } catch (e) {
        setTopics(mockEducation)
      }
      setLoading(false)
    }
    load()
  }, [])

  const openTopic = async (topicId) => {
    setSelected(topicId)
    setContent('')
    try {
      const res = await getEducationTopic(topicId)
      // Prefer rich content field if available
      const body = res?.content || res?.content || res
      setContent(body)
    } catch (e) {
      setContent('Unable to load topic content.')
    }
  }

  if (loading) return <Loading />

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px' }}>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Education Topics</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {topics.map((t) => (
            <Card key={t.topic_id || t.id} style={{ cursor: 'pointer', padding: '12px' }} onClick={() => openTopic(t.topic_id || t.id)}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: 50, height: 50, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                  📘
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '15px' }}>{t.title}</strong>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{t.duration || ''}</span>
                  </div>
                  <div style={{ color: '#64748b', marginTop: '6px', fontSize: '13px' }}>{t.description}</div>
                  {t.completed ? (
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div style={{ fontSize: 12, color: '#10b981' }}>Completed</div>
                      <div style={{ height: 6, background: '#e6eef6', flex: 1, borderRadius: 6 }}>
                        <div style={{ width: '100%', height: '100%', background: '#10b981', borderRadius: 6 }} />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '16px' }}>{selected ? (topics.find(x => (x.topic_id || x.id) === selected)?.title || 'Topic') : 'Select a topic'}</h3>
        <Card>
          {content ? (
            <div style={{ color: '#263238' }}>
              <ul style={{ paddingLeft: '1.1rem', margin: 0, color: '#263238' }}>
                {String(content).split('\n\n').map((point, i) => (
                  <li key={i} style={{ marginBottom: 10, lineHeight: 1.7 }}>{point}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div style={{ color: '#64748b' }}>Choose a topic to view detailed notes.</div>
          )}
        </Card>
      </div>
    </div>
  )
}

/* ============================================
   ACHIEVEMENTS PAGE
   ============================================ */
export function AchievementsPage() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  const [authRequired, setAuthRequired] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await getAchievements()
        // API returns { total_achievements, unlocked_count, achievements }
        // Do not show developer mock data for real users — use empty list if none.
        const list = res?.achievements ?? []
        // In development only, fallback to mockAchievements for faster UI testing
        if (list.length === 0 && process.env.NODE_ENV === 'development') {
          setAchievements(mockAchievements)
        } else {
          setAchievements(list)
        }
      } catch (e) {
        // If user is not authenticated, prompt to login.
        if (e?.response?.status === 401) {
          setAuthRequired(true)
        } else {
          // For other errors, avoid showing inbuilt mock achievements to real users.
          setAchievements([])
          console.error('Failed to load achievements', e)
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleUnlock = async (id) => {
    try {
      await unlockAchievement(id)
      setAchievements((prev) => prev.map(a => a.id === id ? { ...a, unlocked: true } : a))
    } catch (e) {
      console.error('Failed to unlock achievement', e)
    }
  }

  if (loading) return <Loading />

  if (authRequired) return (
    <div>
      <h2 style={{ marginBottom: '30px' }}>Your Achievements</h2>
      <div style={{ color: '#64748b' }}>Please log in to view your achievements.</div>
      <div style={{ marginTop: '20px' }}>
        <button className='btn btn-primary' onClick={() => (typeof navigate === 'function' ? navigate('account') : window.location.reload())}>
          Go to Login
        </button>
      </div>
    </div>
  )

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
              <>
                <Badge text='Locked' type='red' />
                <div style={{ marginTop: '10px' }}>
                  <button className='btn btn-primary btn-sm' onClick={() => handleUnlock(achievement.id)}>Unlock</button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
