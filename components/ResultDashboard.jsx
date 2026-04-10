// src/components/ResultDashboard.jsx

import { useEffect, useState } from 'react'

// ── 카테고리 분류 ──────────────────────────────────────────
function guessCategory(course) {
  if (course.category) return course.category

  const code = course.course_code || ''

  const majorRequiredCodes = ['SWE2001', 'SWE2007', 'SWE3001']
  if (majorRequiredCodes.includes(code)) return '전공필수'

  if (code.startsWith('SWE')) return '전공선택'

  const generalRequiredPrefixes = ['YHA', 'YHB', 'YHC', 'YHD', 'YHL', 'YHV', 'YHX', 'YHZ']
  if (generalRequiredPrefixes.some(prefix => code.startsWith(prefix))) return '필수교양'

  return '일반교양'
}

// ── 졸업요건 계산 ──────────────────────────────────────────
function calcResult(courses, track) {
  const REQ = { total: 135, major: 9, elective: 27, liberal: 43, required: 20 }

  const valid = (courses|| [])
    .filter(c => c.grade !== 'F')
    .map(c => ({ ...c, category: guessCategory(c) }))

  const sum = (filterFn) =>
    valid.filter(filterFn).reduce((acc, c) => acc + (c.credits || 0), 0)

  const total    = sum(() => true)
  const major    = sum(c => c.category === '전공필수')
  const elective = sum(c => c.category === '전공선택')
  const liberal  = sum(c => c.category === '일반교양')
  const required = sum(c => c.category === '필수교양')

  const areas = [
    { key: 'total',    name: '총 이수 학점', current: Math.round(total),    required: REQ.total    },
    { key: 'major',    name: '전공 필수',    current: Math.round(major),    required: REQ.major    },
    { key: 'elective', name: '전공 선택',    current: Math.round(elective), required: REQ.elective },
    { key: 'liberal',  name: '일반 교양',    current: Math.round(liberal),  required: REQ.liberal  },
    { key: 'required', name: '필수 교양',    current: Math.round(required), required: REQ.required },
  ].map(a => ({
    ...a,
    exceeded: a.current > a.required,
    excess:   Math.max(0, a.current - a.required),
  }))

  const lacking = areas.reduce((acc, a) => {
    const diff = a.required - a.current
    return acc + (diff > 0 ? diff : 0)
  }, 0)

  return {
    verdict: {
      canGraduate: lacking === 0,
      lacking,
      message: lacking === 0
        ? '졸업 요건을 모두 충족했어요! 🎉'
        : `졸업까지 ${lacking}학점이 더 필요해요`,
    },
    areas,
    recommendations: areas
      .filter(a => a.current < a.required)
      .map(a => `${a.name} ${a.required - a.current}학점`),
    exceeded: areas
      .filter(a => a.exceeded)
      .map(a => `${a.name} ${a.excess}학점 초과`),
  }
}

// ── 프로그레스 바 ──────────────────────────────────────────
function barColor(pct) {
  if (pct >= 100) return 'bar--green'
  if (pct >= 80)  return 'bar--amber'
  return 'bar--red'
}

function ProgressRow({ area }) {
  const pct      = Math.min(100, Math.round((area.current / area.required) * 100))
  const isFull   = pct >= 100
  const isExceeded = area.exceeded

  return (
    <div className="progress-row">
      <div className="progress-meta">
        <span className="progress-name">{area.name}</span>
        <span className="progress-nums">
          {area.current} <span className="progress-slash">/</span> {area.required}학점
          {isFull && !isExceeded && <span className="progress-check"> ✓</span>}
          {isExceeded && <span className="progress-exceeded"> +{area.excess}초과</span>}
        </span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill ${barColor(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-pct">{pct}%</span>
    </div>
  )
}

// ── 메인 컴포넌트 ──────────────────────────────────────────
export default function ResultDashboard({ courses, settings, onReset }) {
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = () => {
      try {
        setResult(calcResult(courses, settings.track))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courses, settings])

  if (loading) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '60px' }}>
        <p style={{ color: 'var(--text-2)', fontSize: '15px' }}>계산 중...</p>
      </div>
    )
  }

  const { verdict, areas, recommendations, exceeded } = result

  return (
    <div className="result-wrap">

      {/* 판정 배너 */}
      <div className={`verdict-card ${verdict.canGraduate ? 'verdict-card--ok' : 'verdict-card--fail'}`}>
        <div className="verdict-icon">{verdict.canGraduate ? '🎓' : '📋'}</div>
        <div className="verdict-body">
          <p className="verdict-main">{verdict.message}</p>
          <p className="verdict-sub">
            {settings.studentId}학번 · {settings.track}과정 기준
          </p>
        </div>
      </div>

      {/* 영역별 게이지 */}
      <div className="panel result-panel">
        <div className="result-section-title">영역별 이수 현황</div>
        <div className="legend">
          <span className="legend-item"><span className="legend-dot dot--green" />충족</span>
          <span className="legend-item"><span className="legend-dot dot--amber" />거의 충족</span>
          <span className="legend-item"><span className="legend-dot dot--red"   />부족</span>
        </div>
        <div className="progress-list">
          {areas.map(area => <ProgressRow key={area.key} area={area} />)}
        </div>
      </div>

      {/* 초과 영역 */}
      {exceeded.length > 0 && (
        <div className="panel" style={{ borderColor: '#C4B5FD' }}>
          <div className="result-section-title">초과 이수 영역</div>
          <ul className="rec-list">
            {exceeded.map((r, i) => (
              <li key={i} className="rec-item">
                <span className="rec-dot" style={{ background: '#7F77DD' }} />{r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 권장 수강 */}
      {recommendations.length > 0 && (
        <div className="panel rec-panel">
          <div className="result-section-title">다음 학기 권장 수강</div>
          <ul className="rec-list">
            {recommendations.map((r, i) => (
              <li key={i} className="rec-item">
                <span className="rec-dot" />{r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="result-actions">
        <button className="btn-secondary" onClick={onReset}>← 처음으로</button>
        <button
          className="btn-outline-accent"
          onClick={() => alert('수기 입력 모달 — 추후 구현')}
        >
          ✍️ 수강 중인 과목 추가
        </button>
      </div>

    </div>
  )
}
