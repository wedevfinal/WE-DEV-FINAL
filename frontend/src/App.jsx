/* Main App Component */
import React, { useState, useEffect, useContext } from 'react'
import { Layout } from './layout'
import { Toast } from './ui-components'
import {
  DashboardPage,
  ProfileSetupPage,
  ExpenseTrackerPage,
  PortfolioPage,
  RiskCalculatorPage,
  
  AccountPage,
  MarketDashboardPage,
  FinanceNewsPage,
  EducationPage,
  AchievementsPage,
} from './pages'
import FinancialProvider, { FinancialContext } from './contexts/FinancialContext'
import { login as apiLogin, register as apiRegister, me as apiMe, getFinancialProfile } from './api'

/* ============================================
   AUTHENTICATION STATE
   ============================================ */
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  const formatAPIError = (data) => {
    try {
      if (!data) return 'Unknown error'
      if (typeof data === 'string') return data
      // Pydantic/fastapi validation errors come as an array of objects
      if (Array.isArray(data)) {
        return data.map(d => {
          try {
            const loc = Array.isArray(d.loc) ? d.loc.join('.') : d.loc
            return `${loc}: ${d.msg}`
          } catch { return JSON.stringify(d) }
        }).join('; ')
      }
      if (data.detail) {
        if (typeof data.detail === 'string') return data.detail
        if (Array.isArray(data.detail)) return formatAPIError(data.detail)
      }
      if (data.message) return String(data.message)
      return JSON.stringify(data)
    } catch (e) {
      return String(data)
    }
  }

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password)
      console.log('API /auth/login response:', data)
      if (!data || data.detail) {
        console.warn('Login failed, backend returned error payload:', data)
        return { ok: false, message: formatAPIError(data) }
      }
      if (data.access_token) localStorage.setItem('token', data.access_token)
      const user = data.user || { email }
      const info = { email: user.email, name: user.name || (email.split('@')[0]) }
      setUserInfo(info)
      localStorage.setItem('user', JSON.stringify(info))
      setIsAuthenticated(true)
      console.log('Login succeeded, stored token and user info')
      return { ok: true }
    } catch (err) {
      console.error('Login error', err)
      return { ok: false, message: 'Network error while logging in' }
    }
  }

  const register = async (name, email, password) => {
    // Accept optional extra fields by passing additional args via the 4th parameter
    // register(name, email, password, { phone, dob, isStudent })
    try {
      const extra = (arguments.length >= 4 && arguments[3]) ? arguments[3] : {}
      const payload = {
        name,
        email,
        password,
        phone: extra.phone || null,
        dob: extra.dob || null,
        is_student: !!extra.isStudent,
        age: extra.age ? parseInt(extra.age) : null,
        monthly_income: extra.monthly_income ? parseFloat(extra.monthly_income) : null,
        monthly_savings: extra.monthly_savings ? parseFloat(extra.monthly_savings) : null,
        investable_amount: extra.investable_amount ? parseFloat(extra.investable_amount) : null,
        risk_goal: extra.risk_goal || null,
      }

      const data = await apiRegister(payload)
      if (!data || data.detail) return { ok: false, message: formatAPIError(data) }
      return { ok: true, user: data }
    } catch (err) {
      console.error('Register error', err)
      return { ok: false, message: 'Network error while registering' }
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserInfo(null)
    try { localStorage.removeItem('user'); localStorage.removeItem('token'); localStorage.removeItem('financial_profile') } catch {}
  }

  const checkAuth = async () => {
    // If token exists validate it with /auth/me
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsAuthenticated(false)
        setUserInfo(null)
        return
      }
      const data = await apiMe()
      if (data && !data.detail) {
        const info = { email: data.email, name: data.name || data.email.split('@')[0] }
        setUserInfo(info)
        localStorage.setItem('user', JSON.stringify(info))
        setIsAuthenticated(true)
        return
      }
    } catch (err) {
      console.warn('Token validation failed', err)
    }
    // fallback: clear
    try { localStorage.removeItem('token'); localStorage.removeItem('user') } catch {}
    setIsAuthenticated(false)
    setUserInfo(null)
  }

  useEffect(() => { checkAuth() }, [])

  return { isAuthenticated, userInfo, login, logout, register }
}

/* ============================================
   LOGIN COMPONENT
   ============================================ */
function LoginPage({ onLogin, onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [age, setAge] = useState('')
  const [isStudent, setIsStudent] = useState(false)
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [monthlySavings, setMonthlySavings] = useState('')
  const [investableAmount, setInvestableAmount] = useState('')
  const [riskGoal, setRiskGoal] = useState('balanced')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    console.log('Login submit triggered', { email, password })
    if (isRegister) {
      if (!name || !email || !password) {
        setError('Please fill in all fields')
        return
      }
      if (!email.includes('@')) {
        setError('Please enter a valid email')
        return
      }
      try {
        const profileExtras = {
          phone,
          dob,
          age,
          isStudent,
        }
        // If you want profile fields on registration, we can extend the form later.
        const result = await onRegister(name, email, password, profileExtras)
        if (!result.ok) {
          setError(result.message || 'Registration failed')
          return
        }
        // auto-login after register
        const loginRes = await onLogin(email, password)
        if (!loginRes || loginRes.ok === false) {
          setError(loginRes?.message || 'Registration succeeded but login failed')
        }
      } catch (err) {
        console.error('onRegister error', err)
        setError('Unexpected error during registration')
      }
      return
    }

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email')
      return
    }
    try {
      setError('')
      const result = await onLogin(email, password)
      if (!result || result.ok === false) {
        setError(result?.message || 'Login failed')
      }
    } catch (err) {
      console.error('onLogin error', err)
      setError('Unexpected error during login')
    }
  }

  return (
    <div className='auth-wrapper' style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '60px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>💹</div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
            WeDev
          </h1>
          <p style={{ color: '#64748b' }}>
            AI-Powered Wealth Developer Dashboard
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button className={`btn ${!isRegister ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setIsRegister(false); setError('') }}>
            Sign In
          </button>
          <button className={`btn ${isRegister ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setIsRegister(true); setError('') }}>
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className='form-group'>
              <label className='form-label'>Full Name</label>
              <input
                type='text'
                className='form-control'
                placeholder='Your full name'
                value={name}
                onChange={(e) => { setName(e.target.value); setError('') }}
              />
            </div>
          )}
          {isRegister && (
            <>
              <div className='form-group'>
                <label className='form-label'>Phone Number</label>
                <input type='tel' className='form-control' placeholder='+91...' value={phone} onChange={(e) => { setPhone(e.target.value); setError('') }} />
              </div>

              <div className='form-group'>
                <label className='form-label'>Date of Birth</label>
                <input type='date' className='form-control' value={dob} onChange={(e) => { setDob(e.target.value); setError('') }} />
              </div>

              <div className='form-group'>
                <label className='form-label'>Age</label>
                <input type='number' min='18' max='100' className='form-control' value={age} onChange={(e) => { setAge(e.target.value); setError('') }} />
              </div>

              <div className='form-group'>
                <label className='form-label'>Are you a student / intern?</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input id='isStudent' type='checkbox' checked={isStudent} onChange={(e) => setIsStudent(e.target.checked)} />
                  <label htmlFor='isStudent' style={{ fontSize: '13px', color: '#64748b' }}>Yes, I'm a student / intern</label>
                </div>
              </div>
            </>
          )}

          {/* Financial inputs removed from signup — collect them in Profile Setup after login */}
          <div className='form-group'>
            <label className='form-label'>Email Address</label>
            <input
              type='email'
              className='form-control'
              placeholder='your@email.com'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>Password</label>
            <input
              type='password'
              className='form-control'
              placeholder='Enter any password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '10px 15px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          <button
            type='button'
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #00C853, #00BCD4)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Login to WeDev
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '10px',
          fontSize: '13px',
          color: '#64748b',
        }}>
          🔐 Secure Mode: Log in with your registered account
        </div>
      </div>
    </div>
  )
}

/* ============================================
   MAIN APP COMPONENT
   ============================================ */
function AppContent() {
  const { isAuthenticated, userInfo, login, logout, register } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [toast, setToast] = useState(null)
  const { profile, setProfile, loadProfile } = useContext(FinancialContext)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return
      try {
        const p = await getFinancialProfile()
        if (p) setProfile(p)
        const hasValues = p && (p.monthly_savings || p.monthly_income || p.investable_amount)
        if (!hasValues) setCurrentPage('profile-setup')
      } catch (e) {
        console.error('Failed to load profile', e)
      }
    }
    fetchProfile()
  }, [isAuthenticated])

  // Dev / quick reset: visiting ?reset=1 clears stored auth and forces login view
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('reset') === '1') {
        logout()
        try { localStorage.removeItem('token'); localStorage.removeItem('user'); localStorage.removeItem('financial_profile') } catch {}
        setCurrentPage('dashboard')
        // remove reset param from URL without reload
        const url = new URL(window.location.href)
        url.searchParams.delete('reset')
        window.history.replaceState({}, '', url.toString())
      }
    } catch {}
  }, [])

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} onRegister={register} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />
      case 'profile-setup':
        return <ProfileSetupPage />
      case 'expense-tracker':
        return <ExpenseTrackerPage />
      case 'portfolio':
        return <PortfolioPage />
      case 'investment-guide':
        return <RiskCalculatorPage />
      case 'account':
        return <AccountPage />
      case 'market-dashboard':
        return <MarketDashboardPage />
      case 'finance-news':
        return <FinanceNewsPage />
      case 'education':
        return <EducationPage />
      case 'achievements':
        return <AchievementsPage />
      default:
        return <DashboardPage />
    }
  }

  const handleLogout = () => {
    logout()
    setCurrentPage('dashboard')
  }

  return (
    <>
      <Layout
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
        userInfo={userInfo}
      >
        {(() => {
          const element = renderPage()
          try {
            if (React.isValidElement(element)) return React.cloneElement(element, { navigate: setCurrentPage })
            return element
          } catch {
            return element
          }
        })()}
      </Layout>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <FinancialProvider>
      <AppContent />
    </FinancialProvider>
  )
}
