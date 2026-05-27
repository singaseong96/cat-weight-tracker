---
name: dev-orchestrator
description: >
  cat-weight-tracker 개발 워크플로우 오케스트레이터. 피처 추가, 버그 수정, UI 개선 요청 시
  feature-implementer → test-writer → qa-verifier 팀을 구성하고 end-to-end로 완료한다.
  "~기능 추가", "~버그 수정", "~개선", "다시 구현", "재작업", "이슈 처리" 키워드가 포함된
  개발 요청이면 반드시 이 스킬을 트리거하라.
---

## 실행 모드: 에이전트 팀 (파이프라인)

```
feature-implementer → test-writer → qa-verifier
```

## Phase 0: 컨텍스트 확인

워크플로우 시작 전 기존 상태를 확인한다:

1. `_workspace/` 존재 여부 확인
   - 존재 + 부분 수정 요청 → **부분 재실행** (해당 에이전트만 재호출)
   - 존재 + 새 피처 요청 → `_workspace/`를 `_workspace_prev/`로 이동 후 **새 실행**
   - 미존재 → **초기 실행**

2. GitHub 이슈 확인 (요청에 이슈 번호가 있으면)
   ```bash
   gh issue view <번호> --repo singaseong96/cat-weight-tracker
   ```

3. 현재 브랜치 및 미커밋 변경 확인
   ```bash
   git status && git diff --stat
   ```

## Phase 1: 팀 구성 및 작업 분배

```
TeamCreate(
  team_name: "cat-dev-team",
  members: [feature-implementer, test-writer, qa-verifier]
)
```

작업 할당:
- **feature-implementer**: 코드 구현 + `npm run build` 확인
- **test-writer**: 유닛 테스트 + Playwright E2E 검증
- **qa-verifier**: 코드 리뷰 + git commit + push + 이슈 닫기

`_workspace/` 디렉토리 생성 및 작업 메타 파일 저장:
```
_workspace/
├── 00_request.md       # 사용자 요청 원문
├── 01_impl_report.md   # feature-implementer 산출물
├── 02_test_report.md   # test-writer 산출물
└── 03_qa_report.md     # qa-verifier 산출물
```

## Phase 2: 구현 (feature-implementer)

1. `implement-feature` 스킬 로드
2. `lib/types.ts` → `store/catStore.ts` → `components/` → `app/` 순서로 구현
3. `npm run build` 성공 확인
4. 수정 파일 목록을 `_workspace/01_impl_report.md`에 저장
5. test-writer에게 SendMessage: "구현 완료. 수정 파일: [목록]"

## Phase 3: 테스트 (test-writer)

1. `test-and-verify` 스킬 로드
2. `__tests__/` 유닛 테스트 작성/수정
3. `npm test` 실행 — 전체 통과 확인
4. `verify-{feature}.mjs` 작성 및 실행 — 스크린샷 저장
5. 결과를 `_workspace/02_test_report.md`에 저장
6. qa-verifier에게 SendMessage: "테스트 완료. 스크린샷: [경로]"

**구현 버그 발견 시**: feature-implementer에게 SendMessage로 피드백 전송 후 재구현 요청

## Phase 4: QA 및 완료 (qa-verifier)

1. `review-and-qa` 스킬 로드
2. 스크린샷 확인 + 코드 리뷰
3. `npm run build` + `npm test` 최종 확인
4. git commit + push
5. 관련 GitHub 이슈 닫기
6. 결과를 `_workspace/03_qa_report.md`에 저장
7. 오케스트레이터에게 완료 보고

## 에러 핸들링

| 상황 | 처리 |
|------|------|
| 빌드 실패 | feature-implementer 재작업 (1회) |
| 테스트 실패 | feature-implementer에게 버그 피드백 |
| E2E 셀렉터 오류 | test-writer가 셀렉터 전략 변경 |
| 2회 반복 실패 | 오케스트레이터가 사용자에게 보고 후 중단 |

## 테스트 시나리오

**정상 흐름**: "체중 알림 기능 추가해줘"
1. feature-implementer: types → store → component → page 구현, 빌드 성공
2. test-writer: 유닛 테스트 3개 작성, npm test 통과, E2E 스크린샷 2장
3. qa-verifier: 리뷰 완료, 커밋, 이슈 닫기

**에러 흐름**: 빌드 실패
1. feature-implementer가 TypeScript 에러로 빌드 실패
2. 직접 수정 후 재빌드 시도
3. 2회 실패 시 오케스트레이터가 사용자에게 상세 에러 보고
