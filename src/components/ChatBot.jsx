// src/components/ChatBot.jsx

import { useState, useRef, useEffect } from 'react'

const BASE = 'https://unbranded-appreciably-merrill.ngrok-free.dev'

const WELCOME_MSG = {
  id: 0,
  role: 'bot',
  text: '안녕하세요! 졸업요건 관련 궁금한 점을 물어보세요 😊\n예: "전공필수 뭐 들어야 해?", "졸업요건 몇 학점 들어야돼?"',
}

export default function ChatBot({ user, settings }) {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const bottomRef = useRef()

  // 새 메시지 올 때마다 스크롤 아래로
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { id: Date.now(), role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch(`${BASE}/chatbot/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
        student_id: settings?.studentId,
        message: text,
}),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'bot',
        text: data.answer,
        }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'bot',
        text: '죄송해요, 잠시 후 다시 시도해주세요.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* ── 채팅창 ── */}
      <div className={`chat-window ${open ? 'chat-window--open' : ''}`}>

        {/* 헤더 */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar-sm">🎓</div>
            <div>
              <p className="chat-header-name">Gradulator AI</p>
              <p className="chat-header-status">졸업요건 도우미</p>
            </div>
          </div>
          <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* 메시지 리스트 */}
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-bubble-wrap chat-bubble-wrap--${msg.role}`}>
              {msg.role === 'bot' && <div className="chat-bot-icon">🎓</div>}
              <div className={`chat-bubble chat-bubble--${msg.role}`}>
                {msg.text.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < msg.text.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* 로딩 점점점 */}
          {loading && (
            <div className="chat-bubble-wrap chat-bubble-wrap--bot">
              <div className="chat-bot-icon">🎓</div>
              <div className="chat-bubble chat-bubble--bot chat-bubble--loading">
                <span className="chat-dot" />
                <span className="chat-dot" />
                <span className="chat-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* 입력창 */}
        <div className="chat-input-wrap">
          <textarea
            className="chat-input"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
          />
          <button
            className="chat-send"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 9l13-7-5 7 5 7-13-7z" fill="currentColor"/>
            </svg>
          </button>
        </div>

      </div>

      {/* ── 플로팅 버튼 ── */}
      <button
        className={`chat-fab ${open ? 'chat-fab--open' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-label="챗봇 열기"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        ) : (
          <span className="chat-fab-emoji">💬</span>
        )}
        {!open && messages.length > 1 && (
          <span className="chat-fab-badge">
            {messages.filter(m => m.role === 'bot').length}
          </span>
        )}
      </button>
    </>
  )
}