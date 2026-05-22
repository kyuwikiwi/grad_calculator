// src/components/ManualAddScreen.jsx
// props:
//   onAdd  : (course) => void  — 과목 추가 후 결과 화면으로
//   onBack : () => void        — 결과 화면으로 돌아가기

import { useState } from 'react'

const CATEGORIES = ['전공필수', '전공선택', '일반교양', '필수교양']
const CREDITS    = ['0.5', '1', '2', '3', '4']

export default function ManualAddScreen({ onAdd, onBack }) {
  const [courseName, setCourseName] = useState('')
  const [credit,     setCredit]     = useState('3')
  const [category,   setCategory]   = useState('전공선택')
  const [error,      setError]      = useState('')
  const [added,      setAdded]      = useState([])  // 추가된 과목 목록

  const handleAdd = () => {
    if (!courseName.trim()) {
      setError('과목명을 입력해주세요.')
      return
    }

    const newCourse = {
      course_code:     'MANUAL',
      course_name:     courseName.trim(),
      credits:         Number(credit),
      grade:           '수강중',
      category,
      is_hybrid_added: true,
    }

    setAdded(prev => [...prev, newCourse])
    onAdd(newCourse)

    // 입력창 초기화
    setCourseName('')
    setCredit('3')
    setCategory('전공선택')
    setError('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="manual-screen">

      {/* 뒤로가기 */}
      <button className="manual-back" onClick={onBack}>
        ← 결과로 돌아가기
      </button>

      <div className="panel manual-panel">

        <div className="panel-hero">
          <h1 className="panel-title">수강 중인 과목 추가 ✍️</h1>
          <p className="panel-desc">
            이번 학기 수강 중인 과목을 입력하면<br />
            졸업요건 계산에 바로 반영돼요.
          </p>
        </div>

        {/* 입력 영역 */}
        <div className="field-group">
          <label className="field-label">과목명</label>
          <input
            type="text"
            className="manual-input"
            placeholder="예: 캡스톤설계"
            value={courseName}
            onChange={e => { setCourseName(e.target.value); setError('') }}
            onKeyDown={onKeyDown}
            autoFocus
          />
        </div>

        <div className="manual-row">
          <div className="manual-field">
            <label className="field-label">학점</label>
            <select
              className="manual-select"
              value={credit}
              onChange={e => setCredit(e.target.value)}
            >
              {CREDITS.map(c => (
                <option key={c} value={c}>{c}학점</option>
              ))}
            </select>
          </div>
          <div className="manual-field">
            <label className="field-label">구분</label>
            <select
              className="manual-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="manual-error">{error}</p>}

        {/* 버튼 */}
        <div className="manual-actions">
          <button className="btn-secondary" onClick={onBack}>취소</button>
          <button className="btn-primary manual-add-btn" onClick={handleAdd}>
            추가하기
          </button>
        </div>

      </div>

      {/* 추가된 과목 목록 */}
      {added.length > 0 && (
        <div className="panel manual-added-panel">
          <div className="result-section-title">추가된 과목</div>
          <ul className="manual-added-list">
            {added.map((c, i) => (
              <li key={i} className="manual-added-item">
                <span className="manual-added-name">{c.course_name}</span>
                <span className="manual-added-meta">{c.category} · {c.credits}학점</span>
              </li>
            ))}
          </ul>
          <button className="btn-primary" style={{ marginTop: '16px' }} onClick={onBack}>
            결과 화면에서 확인하기 →
          </button>
        </div>
      )}

    </div>
  )
}