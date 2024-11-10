# 서울시 합주실 통합검색 웹 애플리케이션
2023.10 ~ 2023.12  

<br/>
   
## 프로젝트 개요
#### 개발 동기 및 목적
- 현재 합주실 이용자들은 예약 가능한 룸을 찾기 위해 각 합주실의 예약현황을 직접 탐색해야 하며,   
인기 시간대에는 예약이 꽉 차 있어 결국 합주실에 개별적으로 전화해야 하는 불편함이 발생한다.   
또한 합주실 이용자들을 위한 통합 플랫폼이 없어 정보가 분산되어 있다.   
이러한 불편을 해결하기 위해 합주실 이용자들이 필요한 정보를 손쉽게 검색할 수 있는 통합검색 웹 애플리케이션을 기획했다.

#### 개발 목표 및 범위
- 네이버 예약 데이터를 크롤링하여 예약 가능한 룸을 지역, 날짜, 시간별로 검색할 수 있도록 하며, 즐겨찾기, 필터링, 정렬 기능 등 사용자 편의를 위한 다양한 기능을 제공한다.
- 합주실 관리자는 로그인하여 합주실 정보를 직접 관리할 수 있다.

<br/>

## 주요 기능
#### 1. 예약 가능한 룸 통합 검색
<p align="center">
  <img src="https://github.com/user-attachments/assets/f92d4c1f-6aee-4682-ba39-1763f1fed945" width="800" alt="검색">
</p>

- 지역, 날짜, 시간을 선택하여 예약 가능한 룸을 한 번에 검색할 수 있다.
- 검색 결과는 카드 형태로 표시되며, 각 카드에 룸 정보와 가격 정보가 있어 빠르게 비교할 수 있다.
- 클릭 시 예약 페이지로 바로 이동할 수 있다.

#### 2. 합주실 목록과 상세 정보 제공
<p align="center">
  <img src="https://github.com/user-attachments/assets/f9321aaa-c138-4a14-8377-bef649a50db4" width="800" alt="검색 gif">
</p>

- 서울시 내 전체 합주실 정보를 제공하며, 각 합주실 카드 클릭 시 상세 정보를 확인할 수 있다.
  
<div align="center" style="display: flex; justify-content: center; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/3a376ba8-e879-4082-abb9-99920d478bfa" width="400" alt="정렬 gif">
  <img src="https://github.com/user-attachments/assets/94c2829a-8964-4902-aaf6-590e918e2a5a" width="400" alt="필터 gif">
</div>

- 이름순(default)/평점순 정렬 기능, 지역(구) 필터링 기능이 있다.
  
#### 3. 합주실 지도 기능

<p align="center">
  <img src="https://github.com/user-attachments/assets/811e344b-f97d-4eca-b83d-51bb52db5eb5" width="800" alt="지도 gif">
</p>

- 현재 위치를 기반으로 지도를 움직여 가까운 합주실을 찾을 수 있다.
- 지도에 표시된 합주실은 하단에 카드 형태로 출력되어 상세 정보를 확인할 수 있다.

#### 4. 사용자 로그인 및 즐겨찾기 기능
- 사용자는 사이드바를 통해 페이지를 이동한다.
- 게스트 모드로 사이트를 이용할 수 있으며, 카카오 소셜로그인을 제공한다.
  
<div align="center" style="display: flex; justify-content: center; align-items: center; gap: 10px;">
  <img src="https://github.com/user-attachments/assets/d7bc4fae-9d65-4186-abe9-30f2e183754b" width="200" alt="사이드바 1 gif">
  <img src="https://github.com/user-attachments/assets/7a91947b-10e7-4acd-9d03-a508e087f863" width="200" alt="사이드바 2 gif">
</div>

- 로그인을 해야 즐겨찾기 기능, 신규 합주실 등록, 정보 수정(관리자용) 기능을 이용할 수 있다.
  
<p align="center">
  <img src="https://github.com/user-attachments/assets/de998ef9-26fa-4960-a7b4-495da6aee4c5" width="400" alt="로그인 모달 gif">
</p>

- 로그인 후 각 합주실 카드의 하트 아이콘을 눌러 즐겨찾기 기능을 이용할 수 있다.
  
<p align="center">
  <img width="464" alt="좋아요" src="https://github.com/user-attachments/assets/c64c7c84-172e-4fd0-85ee-9c52cee6e191">
</p>

- 즐겨찾기 목록은 마이페이지에서 확인할 수 있다.

<p align="center">
  <img src="https://github.com/user-attachments/assets/fff2517d-0684-42a0-9b1d-cad77706422b" width="400" alt="즐겨찾기 gif">
</p>

#### 5. 관리자 페이지
- 합주실 공급자는 로그인 후 합주실 정보를 직접 관리할 수 있다.
  
<p align="center">
  <img src="https://github.com/user-attachments/assets/d6df60c2-0812-4ba3-bb61-f5e26cc044c2" width="800" alt="관리자 gif">
</p>

<br/>

## 구현 과정
#### 데이터 확보
- 합주실 데이터: 네이버지도에서 합주실 리스트와 상세 데이터를 크롤링.
- 예약현황 데이터: Node.js와 puppeteer를 사용해 합주실 예약 페이지에서 날짜별 예약 현황을 추출.
- 실시간 크롤링 프로세스: 사용자가 검색 요청을 하면 크롤링 서버에서 데이터 크롤링 후 예약 가능한 룸을 반환.

#### 프로젝트 아키텍처
![프로젝트 아키텍쳐](https://github.com/user-attachments/assets/76956dc8-dba9-4720-90cf-102a1ad4d672)
- 메인 서버와 크롤링 서버는 AWS EC2 인스턴스에 배포되었으며, React는 nginx, Spring Boot는 내장 WAS로 실행된다.
- 깃헙으로 팀원 협업 및 배포 관리.
  
#### 사용 기술
- 크롤링: Node.js, Puppeteer, MySQL
- 백엔드: Java, Spring Boot
- 프론트엔드: React.js
- 협업: Notion, Discord, Slack

<br/>

## 기대 효과
- 이 서비스를 통해 예약 가능한 합주실 룸을 빠르게 찾을 수 있어 예약 시 불편함이 해소된다.   
- 향후 수수료 기반의 수익 모델을 통해 합주실 정보를 DB로 직접 관리하여 더 효율적인 예약 시스템으로 발전시킬 수 있다.

<br/>

## 팀원 및 역할
#### 팀장
- [이은학](https://github.com/Ag-crane) – 프로젝트 관리, 데이터 크롤링, 프론트엔드 개발
#### 팀원
- [한별](https://github.com/starht) – UI 디자인, 프론트엔드 개발
- [김광민](https://github.com/MIN0225) – 개발환경 구축, 백엔드 개발
