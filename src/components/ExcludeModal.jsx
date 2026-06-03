// src/components/ExcludeModal.jsx
// props:
//   commonCourses  : 공통 과목 목록 [{ course_code, course_name, credits }]
//   excluded       : 현재 제외된 과목 코드 목록 []
//   onConfirm      : (excludedCodes) => void
//   onClose        : () => void

import { useState } from 'react'

export default function ExcludeModal({ commonCourses, excluded, onConfirm, onClose }) {
  const [selected, setSelected] = useState(new Set(excluded))

  const toggle = (code) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">1전공으로 사용할 과목 선택</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="modal-desc">
          아래 과목은 1전공과 심화전공 모두에 해당해요.<br />
          1전공으로 사용할 과목을 선택하면 심화전공 계산에서 제외돼요.
        </p>

        <div className="exclude-list">
          {commonCourses.map(c => (
            <div
              key={c.course_code}
              className={`exclude-item ${selected.has(c.course_code) ? 'exclude-item--selected' : ''}`}
              onClick={() => toggle(c.course_code)}
            >
              <div className="exclude-checkbox">
                {selected.has(c.course_code) ? '☑' : '☐'}
              </div>
              <div className="exclude-info">
                <span className="exclude-name">{c.course_name}</span>
                <span className="exclude-meta">{c.course_code} · {c.credits}학점</span>
              </div>
              <span className={`exclude-badge ${selected.has(c.course_code) ? 'exclude-badge--on' : ''}`}>
                {selected.has(c.course_code) ? '1전공' : '심화'}
              </span>
            </div>
          ))}
        </div>

        <p className="exclude-hint">
          선택한 과목 {selected.size}개는 1전공으로, 나머지는 심화전공으로 계산돼요.
        </p>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>취소</button>
          <button className="btn-primary modal-submit" onClick={() => {
            console.log('selected:', [...selected])  // ← 추가
            onConfirm([...selected])
          }}>
            적용하기
          </button>
        </div>

      </div>
    </div>
  )
}