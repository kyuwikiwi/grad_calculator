// src/App.jsx

import { useState } from 'react'
<<<<<<< HEAD
import SettingsPanel    from './components/SettingsPanel'
import UploadPanel      from './components/UploadPanel'
import ResultDashboard  from './components/ResultDashboard'
import LoginModal       from './components/LoginModal'

export default function App() {
  // ── 전역 state ──
  const [user,      setUser]      = useState(null)   // { name, id } | null
  const [showLogin, setShowLogin] = useState(false)
=======
import SettingsPanel   from './components/SettingsPanel'
import UploadPanel     from './components/UploadPanel'
import ResultDashboard from './components/ResultDashboard'
import LoginModal      from './components/LoginModal'
import ManualAddModal  from './components/ManualAddModal'
import './app.css'

export default function App() {
  // ── 전역 state ──
  const [user,          setUser]          = useState(null)
  const [showLogin,     setShowLogin]     = useState(true)  // 첫 화면 = 로그인
  const [showManualAdd, setShowManualAdd] = useState(false)
>>>>>>> 311f10f74c4adaddd6ba819f93647cfc5cd96b87

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

<<<<<<< HEAD
  const reset = () => {
    setCourses([])
    setResult(null)
  }
=======
  const reset = () => { setCourses([]); setResult(null) }
>>>>>>> 311f10f74c4adaddd6ba819f93647cfc5cd96b87

  const handleLogin = (userData) => {
    setUser(userData)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setUser(null)
<<<<<<< HEAD
    reset()
  }

=======
    setShowLogin(true)
    reset()
  }

  // 수기 입력 과목 추가 — courses에 합산 후 결과 재계산
  const handleManualAdd = (newCourse) => {
    setCourses(prev => [...prev, newCourse])
    setShowManualAdd(false)
  }

>>>>>>> 311f10f74c4adaddd6ba819f93647cfc5cd96b87
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
<<<<<<< HEAD

=======
>>>>>>> 311f10f74c4adaddd6ba819f93647cfc5cd96b87
          <div className="header-user">
            {user ? (
              <>
                <span className="user-label">{user.name}님 환영합니다!</span>
                <div className="user-avatar">{user.name[0]}</div>
<<<<<<< HEAD
                <button className="btn-logout" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <button className="btn-login" onClick={() => setShowLogin(true)}>
                로그인
              </button>
=======
                <button className="btn-logout" onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <button className="btn-login" onClick={() => setShowLogin(true)}>로그인</button>
>>>>>>> 311f10f74c4adaddd6ba819f93647cfc5cd96b87
            )}
          </div>
        </div>
      </header>

      <main className="app-main">

<<<<<<< HEAD
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
=======
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
                onManualAdd={() => setShowManualAdd(true)}
              />
            )}
          </>
>>>>>>> 311f10f74c4adaddd6ba819f93647cfc5cd96b87
        )}

      </main>

<<<<<<< HEAD
      {/* ── 로그인 모달 ── */}
      {showLogin && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
=======
      {/* ── 로그인 모달 — 닫기 불가 (첫 화면) ── */}
      {showLogin && (
        <LoginModal
          onLogin={handleLogin}
          onClose={user ? () => setShowLogin(false) : null}
        />
      )}

      {/* ── 수기 입력 모달 ── */}
      {showManualAdd && (
        <ManualAddModal
          onAdd={handleManualAdd}
          onClose={() => setShowManualAdd(false)}
>>>>>>> 311f10f74c4adaddd6ba819f93647cfc5cd96b87
        />
      )}

    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 311f10f74c4adaddd6ba819f93647cfc5cd96b87
