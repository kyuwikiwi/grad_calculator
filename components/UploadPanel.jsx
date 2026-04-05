// components/UploadPanel.jsx
// props:
//   settings     : { studentId, track }
//   onParsed     : (courses) => void
//   onCalculated : (result) => void  — Day 3에서 사용

import { useState, useRef } from 'react'

const ACCEPTED_TYPES = ['application/pdf', 'image/png']
const ACCEPTED_EXT   = '.pdf,.png'

export default function UploadPanel({ settings, onParsed }) {
  const [file,     setFile]     = useState(null)
  const [status,   setStatus]   = useState('idle') // idle | dragging | uploading | done | error
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef()

  const validate = (f) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setErrorMsg('PDF 또는 PNG 파일만 업로드할 수 있어요.')
      setStatus('error')
      return false
    }
    if (f.size > 20 * 1024 * 1024) {
      setErrorMsg('파일 크기가 20MB를 초과했어요.')
      setStatus('error')
      return false
    }
    return true
  }

  const handleFile = (f) => {
    if (!validate(f)) return
    setFile(f)
    setStatus('uploading')
    setErrorMsg('')

    // 백엔드 연결 전 — 2초 시뮬레이션
    // Day 3에서 실제 API 호출로 교체:
    // const res = await api.parseFile(f, settings)
    // onParsed(res.courses)
    setTimeout(() => {
      setStatus('done')
    }, 2000)
  }

  const onDragOver  = (e) => { e.preventDefault(); setStatus('dragging') }
  const onDragLeave = ()  => setStatus(file ? 'done' : 'idle')
  const onDrop      = (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }
  const onInputChange = (e) => { const f = e.target.files[0]; if (f) handleFile(f) }

  const reset = () => {
    setFile(null); setStatus('idle'); setErrorMsg('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="panel upload-panel">

      <div className="panel-hero">
        <h1 className="panel-title">성적표를 올려주세요 📄</h1>
        <p className="panel-desc">
          종합정보시스템에서 성적표를 저장한 뒤 올려주세요.<br />
          <strong>{settings.studentId}학번 {settings.track}과정</strong> 기준으로 분석할게요.
        </p>
      </div>

      {/* 드롭존 */}
      <div
        className={`dropzone dropzone--${status}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => status !== 'uploading' && status !== 'done' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXT}
          style={{ display: 'none' }}
          onChange={onInputChange}
        />

        {(status === 'idle' || status === 'dragging') && (
          <>
            <div className="dz-icon">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path d="M22 32V18M22 18l-7 7M22 18l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 34a8 8 0 01-1-15.9A10 10 0 0131 16a8 8 0 011 15.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <p className="dz-title">
              {status === 'dragging' ? '여기에 놓으세요!' : '파일을 드래그하거나 클릭하세요'}
            </p>
            <p className="dz-sub">PDF · PNG · 최대 20MB</p>
          </>
        )}

        {status === 'uploading' && (
          <>
            <div className="dz-icon dz-icon--spin">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="16" stroke="currentColor" strokeWidth="2" strokeOpacity=".2"/>
                <path d="M22 6a16 16 0 0116 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="dz-title">분석 중...</p>
            <p className="dz-sub">{file?.name}</p>
            <div className="upload-bar"><div className="upload-bar-fill" /></div>
          </>
        )}

        {status === 'done' && (
          <>
            <div className="dz-icon dz-icon--done">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="16" fill="currentColor" opacity=".12"/>
                <path d="M13 22l7 7 11-14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <p className="dz-title">파싱 완료!</p>
            <p className="dz-sub">{file?.name}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="dz-icon dz-icon--error">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="16" fill="currentColor" opacity=".12"/>
                <path d="M22 14v11M22 30v1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="dz-title">업로드 실패</p>
            <p className="dz-sub dz-sub--error">{errorMsg}</p>
          </>
        )}
      </div>

      {/* 지원 형식 안내 */}
      <div className="format-guide">
        <div className="format-item">
          <span className="format-badge format-badge--pdf">PDF</span>
          <span className="format-text">종합정보시스템 → 성적조회 → PDF 저장</span>
        </div>
        <div className="format-item">
          <span className="format-badge format-badge--png">PNG</span>
          <span className="format-text">성적표 캡처 이미지 (전체 화면 포함)</span>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="upload-actions">
        {(status === 'idle' || status === 'dragging') && (
          <button className="btn-outline" onClick={() => inputRef.current?.click()}>
            PC에서 파일 찾기
          </button>
        )}
        {status === 'error' && (
          <button className="btn-secondary" onClick={reset}>다시 시도</button>
        )}
        {status === 'done' && (
          <>
            <button className="btn-secondary" onClick={reset}>파일 다시 올리기</button>
            <button className="btn-primary" onClick={() => onParsed([{ _parsed: true, fileName: file?.name }])}>
              졸업요건 계산하기 →
            </button>
          </>
        )}
      </div>

    </div>
  )
}6