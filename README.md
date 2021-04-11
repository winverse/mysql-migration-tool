# 개발 환경

### mysql

  - Ver 8.0.23 for osx10.16 on x86_64 (Homebrew)  
### nodejs 
  - v14.15.0


### yarn
 - 1.22.5


# 테스트
 - config 경로에 config.example.json 을 복사한뒤에 config.json 파일을 만들고 내용을 환경에 맞게 적어주세요
  

 ## 명령어(scripts)

  - `dev:generator`: 개발 환경에서 migration파일들을 "생성" 합니다. 만약 이전과 다른 내용이 없다면 파일을 생성하지 않습니다.
  
  - `dev:runner <DBName>`: 개발 환경에서 migration 파일들을 "적용"합니다. DBName을 입력하지 않는다면 cli-prompt로 입력화면이 뜨게 됩니다.

  - `build`: typescript compile command
  - `prod:generator`: 프로덕트 환경에서 migration파일들을 "생성" 합니다. 만약 이전과 다른 내용이 없다면 파일을 생성하지 않습니다.
  - `prod:runner <DBName>`: 프로덕트 환경에서 migration 파일들을 "적용"합니다. DBName을 입력하지 않는다면 cli-prompt로 입력화면이 뜨게 됩니다.


-  `reset`: 삭제해도 무관한 파일들을 삭제합니다.
 