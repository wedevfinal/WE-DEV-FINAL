/* Layout Components - Sidebar and Navbar */
import React from 'react'

/* ============================================
   SIDEBAR COMPONENT
   ============================================ */
export function Sidebar({ currentPage, onPageChange, userInfo }) {
    const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'expense-tracker', label: 'Expense Tracker', icon: '💸' },
    { id: 'portfolio', label: 'Portfolio', icon: '📈' },
    { id: 'investment-guide', label: 'Investment Guide', icon: '🗺️' },
    { id: 'market-dashboard', label: 'Market Dashboard', icon: '📊' },
    { id: 'finance-news', label: 'Finance News', icon: '📰' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
  ]

  return (
    <div className='sidebar'>
      <div className='sidebar-logo' onClick={() => onPageChange('dashboard')}>
        <span>💹</span>
        <span>WeDev</span>
      </div>

      <nav className='sidebar-nav'>
        {pages.map((page) => (
          <div
            key={page.id}
            className={`nav-item ${currentPage === page.id ? 'active' : ''}`}
            onClick={() => onPageChange(page.id)}
          >
            <span>{page.icon}</span>
            <span>{page.label}</span>
          </div>
        ))}
      </nav>

      <div className='sidebar-footer' style={{ cursor: 'pointer' }} onClick={() => onPageChange('account')}>
        <div className='user-profile'>
          <div className='user-avatar'>
            {userInfo?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>ACCOUNT</div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#ffffff' }}>
              {userInfo?.name || 'User'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   NAVBAR COMPONENT
   ============================================ */
export function Navbar({ pageTitle, userInfo, onLogout }) {
  return (
    <div className='navbar'>
      <h1 className='navbar-title'>{pageTitle}</h1>
      <div className='navbar-user'>
        <span style={{ fontSize: '14px', color: '#64748b' }}>
          👤 {userInfo?.name || 'User'}
        </span>
        <button className='logout-btn' onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

/* ============================================
   LAYOUT WRAPPER
   ============================================ */
export function Layout({ currentPage, onPageChange, onLogout, userInfo, children }) {
  const getPageTitle = () => {
    const pages = {
      'dashboard': 'Dashboard',
      'expense-tracker': 'Expense Tracker',
      'portfolio': 'Portfolio',
         'investment-guide': 'Investment Guide',
      'account': 'Account',
      'market-dashboard': 'Market Dashboard',
      'finance-news': 'Finance News',
      'education': 'Education',
      'achievements': 'Achievements',
    }
    return pages[currentPage] || 'WeDev'
  }

  return (
    <div className='layout'>
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} userInfo={userInfo} />
      <div className='main-container'>
        <Navbar
          pageTitle={getPageTitle()}
          userInfo={userInfo}
          onLogout={onLogout}
        />
        <div className='content'>
          {children}
        </div>
      </div>
    </div>
  )
}
