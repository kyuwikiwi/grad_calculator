// src/components/ManualAddModal.jsx
// props:
//   onAdd   : (course) => void  — 추가된 과목을 App으로 전달
//   onClose : () => void

import { useState } from 'react'

const CATEGORIES = ['전공필수', '전공선택', '일반교양', '필수교양']

export default function ManualAddModal({ onAdd, onClose }) {
  const [courseName, setCourseName] = useState('')
  const [credit,     setCredit]     = useState('3')
  const [category,   setCategory]   = useState('전공선택')
  const [grade,      setGrade]      = useState('수강중')
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
      course_code:  'MANUAL',           // 수기 입력 식별자
      course_name:  courseName.trim(),
      credits:      Number(credit),
      grade,
      category,
      is_hybrid_added: true,            // 백엔드 필드와 맞춤
    })
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">수강 중인 과목 추가</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="modal-desc">
          이번 학기 수강 중인 과목을 직접 입력해주세요.<br />
          졸업요건 계산에 반영됩니다.
        </p>

        <div className="modal-body">

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
          <div className="modal-row">
            <div className="modal-field">
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
            <div className="modal-field">
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
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>취소</button>
          <button className="btn-primary modal-submit" onClick={handleAdd}>
            추가하기
          </button>
        </div>

      </div>
    </div>
  )
}