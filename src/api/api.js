// src/api/api.js

const BASE = 'https://unbranded-appreciably-merrill.ngrok-free.dev'

const HEADERS = {
  'ngrok-skip-browser-warning': 'true',
}

// 성적표 파싱 + DB 저장
export const parseFile = async (file) => {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${BASE}/transcript/parse`, {
    method: 'POST',
    headers: HEADERS,
    body: form,
  })
  if (!res.ok) throw new Error('파싱 실패')
  return res.json()
}

// 파싱 후 저장된 과목 조회
export const getCourses = async (studentId) => {
  const res = await fetch(`${BASE}/courses/?student_id=${studentId}`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error('과목 조회 실패')
  return res.json()
}

// 졸업요건 계산 결과 조회
export const getGraduationResult = async (studentId) => {
  const res = await fetch(`${BASE}/graduation/result?student_id=${studentId}`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error('졸업요건 조회 실패')
  return res.json()
}

// 졸업요건 규칙 조회
export const getRules = async () => {
  const res = await fetch(`${BASE}/rules/`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error('졸업요건 조회 실패')
  return res.json()
}