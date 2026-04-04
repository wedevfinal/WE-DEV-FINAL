/* Reusable UI Components */
import React, { useEffect, useState } from 'react'

/* ============================================
   TOAST COMPONENT
   ============================================ */
export function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className={`toast ${type}`}>
      {message}
    </div>
  )
}

/* ============================================
   MODAL COMPONENT
   ============================================ */
export function Modal({ isOpen, title, children, onClose, onSubmit, submitText = 'Save', cancelText = 'Cancel' }) {
  if (!isOpen) return null

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2 className='modal-title'>{title}</h2>
          <button className='modal-close' onClick={onClose}>×</button>
        </div>
        <div>
          {children}
        </div>
        <div className='modal-actions'>
          <button className='btn btn-secondary' onClick={onClose}>
            {cancelText}
          </button>
          <button className='btn btn-primary' onClick={onSubmit}>
            {submitText}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   PROGRESS RING COMPONENT
   ============================================ */
export function ProgressRing({ percentage, label, size = 200 }) {
  const radius = (size - 16) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className='progress-ring-container'>
      <div className='progress-ring' style={{ width: size, height: size }}>
        <svg className='progress-ring-svg' width={size} height={size}>
          <circle
            className='progress-ring-bg'
            cx={size / 2}
            cy={size / 2}
            r={radius}
          />
          <circle
            className='progress-ring-circle'
            cx={size / 2}
            cy={size / 2}
            r={radius}
            style={{ strokeDashoffset: offset }}
          />
        </svg>
        <div className='progress-ring-value'>
          <div className='progress-ring-value-number'>
            {percentage}%
          </div>
          <div className='progress-ring-value-label'>
            {label}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   STAT CARD COMPONENT
   ============================================ */
export function StatCard({ label, value, change, icon, color = 'green' }) {
  return (
    <div className='stat-card' style={{ borderLeftColor: color, borderLeftWidth: '4px' }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>
        {icon}
      </div>
      <div className='stat-card-label'>{label}</div>
      <div className='stat-card-value'>{value}</div>
      {change && (
        <div className='stat-card-change'>
          {change}
        </div>
      )}
    </div>
  )
}

/* ============================================
   CARD COMPONENT
   ============================================ */
export function Card({ title, children, actions = null }) {
  return (
    <div className='card'>
      {title && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{title}</h3>
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

/* ============================================
   BADGE COMPONENT
   ============================================ */
export function Badge({ text, type = 'green' }) {
  return (
    <span className={`badge badge-${type}`}>
      {text}
    </span>
  )
}

/* ============================================
   ANIMATED VALUE COMPONENT
   ============================================ */
export function AnimatedValue({ value, duration = 1000, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTime = null
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      if (typeof value === 'number') {
        setDisplayValue(Math.floor(value * progress))
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{prefix}{displayValue}{suffix}</span>
}

/* ============================================
   SIMPLE BAR CHART COMPONENT
   ============================================ */
export function BarChart({ data, title, maxValue }) {
  const maxVal = maxValue || Math.max(...data.map(d => d.value))

  return (
    <div className='chart-container'>
      <div className='chart-title'>{title}</div>
      <div className='simple-chart'>
        {data.map((item, idx) => (
          <div key={idx} style={{ flex: 1, position: 'relative', height: '100%' }}>
            <div
              className='chart-bar'
              style={{
                height: `${(item.value / maxVal) * 100}%`,
              }}
            >
              <div className='chart-bar-value'>{item.value}</div>
            </div>
            <div className='chart-bar-label'>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================
   SIMPLE PIE CHART COMPONENT
   ============================================ */
export function SimpleChart({ data, title }) {
  return (
    <div className='chart-container'>
      <div className='chart-title'>{title}</div>
      <div style={{ display: 'flex', flexwrap: 'wrap', gap: '20px', marginTop: '20px' }}>
        {data.map((item, idx) => (
          <div key={idx} style={{ flex: 1, minWidth: '150px' }}>
            <div
              style={{
                background: item.color,
                height: '60px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              {item.label}: {item.percentage}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================
   LOADING COMPONENT
   ============================================ */
export function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
    }}>
      <div style={{
        animation: 'pulse 1.5s ease-in-out infinite',
        fontSize: '28px',
      }}>
        ⏳ Loading...
      </div>
    </div>
  )
}

/* ============================================
   EMPTY STATE COMPONENT
   ============================================ */
export function EmptyState({ icon = '📭', title, message, action = null }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      color: '#64748b',
    }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#1e293b' }}>
        {title}
      </h3>
      <p style={{ marginBottom: '20px' }}>
        {message}
      </p>
      {action && action}
    </div>
  )
}
