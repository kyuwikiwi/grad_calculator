# 🎓 Gradulator
**연세대학교 소프트웨어학부 졸업요건 계산기**

> 성적표를 업로드하면 졸업까지 남은 학점을 자동으로 계산해주는 웹 애플리케이션입니다.

---

## 1. Quick Start

```bash
# Frontend
npm install
npm run dev

# Backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 2. Architecture

```text
src/
├── api/
│   └── api.js                  # 백엔드 API 연동
└── components/
    ├── SettingsPanel.jsx        # 정보 입력 (학번, 과정, 트랙)
    ├── UploadPanel.jsx          # 성적표 업로드
    ├── ResultDashboard.jsx      # 결과 화면
    ├── ExcludeModal.jsx         # 1전공 과목 선택
    ├── TrackGuide.jsx           # 선배 추천 과목
    ├── ManualAddScreen.jsx      # 수강 중인 과목 추가
    ├── ChatBot.jsx              # 챗봇 그래
    ├── LoginModal.jsx           # 로그인
    ├── RegisterModal.jsx        # 회원가입
    └── PasswordModal.jsx        # 비밀번호 변경
```

---

## 3. Preview

### 3.1 로그인
![로그인](./preview/로그인.png)

### 3.2 회원가입
![회원가입](./preview/회원가입.png)

### 3.3 정보 입력
![정보입력](./preview/정보입력.png)

### 3.4 성적표 업로드
![성적표업로드](./preview/성적표업로드.png)

### 3.5 일반과정 결과
![일반결과](./preview/일반결과ㅓ.png)

### 3.6 심화과정 결과
![심화결과](./preview/심화1.png)

### 3.7 1전공 과목 선택 (선택 전)
![1과목선택전](./preview/심화1과목선택.png)

### 3.8 1전공 과목 선택 (선택 후)
![1과목선택후](./preview/1과목선택.png)

### 3.9 심화결과 변경
![심화결과변경](./preview/심화결과_변경.png)

### 3.10 AI 선배 추천 과목
![AI선배추천](./preview/AI선배추천.png)

### 3.11 수강 중인 과목 추가
![수강과목추가](./preview/수강과목추가.png)

### 3.12 챗봇 그래
![챗봇](./preview/그래_챗봇.png)

### 3.13 챗봇 대화
![챗봇2](./preview/챗봇2.png)
![챗봇3](./preview/챗봇3.png)

### 3.14 비밀번호 변경
![비밀번호변경](./preview/비밀번호변경.png)

---

## 4. 기술 스택

**Frontend**
- React + Vite
- CSS Variables 기반 디자인 시스템

**Backend**
- FastAPI
- SQLite
- ngrok

**AI**
- Google Gemini API (챗봇 그래)

---

## 5. 주요 기능

### 졸업요건 계산
- 성적표 엑셀(.xlsx, .xls) 업로드 후 자동 파싱
- 일반과정 / 심화과정 맞춤 계산
- 영역별 이수 현황 프로그레스 바 시각화

### 심화전공 중복인정 계산
- 기본전공 ↔ 심화전공 공통 과목 자동 추출
- SW엔지니어소양세미나 / SW인턴십 이수 여부에 따라 최대 6~7학점 중복인정
- 1전공으로 사용할 과목 직접 선택 기능

### 트랙별 선배 추천 과목
- 5개 트랙 선택 (AI빅데이터 / AI미디어 / AI계산과학 / 스마트IoT / 정보보안)
- 🏆 선배들의 필수 픽 (수강률 80% 이상)
- ➕ 함께 고민해볼 과목 (수강률 50~79%)
- **+ 담기** 버튼으로 수강 중인 과목 추가에 바로 반영

### 챗봇 그래
- 졸업요건 관련 질문에 실시간 답변
- Gemini AI 기반

### 회원 관리
- 회원가입 (연세대학교 이메일 @yonsei.ac.kr 인증)
- 로그인 / 로그아웃
- 비밀번호 변경

---

## 6. 졸업요건 기준 (22학번)

### 소프트웨어전공

| 구분 | 필요 학점 |
|------|-----------|
| 총 이수 학점 | 135학점 |
| 전공필수 | 9학점 |
| 전공선택 | 24학점 |
| 교양기초 | 22학점 |
| 대학교양 | 20학점 |
| 전공탐색 | 21학점 |

### 소프트웨어심화전공

| 구분 | 필요 학점 |
|------|-----------|
| 총 이수 학점 | 36학점 |
| 전공필수 | 6학점 |
| 전공선택 | 30학점 |
| 중복인정 | 최대 7학점 |

---

*연세대학교 소프트웨어학부 캡스톤디자인 프로젝트*
