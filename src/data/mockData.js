// src/data/mockData.js
// 백엔드 API 연결 전까지 사용할 목업 데이터
<<<<<<< HEAD
// Day 3 백엔드 연결 시 api.js 응답으로 교체

export const MOCK_RESULT = {
  verdict: { 
    canGraduate: false, 
    lacking: 12 ,
    message: '졸업까지 12학점이 더 필요해요',
  },
  areas: [
    { key: 'total', name: '총 학점',   current: 118, required: 135 },
    { key: 'major', name: '전공필수',  current: 12,  required: 12  },
    { key: 'elective', name: '전공선택',  current: 18,  required: 24  },
    { key: 'general', name: '총 교양',     current: 57,  required: 63  },
    { key: 'must', name: '교양필수',  current: 20,  required: 20  },
  ],
  recommendations: ['전공선택 6학점', '일반교양 6학점'],
=======

export const MOCK_RESULT = {
  verdict: {
    canGraduate: false,
    lacking: 12,
    message: '졸업까지 12학점이 더 필요해요',
  },
  areas: [
    { key: 'total',    name: '총 이수 학점', current: 118, required: 135 },
    { key: 'major',    name: '전공 필수',    current: 7,   required: 9   },
    { key: 'elective', name: '전공 선택',    current: 20,  required: 27  },
    { key: 'liberal',  name: '일반 교양',    current: 38,  required: 43  },
    { key: 'required', name: '필수 교양',    current: 20,  required: 20  },
  ],
  recommendations: [
    '전공필수 2학점',
    '전공선택 7학점',
    '일반교양 5학점',
  ],
>>>>>>> 311f10f74c4adaddd6ba819f93647cfc5cd96b87
}