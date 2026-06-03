// src/components/ResultDashboard.jsx

import { useEffect, useState, useRef } from 'react'
import { getGraduationResult } from '../api/api'
import TrackGuide from './TrackGuide'
import ExcludeModal from './ExcludeModal'

const COMMON_CODES = [
  { course_code: 'SWE3013', course_name: '소프트웨어공학',      credits: 3 },
  { course_code: 'SWE3016', course_name: '인공지능',            credits: 3 },
  { course_code: 'SWE3017', course_name: '데이터베이스',         credits: 3 },
  { course_code: 'SWE3018', course_name: '데이터마이닝',         credits: 3 },
  { course_code: 'SWE3019', course_name: '디지털신호처리',       credits: 3 },
  { course_code: 'SWE3020', course_name: '수치해석과최적화',     credits: 3 },
  { course_code: 'SWE3022', course_name: '임베디드시스템',       credits: 3 },
  { course_code: 'SWE3023', course_name: '컴퓨터네트워크',      credits: 3 },
  { course_code: 'SWE3024', course_name: '정보보안',             credits: 3 },
  { course_code: 'SWE4002', course_name: '웹서비스응용',         credits: 3 },
  { course_code: 'SWE4027', course_name: 'SW엔지니어소양세미나', credits: 1 },
  { course_code: 'SWE4028', course_name: '융합캡스톤디자인',     credits: 2 },
  { course_code: 'SWE4029', course_name: 'SW인턴십(1)',          credits: 1 },
  { course_code: 'SWE4030', course_name: 'SW인턴십(2)',          credits: 1 },
  { course_code: 'SWE4031', course_name: 'SW인턴십(3)',          credits: 1 },
  { course_code: 'SWE4032', course_name: 'SW인턴십(4)',          credits: 1 },
]

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

export default function ResultDashboard({ courses, settings, onReset, onManualAdd }) {
  const [result,          setResult]          = useState(null)
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState(null)
  const [excludedCourses, setExcludedCourses] = useState([])
  const [showExclude,     setShowExclude]     = useState(false)

  // ref로 최신 excludedCourses 값 유지 (클로저 문제 해결)
  const excludedRef = useRef([])

  const completedCodes  = new Set((courses || []).map(c => c.course_code))
  const availableCommon = COMMON_CODES.filter(c => completedCodes.has(c.course_code))

  const fetchResult = async (excluded) => {
    console.log('fetchResult 호출됨, excluded:', excluded)
    setLoading(true)
    setError(null)
    try {
      const data = await getGraduationResult(
        settings.studentId,
        settings.track,
        settings.subTrack,
        excluded
      )
      setResult(data)
    } catch (e) {
      setError('졸업요건 데이터를 불러오지 못했어요.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    excludedRef.current = []
    setExcludedCourses([])
    fetchResult([])
  }, [courses, settings])

  const handleExcludeConfirm = (codes) => {
    console.log('handleExcludeConfirm 호출됨:', codes) 
    excludedRef.current = codes
    setExcludedCourses(codes)
    setShowExclude(false)
    fetchResult(codes)
  }

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
            {settings.studentId}학번 · {settings.track}과정
            {isSim && settings.subTrack && settings.subTrack !== '선택 안 함' && ` · ${settings.subTrack} 트랙`} 기준
          </p>
        </div>
      </div>

      {/* 심화전공 중복인정 + 1전공 과목 선택 */}
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
          {availableCommon.length > 0 && (
            <button
              className="btn-outline"
              style={{ marginTop: '12px', width: '100%' }}
              onClick={() => setShowExclude(true)}
            >
              ✏️ 1전공으로 사용할 과목 선택
              {excludedCourses.length > 0 && ` (${excludedCourses.length}개 제외 중)`}
            </button>
          )}
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

      {/* 선배 추천 과목 */}
      <TrackGuide
        courses={courses}
        settings={settings}
        onAddCourse={onManualAdd}
      />

      {/* 하단 버튼 */}
      <div className="result-actions">
        <button className="btn-secondary" onClick={onReset}>← 처음으로</button>
        <button className="btn-outline-accent" onClick={() => onManualAdd()}>
          ✍️ 수강 중인 과목 추가
        </button>
      </div>

      {/* 1전공 과목 선택 모달 */}
      {showExclude && (
        <ExcludeModal
          commonCourses={availableCommon}
          excluded={excludedCourses}
          onConfirm={handleExcludeConfirm}
          onClose={() => setShowExclude(false)}
        />
      )}

    </div>
  )
}