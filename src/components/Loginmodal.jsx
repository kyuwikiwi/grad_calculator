// src/components/LoginModal.jsx

import { useState } from 'react'
import { login, register } from '../api/api'

export default function LoginModal({ onLogin, onClose }) {
  const [mode,      setMode]      = useState('login') // 'login' | 'register'
  const [username,  setUsername]  = useState('')
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('학번과 비밀번호를 입력해주세요.')
      return
    }
    setLoading(true)
    setError('')

    try {
      if (mode === 'register') {
        // 회원가입
        await register(username, password)
        setMode('login')
        setError('')
        setLoading(false)
        return
      }

      // 로그인
      const data = await login(username, password)
      // 토큰 저장
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify({ name: username, studentId: username }))
      onLogin({ name: username, studentId: username })

    } catch (e) {
      setError(
        mode === 'login'
          ? '학번 또는 비밀번호가 올바르지 않아요.'
          : '회원가입에 실패했어요. 다시 시도해주세요.'
      )
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
          <h2 className="modal-title">
            {mode === 'login' ? '로그인' : '회원가입'}
          </h2>
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
              placeholder="학번을 입력하세요"
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

          {/* 회원가입 완료 안내 */}
          {mode === 'register' && !error && !loading && (
            <p style={{ fontSize: '12px', color: 'var(--text-2)' }}>
              가입 후 로그인해주세요.
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? (mode === 'login' ? '로그인 중...' : '가입 중...')
              : (mode === 'login' ? '로그인' : '회원가입')
            }
          </button>
        </div>

        {/* 모드 전환 */}
        <p style={{ fontSize: '13px', color: 'var(--text-2)', textAlign: 'center', marginTop: '4px' }}>
          {mode === 'login' ? (
            <>계정이 없으신가요?{' '}
              <button
                style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
                onClick={() => { setMode('register'); setError('') }}
              >
                회원가입
              </button>
            </>
          ) : (
            <>이미 계정이 있으신가요?{' '}
              <button
                style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
                onClick={() => { setMode('login'); setError('') }}
              >
                로그인
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  )
}