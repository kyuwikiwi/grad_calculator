const STUDENT_IDS = ['19', '20', '21', '22', '23']
const TRACKS = [
  { key: '일반', hint: '일반 졸업요건 적용' },
  { key: '심화', hint: '심화 전공 졸업요건 적용' },
]

export default function SettingsPanel({ settings, onChange, onNext }) {
  const update = (key, value) => onChange({ ...settings, [key]: value })

  return (
    <div className="panel settings-panel">
      <div className="panel-hero">
        <h1 className="panel-title">안녕하세요 👋</h1>
        <p className="panel-desc">
          학번과 이수 과정을 선택하면<br />
          졸업까지 남은 학점을 바로 확인할 수 있어요.
        </p>
      </div>

      <div className="field-group">
        <label className="field-label">학번</label>
        <div className="chip-row">
          {STUDENT_IDS.map(id => (
            <button
              key={id}
              className={`chip ${settings.studentId === id ? 'chip--active' : ''}`}
              onClick={() => update('studentId', id)}
            >
              {id}학번
            </button>
          ))}
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">이수 과정</label>
        <div className="track-toggle">
          {TRACKS.map(t => (
            <button
              key={t.key}
              className={`track-btn ${settings.track === t.key ? 'track-btn--active' : ''}`}
              onClick={() => update('track', t.key)}
            >
              <span className="track-name">{t.key}과정</span>
              <span className="track-hint">{t.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="summary-box">
        <span>📋</span>
        <span className="summary-text">
          <strong>{settings.studentId}학번</strong> · <strong>{settings.track}과정</strong> 기준으로 계산합니다
        </span>
      </div>

      <button className="btn-primary" onClick={onNext}>
        성적표 업로드하기 →
      </button>
    </div>
  )
}