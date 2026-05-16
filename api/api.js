const BASE = 'https://unbranded-appreciably-merrill.ngrok-free.dev'

const NGROK_HEADERS = {
  'ngrok-skip-browser-warning': 'true',
}

export const parseFile = async (file) => {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${BASE}/transcript/parse`, {
    method: 'POST',
    headers: NGROK_HEADERS,
    body: form,
  })
  if (!res.ok) throw new Error('파싱 실패')
  return res.json()
}

export const getCourses = async (studentId) => {
  const res = await fetch(`${BASE}/courses/?student_id=${studentId}`, {
    headers: NGROK_HEADERS,
  })
  if (!res.ok) throw new Error('과목 조회 실패')
  return res.json()
}

export const getRules = async () => {
  const res = await fetch(`${BASE}/rules/`, {
    headers: NGROK_HEADERS,
  })
  if (!res.ok) throw new Error('졸업요건 조회 실패')
  return res.json()
}

// 백엔드 Auth API 완성되면 App.jsx의 임시 state 로그인을 이 함수로 교체
export const login = async (username, password) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { ...NGROK_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('로그인 실패')
  return res.json() // { token, user }
}
