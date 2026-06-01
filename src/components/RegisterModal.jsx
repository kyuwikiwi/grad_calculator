// src/components/RegisterModal.jsx

import { useState } from 'react'
import { register } from '../api/api'

export default function RegisterModal({ onClose, onShowLogin }) {
  const [studentId, setStudentId] = useState('')
  const [email,     setEmail]     = useState('')
  const [username,  setUsername]  = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [privacy,   setPrivacy]   = useState(false)
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [success,   setSuccess]   = useState(false)

  const handleSubmit = async () => {
    if (!studentId || !email || !username || !password || !confirm) {
      setError('모든 항목을 입력해주세요.')
      return
    }
    if (!email.endsWith('@yonsei.ac.kr')) {
      setError('연세대학교 이메일(@yonsei.ac.kr)만 사용 가능해요.')
      return
    }
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않아요.')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자리 이상이어야 해요.')
      return
    }
    if (!privacy) {
      setError('개인정보 수집 및 이용에 동의해주세요.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await register(username, password)
      setSuccess(true)
    } catch (e) {
      setError('이미 존재하는 아이디예요.')
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
          <h2 className="modal-title">회원가입</h2>
          {onClose && (
            <button className="modal-close" onClick={onClose}>✕</button>
          )}
        </div>

        {success ? (
          <>
            <div className="modal-body">
              <p style={{ fontSize: '15px', color: 'var(--success)', textAlign: 'center', padding: '16px 0' }}>
                🎉 회원가입이 완료됐어요!
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-2)', textAlign: 'center' }}>
                로그인 화면으로 이동해주세요.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={onShowLogin}>
                로그인하러 가기
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-body">

              {/* 학번 */}
              <div className="field-group">
                <label className="field-label">학번</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="예: 2022123456"
                  value={studentId}
                  onChange={e => { setStudentId(e.target.value); setError('') }}
                  onKeyDown={onKeyDown}
                  autoFocus
                />
              </div>

              {/* 연세 이메일 */}
              <div className="field-group">
                <label className="field-label">연세메일</label>
                <input
                  type="email"
                  className="modal-input"
                  placeholder="예: 2022123456@yonsei.ac.kr"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  onKeyDown={onKeyDown}
                />
              </div>

              {/* 아이디 */}
              <div className="field-group">
                <label className="field-label">아이디</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="사용할 아이디를 입력하세요"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError('') }}
                  onKeyDown={onKeyDown}
                />
              </div>

              {/* 비밀번호 */}
              <div className="field-group">
                <label className="field-label">비밀번호</label>
                <input
                  type="password"
                  className="modal-input"
                  placeholder="8자리 이상 입력하세요(숫자, 영어, 특수기호 포함)"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  onKeyDown={onKeyDown}
                />
              </div>

              {/* 비밀번호 확인 */}
              <div className="field-group">
                <label className="field-label">비밀번호 확인</label>
                <input
                  type="password"
                  className="modal-input"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError('') }}
                  onKeyDown={onKeyDown}
                />
              </div>

              {/* 개인정보 동의 */}
              <div className="privacy-row" onClick={() => setPrivacy(v => !v)}>
                <div className={`privacy-check ${privacy ? 'privacy-check--on' : ''}`}>
                  {privacy ? '☑' : '☐'}
                </div>
                <span className="privacy-text">
                  <strong>개인정보 수집 및 이용</strong>에 동의합니다.{' '}
                  <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                    (학번, 이메일, 성적 데이터 수집)
                  </span>
                </span>
              </div>

              {error && <p className="modal-error">{error}</p>}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={onShowLogin}>취소</button>
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? '가입 중...' : '회원가입'}
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-2)', textAlign: 'center', marginTop: '4px' }}>
              이미 계정이 있으신가요?{' '}
              <button
                style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}
                onClick={onShowLogin}
              >
                로그인
              </button>
            </p>
          </>
        )}

      </div>
    </div>
  )
}