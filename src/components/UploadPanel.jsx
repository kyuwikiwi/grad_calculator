// src/components/UploadPanel.jsx

import { useState, useRef } from 'react'
import { parseFile, getCourses } from '../api/api'

const ACCEPTED_EXT = '.xlsx,.xls'

export default function UploadPanel({ settings, onParsed }) {
  const [file,     setFile]     = useState(null)
  const [status,   setStatus]   = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef()

  const validate = (f) => {
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['xlsx', 'xls'].includes(ext)) {
      setErrorMsg('엑셀 파일(.xlsx, .xls)만 업로드할 수 있어요.')
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

  const handleFile = async (f) => {
    if (!validate(f)) return
    setFile(f)
    setStatus('uploading')
    setErrorMsg('')

    try {
      // 1. 파싱 + DB 저장
      const parsed = await parseFile(f)

      // 2. 저장된 과목 조회 (student_id는 파싱 응답에서 가져옴)
      const studentId = parsed.student_id
      const courses = await getCourses(studentId)

      setStatus('done')
      onParsed(courses)  // App.jsx로 실제 과목 목록 전달
    } catch (e) {
      setErrorMsg('서버 연결에 실패했어요. 백엔드가 켜져 있는지 확인해주세요.')
      setStatus('error')
    }
  }

  const onDragOver    = (e) => { e.preventDefault(); setStatus('dragging') }
  const onDragLeave   = ()  => setStatus(file ? 'done' : 'idle')
  const onDrop        = (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }
  const onInputChange = (e) => { const f = e.target.files[0]; if (f) handleFile(f) }

  const reset = () => {
    setFile(null); setStatus('idle'); setErrorMsg('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="panel upload-panel">

      <div className="panel-hero">
        <h1 className="panel-title">성적표를 올려주세요 📊</h1>
        <p className="panel-desc">
          종합정보시스템에서 성적표를 엑셀로 저장한 뒤 올려주세요.<br />
          <strong>{settings.studentId}학번 {settings.track}과정</strong> 기준으로 분석할게요.
        </p>
      </div>

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
                <rect x="6" y="4" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="1.8" fill="none"/>
                <path d="M14 14h16M14 20h16M14 26h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M26 4v8h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <p className="dz-title">
              {status === 'dragging' ? '여기에 놓으세요!' : '파일을 드래그하거나 클릭하세요'}
            </p>
            <p className="dz-sub">xlsx · xls · 최대 20MB</p>
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

      <div className="format-guide">
        <div className="format-item">
          <span className="format-badge format-badge--xlsx">XLSX</span>
          <span className="format-text">종합정보시스템 → 성적조회 → 엑셀 저장</span>
        </div>
        <div className="format-item">
          <span className="format-badge format-badge--xls">XLS</span>
          <span className="format-text">구버전 엑셀 형식도 지원해요</span>
        </div>
      </div>

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
          <button className="btn-secondary" onClick={reset}>파일 다시 올리기</button>
        )}
      </div>

    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 311f10f74c4adaddd6ba819f93647cfc5cd96b87
