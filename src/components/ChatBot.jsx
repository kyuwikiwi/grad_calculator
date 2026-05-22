// src/components/ChatBot.jsx

import { useState, useRef, useEffect } from 'react'

const BASE = 'https://unbranded-appreciably-merrill.ngrok-free.dev'

// ────────────────────────────────────────────────
// 상수
// ────────────────────────────────────────────────
const SUGGESTED_QUESTIONS = [
  '졸업인증(외국어/정보) 통과 기준을 알려줘',
  '3000~4000단위 이상 과목 이수 요건을 알려줘',
  'SW심화는 몇학점 들어어야되는지 알려줘',
  '1전공이 SW, 2전공이 SW심화일 때 중복 인정은 어떻게 되는지 알려줘',
  '복수전공하면 졸업학점이 달라지는지 알려줘',
  'F 받은 과목도 이수학점에 포함되나 알려줘'
]

// ────────────────────────────────────────────────
// API — 백엔드 /chatbot/ask 호출
// ────────────────────────────────────────────────
async function fetchChatReply(message, studentId) {
  const res = await fetch(`${BASE}/chatbot/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify({
      student_id: studentId,
      message,
    }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data.answer ?? '죄송해요, 답변을 가져오지 못했어요.'
}

// ────────────────────────────────────────────────
// 서브 컴포넌트
// ────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="chatbot__dots">
      <span className="chatbot__dot" />
      <span className="chatbot__dot chatbot__dot--d1" />
      <span className="chatbot__dot chatbot__dot--d2" />
    </div>
  )
}

function BotAvatar() {
  return <div className="chatbot__bot-avatar">🎓</div>
}

function SuggestionPills({ questions, onSelect }) {
  return (
    <div className="chatbot__suggestion-card">
      <p className="chatbot__suggestion-title">이런게 궁금하신가요?</p>
      <p className="chatbot__suggestion-hint">
        아래 문의는 졸업 도우미 그래가 더 빠르게 도와드려요
      </p>
      <div className="chatbot__pills">
        {questions.map((q, i) => (
          <button key={i} className="chatbot__pill" onClick={() => onSelect(q)}>
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────
// 챗봇 패널 (내부)
// ────────────────────────────────────────────────
function ChatPanel({ studentId, track, onClose }) {
  const [messages,        setMessages]        = useState([])
  const [input,           setInput]           = useState('')
  const [loading,         setLoading]         = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  async function sendMessage(text) {
    const userText = (text ?? input).trim()
    if (!userText || loading) return

    setInput('')
    setShowSuggestions(false)

    const nextMessages = [...messages, { role: 'user', content: userText }]
    setMessages(nextMessages)
    setLoading(true)

    try {
      const reply = await fetchChatReply(userText, studentId)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '오류가 발생했어요. 잠시 후 다시 시도해 주세요.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const hasMessages = messages.length > 0

  return (
    <div className="chatbot__panel">

      {/* 헤더 */}
      <div className="chatbot__header">
        <div className="chatbot__header-left">
          <div className="chatbot__header-avatar">🎓</div>
          <div className="chatbot__header-info">
            <span className="chatbot__header-title">졸업 도우미 그래</span>
            {(studentId || track) && (
              <span className="chatbot__header-sub">
                {[studentId, track].filter(Boolean).join(' · ')}
              </span>
            )}
          </div>
        </div>
        <button className="chatbot__icon-btn" aria-label="닫기" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="chatbot__body">
        {!hasMessages && (
          <div className="chatbot__welcome">
            <p className="chatbot__welcome-name">
              안녕하세요{studentId ? `, ${studentId}님` : ''}
            </p>
            <p className="chatbot__welcome-sub">졸업 도우미 그래에요 👋</p>
            {showSuggestions && (
              <SuggestionPills
                questions={SUGGESTED_QUESTIONS}
                onSelect={sendMessage}
              />
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`chatbot__row chatbot__row--${msg.role}`}>
            {msg.role === 'assistant' && <BotAvatar />}
            <div className={`chatbot__bubble chatbot__bubble--${msg.role}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chatbot__row chatbot__row--assistant">
            <BotAvatar />
            <div className="chatbot__bubble chatbot__bubble--assistant">
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 퀵리플라이 */}
      {hasMessages && !loading && (
        <div className="chatbot__quick-area">
          <button
            className="chatbot__quick-btn"
            onClick={() => setShowSuggestions(v => !v)}
          >
            이런 질문도 답할 수 있어요
          </button>
        </div>
      )}

      {hasMessages && showSuggestions && (
        <div className="chatbot__float-suggestions">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              className="chatbot__pill"
              onClick={() => { setShowSuggestions(false); sendMessage(q) }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 입력 바 */}
      <div className="chatbot__input-bar">
        <input
          ref={inputRef}
          className="chatbot__input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="궁금한 내용을 적어주세요"
          disabled={loading}
        />
        <button
          className={`chatbot__send-btn${input.trim() ? '' : ' chatbot__send-btn--disabled'}`}
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          aria-label="전송"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v16M12 4l-6 6M12 4l6 6" />
          </svg>
        </button>
      </div>

    </div>
  )
}

// ────────────────────────────────────────────────
// 메인 export — 플로팅 버튼 + 패널
// ────────────────────────────────────────────────
export default function ChatBot({ studentId, track }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 딤 오버레이 */}
      {isOpen && (
        <div className="chatbot__overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* 챗봇 패널 */}
      <div className={`chatbot__wrapper${isOpen ? ' chatbot__wrapper--open' : ''}`}>
        <ChatPanel
          studentId={studentId}
          track={track}
          onClose={() => setIsOpen(false)}
        />
      </div>

      {/* 플로팅 액션 버튼 */}
      <button
        className={`chatbot__fab${isOpen ? ' chatbot__fab--active' : ''}`}
        onClick={() => setIsOpen(v => !v)}
        aria-label={isOpen ? '챗봇 닫기' : '졸업 도우미 열기'}
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <span className="chatbot__fab-emoji">🎓</span>
            <span className="chatbot__fab-label">졸업 도우미</span>
          </>
        )}
      </button>
    </>
  )
}