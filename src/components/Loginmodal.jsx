// src/components/LoginModal.jsx

import { useState } from 'react'
import { login } from '../api/api'

export default function LoginModal({ onLogin, onClose, onShowRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const data = await login(username, password)
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify({ name: username, studentId: username }))
      onLogin({ name: username, studentId: username })
    } catch (e) {
      setError('아이디 또는 비밀번호가 올바르지 않아요.')
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="modal-backdrop" onClick={onClose ?? undefined}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">로그인</h2>
          {onClose && (
            <button className="modal-close" onClick={onClose}>✕</button>
          )}
        </div>

        <div className="modal-body">
          <div className="field-group">
            <label className="field-label">아이디</label>
            <input
              type="text"
              className="modal-input"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
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
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-2)', textAlign: 'center', marginTop: '4px' }}>
          계정이 없으신가요?{' '}
          <button
            style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
            onClick={onShowRegister}
          >
            회원가입
          </button>
        </p>

      </div>
    </div>
  )
}