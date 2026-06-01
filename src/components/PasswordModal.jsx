// src/components/PasswordModal.jsx

import { useState } from 'react'
import { changePassword } from '../api/api'

export default function PasswordModal({ user, onClose }) {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw,     setNewPw]     = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(false)

  const handleSubmit = async () => {
    if (!currentPw || !newPw || !confirm) {
      setError('모든 항목을 입력해주세요.')
      return
    }
    if (newPw.length < 8) {
      setError('새 비밀번호는 8자리 이상이어야 해요.')
      return
    }
    if (newPw !== confirm) {
      setError('새 비밀번호가 일치하지 않아요.')
      return
    }
    setLoading(true)
    setError('')

    try {
      await changePassword(user.name, currentPw, newPw)
      setSuccess(true)
    } catch (e) {
      setError('현재 비밀번호가 올바르지 않아요.')
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">비밀번호 변경</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {success ? (
          <>
            <div className="modal-body">
              <p style={{ fontSize: '15px', color: 'var(--success)', textAlign: 'center', padding: '16px 0' }}>
                ✅ 비밀번호가 변경됐어요!
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={onClose}>확인</button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-body">
              <div className="field-group">
                <label className="field-label">현재 비밀번호</label>
                <input
                  type="password"
                  className="modal-input"
                  placeholder="현재 비밀번호를 입력하세요"
                  value={currentPw}
                  onChange={e => { setCurrentPw(e.target.value); setError('') }}
                  onKeyDown={onKeyDown}
                  autoFocus
                />
              </div>
              <div className="field-group">
                <label className="field-label">새 비밀번호</label>
                <input
                  type="password"
                  className="modal-input"
                  placeholder="8자리 이상 입력하세요"
                  value={newPw}
                  onChange={e => { setNewPw(e.target.value); setError('') }}
                  onKeyDown={onKeyDown}
                />
              </div>
              <div className="field-group">
                <label className="field-label">새 비밀번호 확인</label>
                <input
                  type="password"
                  className="modal-input"
                  placeholder="새 비밀번호를 다시 입력하세요"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError('') }}
                  onKeyDown={onKeyDown}
                />
              </div>
              {error && <p className="modal-error">{error}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={onClose}>취소</button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? '변경 중...' : '변경하기'}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}