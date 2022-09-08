# 개발 환경

### mysql

- Ver 8.0.23 for osx10.16 on x86_64 (Homebrew)

### nodejs

- v16.13.0

### yarn

- 1.22.17

# 테스트

- config 경로에 config.example.json 을 복사한뒤에 config.json 파일을 만들고 내용을 환경에 맞게 적어주세요

## 명령어(scripts)

- `yarn generate`: DB와 테이블 정보가 포함된 migration파일들을 생성합니다.   
  만약 이전과 다른 내용이 없다면 파일을 생성하지 않습니다.

- `yarn run <DBName>`: migration 파일에 저장된 사항들을 다른 DB에 적용합니다.   
  만약 DBName을 입력하지 않는다면 에러가 발생합니다.

- `yarn reset`: 삭제해도 무관한 파일들을 삭제합니다.
