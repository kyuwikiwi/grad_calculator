// src/components/ResultDashboard.jsx

import { useEffect, useState } from 'react'
import { getGraduationResult } from '../api/api'
import TrackGuide from './TrackGuide'

// ── 프로그레스 바 색상 ─────────────────────────────────────
function barColor(pct) {
  if (pct >= 100) return 'bar--green'
  if (pct >= 80)  return 'bar--amber'
  return 'bar--red'
}

function ProgressRow({ area }) {
  const pct        = Math.min(100, Math.round((area.current / area.required) * 100))
  const isFull     = pct >= 100
  const isExceeded = area.current > area.required
  const excess     = Math.max(0, area.current - area.required)

  return (
    <div className="progress-row">
      <div className="progress-meta">
        <span className="progress-name">{area.name}</span>
        <span className="progress-nums">
          {area.current} <span className="progress-slash">/</span> {area.required}학점
          {isFull && !isExceeded && <span className="progress-check"> ✓</span>}
          {isExceeded && <span className="progress-exceeded"> +{excess}초과</span>}
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
export default function ResultDashboard({ courses, settings, onReset, onManualAdd }) {
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGraduationResult(settings.studentId, settings.track)
        setResult(data)
      } catch (e) {
        setError('졸업요건 데이터를 불러오지 못했어요.')
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

  if (error) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '60px' }}>
        <p style={{ color: '#E24B4A', fontSize: '15px' }}>{error}</p>
        <button className="btn-secondary" style={{ marginTop: '16px' }} onClick={onReset}>
          ← 처음으로
        </button>
      </div>
    )
  }

  const {
    is_graduated,
    areas,
    lacking_total,
    duplicate_credits,
    duplicate_limit,
  } = result

  const isSim = settings.track === '심화'

  // 초과된 영역
  const exceeded = areas
    .filter(a => a.current > a.required)
    .map(a => `${a.name} ${a.current - a.required}학점 초과`)

  return (
    <div className="result-wrap">

      {/* 판정 배너 */}
      <div className={`verdict-card ${is_graduated ? 'verdict-card--ok' : 'verdict-card--fail'}`}>
        <div className="verdict-icon">{is_graduated ? '🎓' : '📋'}</div>
        <div className="verdict-body">
          <p className="verdict-main">
            {is_graduated
              ? '졸업 요건을 모두 충족했어요! 🎉'
              : `졸업까지 ${lacking_total}학점이 더 필요해요`}
          </p>
          <p className="verdict-sub">
            {settings.studentId}학번 · {settings.track}과정 기준
          </p>
        </div>
      </div>

      {/* 심화전공 중복인정 카드 */}
      {isSim && duplicate_credits !== undefined && (
        <div className="panel duplicate-card">
          <div className="result-section-title">전공 중복인정 현황</div>
          <div className="duplicate-info">
            <div className="duplicate-row">
              <span className="duplicate-label">중복인정 학점</span>
              <span className="duplicate-value">
                {duplicate_credits}학점
                <span className="duplicate-limit"> / 최대 {duplicate_limit}학점</span>
              </span>
            </div>
            <div className="progress-track" style={{ marginTop: '8px' }}>
              <div
                className="progress-fill bar--green"
                style={{ width: `${Math.round((duplicate_credits / duplicate_limit) * 100)}%` }}
              />
            </div>
            <p className="duplicate-hint">
              기본전공과 심화전공 공통 과목 중 최대 {duplicate_limit}학점까지 심화전공 학점으로 인정돼요.
            </p>
          </div>
        </div>
      )}

      {/* 영역별 게이지 */}
      <div className="panel result-panel">
        <div className="result-section-title">영역별 이수 현황</div>
        <div className="legend">
          <span className="legend-item"><span className="legend-dot dot--green" />충족</span>
          <span className="legend-item"><span className="legend-dot dot--amber" />거의 충족</span>
          <span className="legend-item"><span className="legend-dot dot--red"   />부족</span>
        </div>
        <div className="progress-list">
          {areas.map((area, i) => <ProgressRow key={i} area={area} />)}
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

      {/* 트랙별 이수 가이드 */}
      <TrackGuide courses={courses} />

      {/* 하단 버튼 */}
      <div className="result-actions">
        <button className="btn-secondary" onClick={onReset}>← 처음으로</button>
        <button className="btn-outline-accent" onClick={onManualAdd}>
          ✍️ 수강 중인 과목 추가
        </button>
      </div>

    </div>
  )
}