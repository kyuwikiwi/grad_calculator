import { useState } from 'react'
import SettingsPanel from './components/SettingsPanel'
import UploadPanel from './components/UploadPanel'
import ResultDashboard from './components/ResultDashboard'
import './app.css'

export default function App() {
  const [settings, setSettings] = useState({ studentId: '22', track: '일반' })
  const [courses, setCourses]   = useState([])
  const [result,  setResult]    = useState(null)

  const step = result ? 'result' : courses.length > 0 ? 'upload' : 'settings'
  const STEPS = ['정보 입력', '성적 업로드', '결과 확인']
  const STEP_KEYS = ['settings', 'upload', 'result']
  const currentIdx = STEP_KEYS.indexOf(step)

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="logo-mark">✦</span>
            <span className="logo-text">졸업요건 계산기</span>
            <span className="logo-divider">|</span>
            <span className="logo-sub">소프트웨어학부</span>
          </div>
          <div className="header-user">
            <span className="user-label">4학년 지은님</span>
            <div className="user-avatar">지</div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="step-indicator">
          {STEPS.map((label, i) => {
            const status = i < currentIdx ? 'done' : i === currentIdx ? 'active' : 'idle'
            return (
              <div key={label} className="step-item">
                <div className={`step-circle step-circle--${status}`}>
                  {i < currentIdx ? '✓' : i + 1}
                </div>
                <span className={`step-label step-label--${status}`}>{label}</span>
                {i < 2 && <div className={`step-line ${i < currentIdx ? 'step-line--done' : ''}`} />}
              </div>
            )
          })}
        </div>

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
            onParsed={setCourses}
            onCalculated={setResult}
          />
        )}
        {step === 'result' && (
          <ResultDashboard
            settings={settings}
            onReset={() => { setCourses([]); setResult(null) }}
          />
        )}
      </main>
    </div>
  )
}