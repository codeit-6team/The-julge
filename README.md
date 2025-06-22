# 🧑‍💼 The Julge (더 줄게)
![Frame 1913](https://github.com/user-attachments/assets/52e2d466-029e-4832-b69d-486072faeb95)


## 🧑‍💼 The Julge는 어떤 서비스인가요?
- The Julge는 사용자가 원하는 조건의 일자리를 검색하고 지원하며, 근무 승인까지 받을 수 있는 매칭 플랫폼입니다.
  고용인이 더 높은 시급을 제공할 경우, 시급 인상률을 기준으로 일자리를 정렬하는 독특한 기능을 구현하여 사용자에게 더 나은 조건의 일자리를 추천합니다.
## 🚀 배포 링크
[더줄게 바로가기](https://the-julge-eight.vercel.app/) 

## 🖐️ 팀원을 소개합니다
|[![](https://avatars.githubusercontent.com/u/198836946?v=4)](https://github.com/minimo-9)|[![](https://avatars.githubusercontent.com/u/127847577?v=4)](https://github.com/Moon-ju-young)|[![](https://avatars.githubusercontent.com/u/166713026?v=4)](https://github.com/dltmdals3929)|[![](https://avatars.githubusercontent.com/u/127362044?v=4)](https://github.com/Yun-Jinwoo)|
|:---:|:---:|:---:|:---:|
| 박광민 | 문주영 | 이승민 | 윤진우 |

## 📚 기술 스택

### Language 
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

### FrontEnd
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![Context-API](https://img.shields.io/badge/Context--Api-000000?style=for-the-badge&logo=react)

### Style
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 도구 및 유틸리티
<img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white">

### API
<img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">

### 코드 포매터 및 검사 도구
<img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"> <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black">

### 협업툴
<img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white"> <img src="https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white">

### 배포 및 CI/CD
<img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white"> <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white">

## 📂 폴더 구조
``` bash
project-root/
├── node_modules/
├── public/                   # 정적 파일들이 위치하는 폴더
│   └── (필요한 정적 파일들)
├── src/
│   ├── api/                  # API 호출 관련 파일들
│   ├── assets/               # 프로젝트에서 사용하는 자산 파일들
│   │   ├── images/   
│   │   └── icons/                    
│   ├── components/           # 재사용 가능한 컴포넌트들
│   │   ├── common/           # 공용 컴포넌트  
│   │   └── layout/           # 페이지 레이아웃 컴포넌트들
│   │       └── Navbar.tsx    
│   ├── context/
│   ├── constants/            # 상수
│   ├── hooks/                # 커스텀 React 훅들
│   ├── pages/                # 페이지 컴포넌트들 (라우트와 연결됨)            
│   ├── utils/                # 유틸리티 함수들
│   ├── App.tsx               
│   ├── main.tsx              
│   └── index.css             
├── .prettierrc
├── .eslintrc.cjs             
├── .gitignore                
├── index.html                
├── package.json              
├── README.md                 
└── vite.config.ts           
```

## 📝 컨벤션

### 🧐 Commit Type & Emoji Guide

| **commit type** | **description** |
|---------------|----------------|
| feat | ✨ 기능 추가 |
| feat | 🖼️ 아이콘 추가 |
| fix | 🐛 버그 수정 |
| docs | 📝 문서 수정 |
| style | 🎨 UI, 스타일 관련 추가 및 수정 |
| refactor | ♻️ 리팩토링 |
| chore | 🔧 설정, 빌드 변경 |
| chore | 📁 폴더 구조 변경 또는 디렉토리 작업 |
| remove | 🔥 불필요한 코드/파일 제거 |
| deploy | 🚀 프로젝트 배포 |



### 📂 폴더/파일명 네이밍 컨벤션

| **대상** | **규칙** | **예시** |
| --- | --- | --- |
| 폴더명 | 케밥케이스 (kebab-case) | components, user-profile |
| 컴포넌트 파일명 | 파스칼케이스 (PascalCase) | UserProfile.jsx |
| 이미지/아이콘 파일명 | 케밥케이스 | logo-icon.png, profile-default.png |
| 함수명/변수명 | 카멜케이스 (camelCase) | fetchUserData, userList |
| 환경변수 | 대문자+스네이크케이스 | VITE_API_URL |

### 🖊️ Git Flow

| **브랜치명** | **설명** |
|------------|---------|
| main | 배포 브랜치 |
| develop | 통합 개발 브랜치 |
| feature/* | 기능 개발 브랜치 |

### 🌿 브랜치 네이밍 컨벤션

| **브랜치 종류** | **네이밍 규칙** | **예시** |
| --- | --- | --- |
| 기능 개발 | feat/{이슈번호}-{이름} | feat/13-dropdown |
| 버그 수정 | fix/{이슈번호}-{버그-설명} | fix/24-login-button-bug |
| 문서 수정 | docs/{이슈번호}-{문서-설명} | docs/58-readme-update |
