// components/ResultDashboard.jsx
// props:
//   result   : MOCK_RESULT 형태 (백엔드 연결 전 mockData.js 사용)
//   settings : { studentId, track }
//   onReset  : () => void  — 처음으로 돌아가기

import { MOCK_RESULT } from '../data/mockData'

// 학점 비율에 따라 색상 결정
function barColor(pct) {
  if (pct >= 100) return 'bar--green'
  if (pct >= 80)  return 'bar--amber'
  return 'bar--red'
}

// 영역별 프로그레스 바 하나
function ProgressRow({ area }) {
  const pct = Math.min(100, Math.round((area.current / area.required) * 100))
  const isFull = pct >= 100

  return (
    <div className="progress-row">
      <div className="progress-meta">
        <span className="progress-name">{area.name}</span>
        <span className="progress-nums">
          {area.current} <span className="progress-slash">/</span> {area.required}학점
          {isFull && <span className="progress-check"> ✓</span>}
        </span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill ${barColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="progress-pct">{pct}%</span>
    </div>
  )
}

export default function ResultDashboard({ settings, onReset }) {
  // 백엔드 연결 시 props로 result 받아서 교체
  // 현재는 목업 데이터 사용
  const result = MOCK_RESULT

  const { verdict, areas, recommendations } = result
  const lacking = verdict.lacking

  return (
    <div className="result-wrap">

      {/* ── 판정 배너 ── */}
      <div className={`verdict-card ${verdict.canGraduate ? 'verdict-card--ok' : 'verdict-card--fail'}`}>
        <div className="verdict-icon">{verdict.canGraduate ? '🎓' : '📋'}</div>
        <div className="verdict-body">
          <p className="verdict-main">{verdict.message}</p>
          <p className="verdict-sub">
            {settings.studentId}학번 · {settings.track}과정 기준
            {!verdict.canGraduate && ` · 이번 학기 수강 포함 시 ${lacking - 3}학점 부족`}
          </p>
        </div>
      </div>

      {/* ── 영역별 게이지 ── */}
      <div className="panel result-panel">
        <div className="result-section-title">영역별 이수 현황</div>

        {/* 범례 */}
        <div className="legend">
          <span className="legend-item"><span className="legend-dot dot--green" />충족</span>
          <span className="legend-item"><span className="legend-dot dot--amber" />거의 충족</span>
          <span className="legend-item"><span className="legend-dot dot--red"   />부족</span>
        </div>

        <div className="progress-list">
          {areas.map(area => (
            <ProgressRow key={area.key} area={area} />
          ))}
        </div>
      </div>

      {/* ── 권장 수강 ── */}
      <div className="panel rec-panel">
        <div className="result-section-title">다음 학기 권장 수강</div>
        <ul className="rec-list">
          {recommendations.map((r, i) => (
            <li key={i} className="rec-item">
              <span className="rec-dot" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* ── 수기 추가 + 처음으로 ── */}
      <div className="result-actions">
        <button className="btn-secondary" onClick={onReset}>
          ← 처음으로
        </button>
        <button
          className="btn-outline-accent"
          onClick={() => alert('Day 4: 수기 입력 모달 연결 예정')}
        >
          ✍️ 수강 중인 과목 추가
        </button>
      </div>

    </div>
  )
}