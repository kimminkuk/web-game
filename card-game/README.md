# 추가 예정
  - Game Life
    - 그냥 하트로 하자: ok
    - 카드1, 카드2 불 일치 시, decreaseLife: ok
    - start 버튼 실행 시, 왼쪽 화면이 중앙으로 이동된다. div container를 공유해서그런듯
      - row를 제거 하자.
  - Game 시작, 끝
    - 시작은 easy, medium, hard 버튼 누르면 시작: ok
    - 끝은 라이프 3개 다쓰면 종료: ok
  - 처음에 Card(이모지)들이 뒷면 처럼 보이게 하기
    - 앞면, 뒷면 나누기 성공: ok
    - 처음에 뒷면으로 보이게 하기 성공: ok
    - 난이도 버튼 클릭 시, 뒷면으로 나오는 카드들 순서대로 앞면 보이게 하기: ok
  - Card에 마우스 올리면 Over 되도록
    - Card 위에 마우스 Over: ok
    - 처음 실행 시, card 뒤집는 구간에서 마우스 클릭 및 Over 금지: ok
  - Card 1 선택, Card 2 선택 시 참, 거짓 판단
    - 거짓이면, Life -1: ok
    - Life 0이면, Game 끝: ok
    - 모든 Card 판정 끝내면, Clear
  - 카드 뒷면 부트스트랩으로 꾸며보기
  - Hint 추가
    - easy 3개, medium 6개, hard 9개
    - 각각 Hint 아이콘 클릭 시, 임의의 뒷면 카드가 3초 동안 앞면으로 뒤집힌다.
    
# web-game
  - Easy 16, Medium 32, Hard 64 이미지 찾기
  - Life 3개
  - 이모지는 API KEY로 가져오기

# 사용
  - bootstarp
  - emoji API

# 배운 점
  - API KEY 라는 것을 배포 받아서, 사용
  - node js (.mjs 사용)
  - bootstrap으로 grid 조작
  - document flipped 조작
  - setTimeout 간단 조작
    - callback 개념이 이해가 안감
