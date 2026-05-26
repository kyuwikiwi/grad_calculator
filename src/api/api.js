// src/api/api.js

const BASE = 'https://unbranded-appreciably-merrill.ngrok-free.dev'

const HEADERS = {
  'ngrok-skip-browser-warning': 'true',
  'Content-Type': 'application/json',
}

// 성적표 파싱 + DB 저장
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

// 파싱 후 저장된 과목 조회
export const getCourses = async (studentId) => {
  const res = await fetch(`${BASE}/courses/?student_id=${studentId}`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error('과목 조회 실패')
  return res.json()
}

// 졸업요건 계산 결과 조회
export const getGraduationResult = async (studentId, track) => {
  const params = new URLSearchParams({ student_id: studentId })
  if (track) params.append('track', track)

  const res = await fetch(`${BASE}/graduation/result?${params}`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error('졸업요건 조회 실패')
  return res.json()
}

// 트랙 목록 조회
export const getTrackList = async () => {
  const res = await fetch(`${BASE}/track/list`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error('트랙 목록 조회 실패')
  return res.json()
}

// 트랙별 선배 수강 통계
export const getTrackStatistics = async () => {
  const res = await fetch(`${BASE}/track/statistics`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error('트랙 통계 조회 실패')
  return res.json()
}

// 트랙 이수 가이드
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

// 졸업요건 규칙 조회
export const getRules = async () => {
  const res = await fetch(`${BASE}/rules/`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error('졸업요건 조회 실패')
  return res.json()
}