// src/components/SettingsPanel.jsx

const STUDENT_IDS = ['19', '20', '21', '22', '23']
const TRACKS      = ['일반', '심화']
const SUB_TRACKS  = ['선택 안 함', 'AI빅데이터', 'AI미디어', 'AI계산과학', '스마트IoT', '정보보안']

export default function SettingsPanel({ settings, onChange, onNext }) {
  const update = (key, value) => onChange({ ...settings, [key]: value })

  const handleTrackChange = (track) => {
    onChange({
      ...settings,
      track,
      subTrack: track === '심화' ? '선택 안 함' : null,
    })
  }

  return (
    <div className="panel settings-panel">

      <div className="panel-hero">
        <h1 className="panel-title">안녕하세요 👋</h1>
        <p className="panel-desc">
          학번과 이수 과정을 선택하면<br />
          졸업까지 남은 학점을 바로 확인할 수 있어요.
        </p>
      </div>

      {/* 학번 선택 */}
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

      {/* 이수 과정 */}
      <div className="field-group">
        <label className="field-label">이수 과정</label>
        <div className="track-toggle">
          {TRACKS.map(t => (
            <button
              key={t}
              className={`track-btn ${settings.track === t ? 'track-btn--active' : ''}`}
              onClick={() => handleTrackChange(t)}
            >
              <span className="track-name">{t}과정</span>
              <span className="track-hint">
                {t === '일반' ? '일반 졸업요건 적용' : '심화 전공 졸업요건 적용'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 심화 트랙 선택 */}
      {settings.track === '심화' && (
        <div className="field-group">
          <label className="field-label">심화 트랙</label>
          <div className="subtrack-list">
            {SUB_TRACKS.map(t => (
              <button
                key={t}
                className={`subtrack-btn ${settings.subTrack === t ? 'subtrack-btn--active' : ''}`}
                onClick={() => update('subTrack', t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 선택 요약 */}
      <div className="summary-box">
        <span className="summary-icon">📋</span>
        <span className="summary-text">
          <strong>{settings.studentId}학번</strong> · <strong>{settings.track}과정</strong>
          {settings.track === '심화' && settings.subTrack && settings.subTrack !== '선택 안 함' && (
            <> · <strong>{settings.subTrack} 트랙</strong></>
          )}
          {' '}기준으로 계산합니다
        </span>
      </div>

      <button className="btn-primary" onClick={onNext}>
        성적표 업로드하기 →
      </button>

    </div>
  )
}