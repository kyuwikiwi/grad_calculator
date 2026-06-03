// src/api/api.js

const BASE = 'https://unbranded-appreciably-merrill.ngrok-free.dev'

const HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json',
}

// ── 인증 ──────────────────────────────────────────────────

export const register = async (username, password) => {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('회원가입 실패')
  return res.json()
}

export const login = async (username, password) => {
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)

  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  })
  if (!res.ok) throw new Error('로그인 실패')
  return res.json()
}

export const changePassword = async (username, currentPassword, newPassword) => {
  const res = await fetch(`${BASE}/auth/password`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({
      username,
      current_password: currentPassword,
      new_password: newPassword,
    }),
  })
  if (!res.ok) throw new Error('비밀번호 변경 실패')
  return res.json()
}

// ── 성적 ──────────────────────────────────────────────────

export const parseFile = async (file) => {
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${BASE}/transcript/parse`, {
    method: 'POST',
    headers: { 'ngrok-skip-browser-warning': 'true' },
    body: form,
  })
  if (!res.ok) throw new Error('파싱 실패')
  return res.json()
}

export const getCourses = async (studentId) => {
  const res = await fetch(`${BASE}/courses/?student_id=${studentId}`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error('과목 조회 실패')
  return res.json()
}

export const getGraduationResult = async (studentId, track, subTrack, excludedCourses = []) => {
  const body = {
    student_id: studentId,
    track: track || '기본',
    excluded_courses: excludedCourses,
  }
  if (subTrack && subTrack !== '선택 안 함') body.sub_track = subTrack

  const res = await fetch(`${BASE}/graduation/result`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('졸업요건 조회 실패')
  return res.json()
}

// ── 트랙 ──────────────────────────────────────────────────

export const getTrackList = async () => {
  const res = await fetch(`${BASE}/track/list`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error('트랙 목록 조회 실패')
  return res.json()
}

export const getTrackStatistics = async () => {
  const res = await fetch(`${BASE}/track/statistics`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error('트랙 통계 조회 실패')
  return res.json()
}

export const getTrackGuide = async (completedCourses, targetTrack) => {
  const res = await fetch(`${BASE}/track/guide`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      completed_courses: completedCourses,
      target_track: targetTrack,
    }),
  })
  if (!res.ok) throw new Error('트랙 가이드 조회 실패')
  return res.json()
}

export const getRules = async () => {
  const res = await fetch(`${BASE}/rules/`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error('졸업요건 조회 실패')
  return res.json()
}