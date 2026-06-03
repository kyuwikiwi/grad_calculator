// src/components/TrackGuide.jsx
// props:
//   courses      : 이수한 과목 목록
//   settings     : { studentId, track, subTrack }
//   onAddCourse  : (course) => void

import { useState, useEffect } from 'react'
import { getTrackStatistics } from '../api/api'

const COURSE_NAMES = {
  SWE3006: 'AI수학',
  SWE3007: '마이크로프로세서',
  SWE3008: '통신시스템',
  SWE3009: '암호학',
  SWE3011: '영상처리',
  SWE3012: '디지털통신',
  SWE3013: '소프트웨어공학',
  SWE3016: '인공지능',
  SWE3017: '데이터베이스',
  SWE3018: '데이터마이닝',
  SWE3019: '디지털신호처리',
  SWE3020: '수치해석과최적화',
  SWE3021: '그래프이론과활용',
  SWE3022: '임베디드시스템',
  SWE3023: '컴퓨터네트워크',
  SWE3024: '정보보안',
  SWE4002: '웹서비스응용',
  SWE4003: '기계학습개론',
  SWE4004: '빅데이터처리',
  SWE4005: '지능형멀티미디어시스템',
  SWE4006: '수치편미분방정식',
  SWE4007: '로봇알고리즘',
  SWE4008: '임베디드하드웨어설계',
  SWE4009: '데이터통신',
  SWE4015: '자연어처리',
  SWE4016: '바이오컴퓨팅',
  SWE4017: '정보검색',
  SWE4018: '스마트미디어통신',
  SWE4019: '모델링및시뮬레이션',
  SWE4020: '산업수학과역문제',
  SWE4021: 'IoT응용프로그래밍',
  SWE4022: '정보보안응용',
  SWE4023: '디지털포렌식',
  SWE_SE:  'SW엔지니어소양세미나',
}

export default function TrackGuide({ courses, settings, onAddCourse }) {
  const [statistics, setStatistics] = useState(null)
  const [open,       setOpen]       = useState(false)

  const selectedTrack = settings?.subTrack || null

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTrackStatistics()
        setStatistics(res)
      } catch (e) {
        console.error('트랙 통계 로드 실패', e)
      }
    }
    load()
  }, [])

  // 이미 이수한 과목 코드 목록
  const completedCodes = new Set(
    (courses || []).map(c => c.course_code)
  )

  // 티어 분류
  const getTiers = (track) => {
    if (!statistics || !statistics[track]) return { tier1: [], tier2: [] }
    const rates = statistics[track].course_rates || {}
    const tier1 = []
    const tier2 = []
    Object.entries(rates).forEach(([code, rate]) => {
      const name = COURSE_NAMES[code] || code
      const item = { code, name, rate }
      if (rate >= 80)       tier1.push(item)
      else if (rate >= 50)  tier2.push(item)
    })
    return { tier1, tier2 }
  }

  const { tier1, tier2 } = selectedTrack ? getTiers(selectedTrack) : { tier1: [], tier2: [] }

  const CourseCard = ({ item }) => {
    const isCompleted = completedCodes.has(item.code)
    return (
      <div className={`track-course-card ${isCompleted ? 'track-course-card--done' : ''}`}>
        <span className="track-course-card-name">{item.name}</span>
        {isCompleted ? (
          <span className="track-course-card-done">✓ 이수완료</span>
        ) : (
            // 수정
            <button
              style={{
                padding: '6px 12px',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
                border: '1px solid var(--accent-dim)',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginLeft: '12px',   // ← 간격 추가
                flexShrink: 0,        // ← 찌그러짐 방지
                fontFamily: 'inherit',
              }}
              onClick={() => onAddCourse?.({
                course_code:     item.code,
                course_name:     item.name,
                credits:         3,
                grade:           '수강중',
                category:        '전공선택',
                is_hybrid_added: true,
              })}
            >
              + 담기
            </button>
        )}
      </div>
    )
  }



  return (
    <div className="panel track-guide-panel">

      <div className="track-guide-header" onClick={() => setOpen(v => !v)}>
        <div>
          <div className="result-section-title" style={{ marginBottom: 0 }}>
            선배 추천 과목
            {selectedTrack && <span style={{ color: 'var(--accent)', marginLeft: '6px' }}>· {selectedTrack}</span>}
          </div>
          <p className="track-guide-sub">
            {selectedTrack
              ? `${selectedTrack} 트랙 선배들이 많이 들은 과목이에요`
              : '트랙을 선택하면 선배 추천 과목이 나타나요'}
          </p>
        </div>
        <span className="track-guide-arrow">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="track-guide-body">

          {!selectedTrack && (
            <p style={{ fontSize: '14px', color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>
              정보 입력 화면에서 심화 트랙을 선택해주세요
            </p>
          )}

          {selectedTrack && (
            <div className="track-tiers">

              {tier1.length > 0 && (
                <div className="track-tier">
                  <div className="track-tier-title track-tier-title--1">
                    🏆 선배들의 필수 픽  
                  </div>
                  <div className="track-tier-cards">
                    {tier1.map(item => <CourseCard key={item.code} item={item} />)}
                  </div>
                </div>
              )}

              {tier2.length > 0 && (
                <div className="track-tier">
                  <div className="track-tier-title track-tier-title--2">
                    
                    ➕ 함께 고민해볼 과목   
                  </div>
                  <div className="track-tier-cards">
                    {tier2.map(item => <CourseCard key={item.code} item={item} />)}
                  </div>
                </div>
              )}

              {tier1.length === 0 && tier2.length === 0 && (
                <p style={{ fontSize: '14px', color: 'var(--text-3)', textAlign: 'center', padding: '20px 0' }}>
                  추천 과목 데이터가 없어요
                </p>
              )}

            </div>
          )}

        </div>
      )}
    </div>
  )
}