# Motivation
- [Sequelize](https://sequelize.org/)에 존재하는 migration 기능을 보고서 한번 구현해보고 싶었습니다.
- 간단하게 만들기 위해서 외부 의존성은 mysql2만 사용하였습니다.

# Simple mysql migration tool
- 데이터 베이스 스키마를 기록하여 다른 데이터 베이스에 migration을 자동으로 수행해주는 프로그램입니다.
- `yarn generate` 명령어를 통해서 데이터 베이스에 대한 변화를 추가적으로 감지하여 변경 된 부분만 데이터 베이스 스키마를 기록합니다.
- `yarn run <DBName>` migration을 적용할 DB 이름을 적어주면 변경된 사항들을 단계적으로 적용하고 적용된 사항들을 DB에 기록합니다.
- 테이블에 대한 기본적인 DDL 문법들이 적용 가능합니다.

# API
- [X] createTable
- [X] dropTable
- [X] addColumn
- [X] removeColumn
- [X] changeColumn

# 실행

- config 경로에 config.example.json 을 복사한뒤에 config.json 파일을 만들고 내용을 환경에 맞게 적어주세요

## 명령어(scripts)

- `yarn generate`: DB와 테이블 정보가 포함된 migration파일들을 생성합니다.   
  만약 이전과 다른 내용이 없다면 파일을 생성하지 않습니다.

- `yarn run <DBName>`: migration 파일에 저장된 사항들을 다른 DB에 적용합니다.   
  만약 DBName을 입력하지 않는다면 에러가 발생합니다.

- `yarn reset`: 삭제해도 괜찮은 무관한 파일들을 삭제합니다.
