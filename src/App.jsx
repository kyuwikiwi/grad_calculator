// src/App.jsx

import { useState } from 'react'
import SettingsPanel    from './components/SettingsPanel'
import UploadPanel      from './components/UploadPanel'
import ResultDashboard  from './components/ResultDashboard'
import ManualAddScreen  from './components/ManualAddScreen'
import LoginModal       from './components/LoginModal'
import ChatBot          from './components/ChatBot'
import './app.css'

export default function App() {
  // ── 전역 state ──
  const [user,      setUser]      = useState(null)
  const [showLogin, setShowLogin] = useState(true)

  const [settings, setSettings] = useState({ studentId: '22', track: '일반' })
  const [courses,  setCourses]  = useState([])
  const [result,   setResult]   = useState(null)
  const [step,     setStep]     = useState('settings') // settings | upload | result | manual

  const reset = () => {
    setCourses([])
    setResult(null)
    setStep('settings')
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setUser(null)
    setShowLogin(true)
    reset()
  }

  const handleManualAdd = (newCourse) => {
    setCourses(prev => [...prev, newCourse])
  }

  const STEPS     = ['정보 입력', '성적 업로드', '결과 확인']
  const STEP_KEYS = ['settings', 'upload', 'result']
  const currentIdx = STEP_KEYS.indexOf(step)

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
                <button className="btn-logout" onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <button className="btn-login" onClick={() => setShowLogin(true)}>로그인</button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">

        {/* 비로그인 시 안내 화면 */}
        {!user ? (
          <div className="login-gate">
            <div className="login-gate-icon">🎓</div>
            <h2 className="login-gate-title">소프트웨어학부 졸업요건 계산기</h2>
            <p className="login-gate-desc">
              로그인 후 성적표를 업로드하면<br />
              졸업까지 남은 학점을 바로 확인할 수 있어요.
            </p>
            <button className="btn-primary login-gate-btn" onClick={() => setShowLogin(true)}>
              로그인하기
            </button>
          </div>
        ) : (
          <>
            {/* ── Step indicator (manual 화면에서는 숨김) ── */}
            {step !== 'manual' && (
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
            )}

            {/* ── 화면 렌더링 ── */}
            {step === 'settings' && (
              <SettingsPanel
                settings={settings}
                onChange={setSettings}
                onNext={() => setStep('upload')}
              />
            )}

            {step === 'upload' && (
              <UploadPanel
                settings={settings}
                onParsed={(parsed) => {
                  setCourses(parsed)
                  setResult({ _calculated: true })
                  setStep('result')
                }}
              />
            )}

            {step === 'result' && (
              <ResultDashboard
                courses={courses}
                settings={settings}
                onReset={reset}
                onManualAdd={() => setStep('manual')}
              />
            )}

            {step === 'manual' && (
              <ManualAddScreen
                onAdd={handleManualAdd}
                onBack={() => setStep('result')}
              />
            )}
          </>
        )}

      </main>

      {/* ── 로그인 모달 ── */}
      {showLogin && (
        <LoginModal
          onLogin={handleLogin}
          onClose={user ? () => setShowLogin(false) : null}
        />
      )}

      {/* ── 챗봇 (로그인 후에만 표시) ── */}
      {user && (
        <ChatBot studentId={settings.studentId} track={settings.track} />
      )}

    </div>
  )
}