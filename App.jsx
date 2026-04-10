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
