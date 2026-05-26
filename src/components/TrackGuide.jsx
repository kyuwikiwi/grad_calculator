// src/components/TrackGuide.jsx
// props:
//   courses : 이수한 과목 목록 (getCourses 응답)

import { useState, useEffect } from 'react'
import { getTrackList, getTrackStatistics, getTrackGuide } from '../api/api'

const TRACK_NONE = '선택 안 함'

export default function TrackGuide({ courses }) {
  const [tracks,      setTracks]      = useState([])
  const [statistics,  setStatistics]  = useState(null)
  const [selectedTrack, setSelectedTrack] = useState(TRACK_NONE)
  const [guide,       setGuide]       = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [open,        setOpen]        = useState(false)

  // 트랙 목록 + 통계 로드
  useEffect(() => {
    const load = async () => {
      try {
        const [trackRes, statRes] = await Promise.all([
          getTrackList(),
          getTrackStatistics(),
        ])
        setTracks(trackRes.tracks || [])
        setStatistics(statRes)
      } catch (e) {
        console.error('트랙 데이터 로드 실패', e)
      }
    }
    load()
  }, [])

  // 트랙 선택 시 가이드 조회
  const handleTrackChange = async (track) => {
    setSelectedTrack(track)
    setGuide(null)

    if (track === TRACK_NONE) return

    setLoading(true)
    try {
      // 이수한 과목명 목록 추출
      const completedCourses = (courses || [])
        .filter(c => c.grade && c.grade !== 'F')
        .map(c => c.course_name)

      const res = await getTrackGuide(completedCourses, track)
      setGuide(res)
    } catch (e) {
      console.error('트랙 가이드 조회 실패', e)
    } finally {
      setLoading(false)
    }
  }

  const trackStat = statistics?.[selectedTrack]

  return (
    <div className="panel track-guide-panel">

      {/* 헤더 — 클릭하면 열림/닫힘 */}
      <div
        className="track-guide-header"
        onClick={() => setOpen(v => !v)}
      >
        <div>
          <div className="result-section-title" style={{ marginBottom: 0 }}>
            📊 트랙별 이수 가이드
          </div>
          <p className="track-guide-sub">
            트랙을 선택하면 맞춤 가이드를 확인할 수 있어요
          </p>
        </div>
        <span className="track-guide-arrow">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="track-guide-body">

          {/* 트랙 선택 */}
          <div className="field-group" style={{ marginBottom: '20px' }}>
            <label className="field-label">트랙 선택</label>
            <select
              className="modal-select"
              value={selectedTrack}
              onChange={e => handleTrackChange(e.target.value)}
            >
              <option value={TRACK_NONE}>선택 안 함</option>
              {tracks.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* 트랙 미선택 — 전체 통계 */}
          {selectedTrack === TRACK_NONE && statistics && (
            <div>
              <div className="field-label" style={{ marginBottom: '12px' }}>
                트랙별 인기도
              </div>
              <div className="track-stat-list">
                {Object.entries(statistics).map(([track, stat]) => (
                  <div key={track} className="track-stat-row">
                    <span className="track-stat-name">{track}</span>
                    <div className="track-stat-bar-wrap">
                      <div
                        className="track-stat-bar"
                        style={{ width: `${stat.popularity || 0}%` }}
                      />
                    </div>
                    <span className="track-stat-pct">{stat.popularity || 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 로딩 */}
          {loading && (
            <p style={{ color: 'var(--text-2)', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
              가이드 불러오는 중...
            </p>
          )}

          {/* 트랙 선택 후 가이드 */}
          {!loading && guide && selectedTrack !== TRACK_NONE && (
            <div>
              {/* 선배 수강 통계 */}
              {trackStat && (
                <div className="track-stat-card">
                  <p className="track-stat-title">
                    선배들의 {selectedTrack} 수강 현황
                  </p>
                  <div className="track-course-list">
                    {Object.entries(trackStat.course_rates || {}).map(([code, rate]) => (
                      <div key={code} className="track-course-row">
                        <span className="track-course-code">{code}</span>
                        <div className="track-stat-bar-wrap">
                          <div
                            className="track-stat-bar"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="track-stat-pct">{rate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 가이드 응답 */}
              {guide && (
                <div className="track-guide-result">
                  <p className="field-label" style={{ marginBottom: '12px' }}>
                    {selectedTrack} 맞춤 가이드
                  </p>
                  <div className="track-guide-content">
                    {typeof guide === 'string'
                      ? guide
                      : JSON.stringify(guide, null, 2)
                    }
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  )
}