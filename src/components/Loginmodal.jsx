// src/components/LoginModal.jsx


import {useState} from 'react'

export default function LoginModal({ onLogin, onClose }){
    const [id,  setId] = useState('')
    const [password, setPassword]= useState('')
    const [error, setError]= useState('')
    const [loading, setLoading]= useState('')

    const handleSubmit= async () => {
        if (!id || !password) {
            setError('아이디와 비밀번호를 입력해주세요.')
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
    //   localStorage.setItem('token', data.token)
    //   onLogin({ name: data.name, studentId })
    // } catch {
    //   setError('학번 또는 비밀번호가 올바르지 않아요.')
    //   setLoading(false)
    // }

    setTimeout(()=> {
        if(id== 'test' && password=== '1234'){
            onLogin({ name: '지은', id})
        } else{
            setError('아이디 또는 비밀번호가 올바르지 않아요.')
            setLoading(false)
        }
    }, 800)
    }

    const onKeyDown= (e)=>{
        if(e.key=== 'Enter') handleSubmit()
    }

    return(
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-box" onClick= {e=> e.stopPropagation()}>

                <div className="modal-header">
                    <h2 className="modal-title">로그인</h2>
                    <button className="modal-close" onClick={onClose}>X</button>
                </div>

                <div className="modal-body">
                    <div className="field-group">
                        <label className="field-label">학번</label>
                        <input
                            type="text"
                            className="modal-input"
                            placeholder="학번을 입력하세요 (예: 2024245105)"
                            value={studentId}
                            onChange={e=> setStudentId(e.target.value)}
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
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={onKeyDown}
                            />
                    </div>

                    <div className="modal-footer">
                        <button className="btn-secondary" onClick={onClose}>취소</button>
                        <button 
                            className="btn-secondary" onClick={onClose}>취소</button>
                        <button
                            className="btn-primary"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? '로그인 중...': '로그인'}
                        </button>
                    </div>


                </div>
            </div>
        </div>
    )
}
