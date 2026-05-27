# PRD: 고양이 체중 기록 앱 (Cat Weight Tracker)

## Problem Statement

고양이 보호자들은 고양이의 체중 변화를 꾸준히 기록하고 추적하고 싶지만, 별도의 도구 없이는 체중 변화 추이를 파악하기 어렵다. 특히 여러 마리를 키우는 경우, 각 고양이별 체중 이력과 목표 체중을 한 곳에서 관리하기 어렵다.

## Solution

여러 마리의 고양이를 등록하고, 각 고양이별로 체중을 날짜별로 기록하며 추이 그래프로 시각화하는 웹 앱. 별도 회원가입이나 서버 없이 브라우저 로컬스토리지에 데이터를 저장하여 즉시 사용 가능하다.

## User Stories

1. As a cat owner, I want to add a new cat profile with a name and optional photo, so that I can track multiple cats separately.
2. As a cat owner, I want to view a list of all my registered cats, so that I can quickly switch between profiles.
3. As a cat owner, I want to delete a cat profile, so that I can remove cats I no longer need to track.
4. As a cat owner, I want to record a weight entry with a date and kg value, so that I can build a weight history.
5. As a cat owner, I want to view all past weight entries for a specific cat in chronological order, so that I can see the full history.
6. As a cat owner, I want to edit a previously recorded weight entry, so that I can correct mistakes.
7. As a cat owner, I want to delete a weight entry, so that I can remove incorrect records.
8. As a cat owner, I want to see a line graph of my cat's weight over time, so that I can visually understand trends.
9. As a cat owner, I want to set a target weight for each cat, so that I can track progress toward a health goal.
10. As a cat owner, I want to see the target weight displayed as a reference line on the graph, so that I can compare current weight to the goal.
11. As a cat owner, I want to see the most recent weight and the change since last entry on the cat's profile card, so that I can quickly assess progress.
12. As a cat owner, I want the app to work immediately without sign-up or installation, so that I can start tracking right away.
13. As a cat owner, I want my data to persist between browser sessions, so that I don't lose my records.
14. As a cat owner, I want a mobile-friendly layout, so that I can record weight right after a weigh-in.
15. As a cat owner, I want a cute and friendly UI theme, so that using the app feels pleasant.
16. As a cat owner, I want weight values to always be in kg, so that the unit is consistent and I don't need to convert.
17. As a cat owner, I want to see a summary of min/max/average weight on the graph view, so that I can understand the overall range.

## Implementation Decisions

### Modules

**1. CatStore (로컬스토리지 상태 관리)**
- 고양이 프로필 및 체중 기록 전체를 관리하는 핵심 모듈
- `useCatStore` hook 형태로 노출 (Zustand 또는 useReducer + Context)
- 인터페이스: `addCat`, `deleteCat`, `updateCat`, `addWeightEntry`, `updateWeightEntry`, `deleteWeightEntry`
- 상태 변경 시 자동으로 localStorage에 직렬화/역직렬화

**2. CatProfile (고양이 프로필 컴포넌트)**
- 고양이 이름, 가장 최근 체중, 목표 체중 대비 변화량 표시
- 클릭 시 상세 뷰로 이동

**3. WeightEntryForm (체중 입력 폼)**
- 날짜 (기본값: 오늘) + 체중(kg) 입력
- 추가/수정 모드 공유

**4. WeightChart (체중 추이 그래프)**
- Recharts `LineChart` 사용
- X축: 날짜, Y축: 체중(kg)
- 목표 체중 `ReferenceLine` 표시
- min/max/평균 통계 표시

**5. CatForm (고양이 프로필 추가/수정 폼)**
- 이름 + 목표 체중 입력
- 추가/수정 모드 공유

### 데이터 스키마

```typescript
type Cat = {
  id: string;
  name: string;
  targetWeight?: number; // kg
  createdAt: string; // ISO date
};

type WeightEntry = {
  id: string;
  catId: string;
  weight: number; // kg
  date: string; // ISO date (YYYY-MM-DD)
  createdAt: string;
};
```

### 라우팅

- `/` — 고양이 목록
- `/cats/[id]` — 고양이 상세 (그래프 + 기록 목록)

### 기술 스택

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Chart**: Recharts
- **State**: Zustand + localStorage persistence
- **Language**: TypeScript

## Testing Decisions

- 좋은 테스트는 구현 세부사항이 아니라 외부 동작(입력 → 출력)만 검증한다.
- **CatStore**: 단위 테스트 — `addCat`, `deleteWeightEntry` 등 스토어 로직이 올바르게 상태를 변경하는지 검증
- **WeightChart**: 주어진 데이터로 그래프가 올바른 데이터 포인트를 렌더링하는지 검증
- **WeightEntryForm**: 유효하지 않은 입력(음수 체중, 미래 날짜 등) 처리 검증

## Out of Scope

- 사용자 계정 / 인증
- 클라우드 동기화 또는 다기기 지원
- 사진 업로드
- 알림 / 리마인더
- 데이터 export/import (JSON 백업)
- lbs 단위 지원
- 수의사 연동 또는 의료 기록

## Further Notes

- 로컬스토리지 한계 (~5MB)는 텍스트 기반 체중 기록에선 사실상 무제한으로 충분하다.
- 향후 데이터 백업 필요성이 생기면 JSON export/import를 1순위 확장 기능으로 고려.
