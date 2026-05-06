// src/App.jsx

import { useState } from 'react'
import SettingsPanel    from './components/SettingsPanel'
import UploadPanel      from './components/UploadPanel'
import ResultDashboard  from './components/ResultDashboard'
import LoginModal       from './components/LoginModal'
import './app.css'

export default function App() {
  // ── 전역 state ──
  const [user,     setUser]     = useState(null)   // { name, id } | null
  const [showLogin, setShowLogin] = useState(false)

  const [settings, setSettings] = useState({ studentId: '22', track: '일반' })
  const [courses,  setCourses]  = useState([])
  const [result,   setResult]   = useState(null)

  const step = result
    ? 'result'
    : courses.length > 0
    ? 'upload'
    : 'settings'

  const STEPS     = ['정보 입력', '성적 업로드', '결과 확인']
  const STEP_KEYS = ['settings', 'upload', 'result']
  const currentIdx = STEP_KEYS.indexOf(step)

  const reset = () => {
    setCourses([])
    setResult(null)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setUser(null)
    reset()
  }

  return (
    <div className="app-root">

      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="logo-mark">✦</span>
            <span className="logo-text">졸업요건 계산기</span>
            <span className="logo-divider">|</span>
            <span className="logo-sub">소프트웨어학부</span>
          </div>

          <div className="header-user">
            {user ? (
              <>
                <span className="user-label">{user.name}님 환영합니다!</span>
                <div className="user-avatar">{user.name[0]}</div>
                <button className="btn-logout" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <button className="btn-login" onClick={() => setShowLogin(true)}>
                로그인
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">

        {/* ── Step indicator ── */}
        <div className="step-indicator">
          {STEPS.map((label, i) => {
            const status = i < currentIdx ? 'done' : i === currentIdx ? 'active' : 'idle'
            return (
              <div key={label} className="step-item">
                <div className={`step-circle step-circle--${status}`}>
                  {i < currentIdx ? '✓' : i + 1}
                </div>
                <span className={`step-label step-label--${status}`}>{label}</span>
                {i < 2 && (
                  <div className={`step-line ${i < currentIdx ? 'step-line--done' : ''}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* ── 화면 렌더링 ── */}
        {step === 'settings' && (
          <SettingsPanel
            settings={settings}
            onChange={setSettings}
            onNext={() => setCourses([{ _placeholder: true }])}
          />
        )}

        {step === 'upload' && (
          <UploadPanel
            settings={settings}
            onParsed={(parsed) => {
              setCourses(parsed)
              setResult({ _calculated: true })
            }}
          />
        )}

        {step === 'result' && (
          <ResultDashboard
            courses={courses}
            settings={settings}
            onReset={reset}
          />
        )}

      </main>

      {/* ── 로그인 모달 ── */}
      {showLogin && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}

    </div>
  )
}