// src/components/LoginModal.jsx
// props:
//   onLogin  : (user) => void
//   onClose  : (() => void) | null  — null이면 닫기 버튼 숨김 (첫 화면)

import { useState } from 'react'

export default function LoginModal({ onLogin, onClose }) {
  const [studentId, setStudentId] = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  const handleSubmit = async () => {
    if (!studentId || !password) {
      setError('학번과 비밀번호를 입력해주세요.')
      return
    }
    setLoading(true)
    setError('')

    // ── 백엔드 Auth API 연결 시 아래 주석 해제, setTimeout 블록 제거 ──
    // try {
    //   const res = await fetch(`${BASE}/auth/login`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ student_id: studentId, password }),
    //   })
    //   if (!res.ok) throw new Error()
    //   const data = await res.json()
    //   onLogin({ name: data.name, studentId })
    // } catch {
    //   setError('학번 또는 비밀번호가 올바르지 않아요.')
    //   setLoading(false)
    // }

    setTimeout(() => {
      if (studentId && password) {
        onLogin({ name: studentId, studentId })
      } else {
        setError('학번 또는 비밀번호가 올바르지 않아요.')
        setLoading(false)
      }
    }, 800)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    // onClose가 null이면 배경 클릭해도 안 닫힘
    <div className="modal-backdrop" onClick={onClose ?? undefined}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">로그인</h2>
          {/* onClose가 있을 때만 닫기 버튼 표시 */}
          {onClose && (
            <button className="modal-close" onClick={onClose}>✕</button>
          )}
        </div>

        <div className="modal-body">
          <div className="field-group">
            <label className="field-label">학번</label>
            <input
              type="text"
              className="modal-input"
              placeholder="학번을 입력하세요 (예: 2024245105)"
              value={studentId}
              onChange={e => { setStudentId(e.target.value); setError('') }}
              onKeyDown={onKeyDown}
              autoFocus
            />
          </div>

          <div className="field-group">
            <label className="field-label">비밀번호</label>
            <input
              type="password"
              className="modal-input"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={onKeyDown}
            />
          </div>

          {error && <p className="modal-error">{error}</p>}
        </div>

        <div className="modal-footer">
          {onClose && (
            <button className="btn-secondary" onClick={onClose}>취소</button>
          )}
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </div>

      </div>
    </div>
  )
}