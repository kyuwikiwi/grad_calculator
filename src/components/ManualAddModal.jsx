// src/components/ManualAddModal.jsx
// props:
//   onAdd   : (course) => void
//   onClose : () => void

import { useState } from 'react'

const CATEGORIES = ['전공필수', '전공선택', '일반교양', '필수교양']

export default function ManualAddModal({ onAdd, onClose }) {
  const [courseName, setCourseName] = useState('')
  const [credit,     setCredit]     = useState('3')
  const [category,   setCategory]   = useState('전공선택')
  const [error,      setError]      = useState('')

  const handleAdd = () => {
    if (!courseName.trim()) {
      setError('과목명을 입력해주세요.')
      return
    }
    if (!credit || isNaN(Number(credit)) || Number(credit) <= 0) {
      setError('올바른 학점을 입력해주세요.')
      return
    }

    onAdd({
      course_code:     'MANUAL',
      course_name:     courseName.trim(),
      credits:         Number(credit),
      grade:           '수강중',
      category,
      is_hybrid_added: true,
    })
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    /* 배경 클릭하면 닫힘 */
    <div className="manual-overlay" onClick={onClose}>
      <div className="manual-box" onClick={e => e.stopPropagation()}>

        <h2 className="manual-title">수강 중인 과목 추가</h2>
        <p className="manual-desc">
          이번 학기 수강 중인 과목을 입력하면<br />졸업요건 계산에 반영됩니다.
        </p>

        {/* 과목명 */}
        <div className="field-group">
          <label className="field-label">과목명</label>
          <input
            type="text"
            className="modal-input"
            placeholder="예: 캡스톤설계"
            value={courseName}
            onChange={e => { setCourseName(e.target.value); setError('') }}
            onKeyDown={onKeyDown}
            autoFocus
          />
        </div>

        {/* 학점 + 카테고리 */}
        <div className="manual-row">
          <div className="manual-field">
            <label className="field-label">학점</label>
            <select
              className="modal-select"
              value={credit}
              onChange={e => setCredit(e.target.value)}
            >
              {['0.5', '1', '2', '3', '4'].map(c => (
                <option key={c} value={c}>{c}학점</option>
              ))}
            </select>
          </div>
          <div className="manual-field">
            <label className="field-label">구분</label>
            <select
              className="modal-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="modal-error">{error}</p>}

        {/* 버튼 한 줄에 */}
        <div className="manual-actions">
          <button className="manual-btn-cancel" onClick={onClose}>취소</button>
          <button className="manual-btn-add" onClick={handleAdd}>추가하기</button>
        </div>

      </div>
    </div>
  )
}