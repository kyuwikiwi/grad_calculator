1. 🎓 Gradulator

연세대학교 소프트웨어학부 졸업요건 계산기


성적표를 업로드하면 졸업까지 남은 학점을 자동으로 계산해주는 웹 애플리케이션입니다.

2. Architecture
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
