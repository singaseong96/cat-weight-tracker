---
name: review-and-qa
description: >
  cat-weight-tracker 피처의 최종 QA 및 코드 리뷰를 수행하고 git commit + push + GitHub 이슈 닫기까지
  완료한다. 구현과 테스트가 끝난 변경사항을 검토하고 마무리하거나, 코드 품질 점검이
  필요할 때 반드시 이 스킬을 사용하라.
---

## QA 체크리스트

### 필수 확인

- [ ] `npm run build` 성공
- [ ] `npm test` 전체 통과
- [ ] TypeScript 에러 없음 (`npx tsc --noEmit`)

### UI 검증 (스크린샷 기반)

390px 모바일 뷰포트로 확인:
- 텍스트 가독성 — `text-gray-400` 이하는 너무 연함 (최소 `text-gray-500`)
- 레이아웃 깨짐 없음
- 빈 상태(empty state) 적절히 표시
- 수정된 기능 화면에 정상 반영

### 코드 리뷰 포인트

| 항목 | 확인 사항 |
|------|---------|
| 타입 안전성 | `any` 사용, 불필요한 타입 캐스팅 |
| 하드코딩 | 매직 넘버/문자열 → 상수 또는 타입으로 |
| 중복 | 같은 로직 2곳 이상 → 유틸 함수 추출 고려 |
| 불필요한 복잡도 | 과도한 추상화, 미사용 코드 |
| `"use client"` | 클라이언트 컴포넌트에 누락 여부 |

## Git 커밋 패턴

```bash
git add <수정된 파일들>  # -A 사용 금지, 파일 명시
git commit -m "$(cat <<'EOF'
<간결한 영어 한 줄 제목>

<필요 시 본문>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push
```

### 커밋 메시지 규칙

- `Add`: 새 기능 추가
- `Fix`: 버그 수정
- `Update`: 기존 기능 개선
- `Refactor`: 동작 변경 없는 코드 개선
- `Style`: 스타일/레이아웃만 변경

## GitHub 이슈 닫기

```bash
# 관련 이슈 확인
gh issue list --repo singaseong96/cat-weight-tracker --state open

# 이슈 닫기
gh issue close <번호> --repo singaseong96/cat-weight-tracker \
  --comment "구현 완료. 인수 조건 충족."
```

## 최종 보고 형식

```
## QA 결과

**빌드**: ✅ 성공
**테스트**: ✅ N개 통과
**스크린샷**: screenshots/<feature>-final.png
**커밋**: <hash>
**닫은 이슈**: #<번호>
```
