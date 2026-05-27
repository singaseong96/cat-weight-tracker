---
name: implement-feature
description: >
  cat-weight-tracker에 새 피처를 end-to-end로 구현한다. 타입 → 스토어 → 컴포넌트 → 페이지
  전 레이어를 관통하는 변경을 작성하고 빌드까지 확인. 고양이 앱에 기능을 추가하거나,
  버그를 수정하거나, 기존 피처를 개선할 때 반드시 이 스킬을 사용하라.
---

## 구현 순서

1. **타입 확인** (`lib/types.ts`) — 새 필드/타입 필요 여부 결정
2. **스토어 수정** (`store/catStore.ts`) — 상태 액션 추가/수정
3. **유틸 로직** (`lib/`) — 순수 계산 함수는 lib에 분리
4. **컴포넌트** (`components/`) — UI 컴포넌트 작성/수정
5. **페이지** (`app/`) — 라우트 레벨 조립
6. **빌드 검증** — `npm run build` 성공 확인

## 코드 컨벤션

### 타입

```typescript
// ID: 항상 crypto.randomUUID()
// 체중: 저장 전 Math.round(v * 10) / 10
// 날짜: 'YYYY-MM-DD' 문자열
```

### 컴포넌트

- 최상단에 `"use client"` 지시어
- Tailwind 클래스만 사용, 인라인 스타일 금지
- Input 공통 클래스: `w-full rounded-xl border border-pink-200 px-4 py-2 text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300`
- 버튼: primary = `bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 rounded-xl transition`
- 위험 동작: `bg-red-400 hover:bg-red-500`

### 스토어

```typescript
// useCatStore에 액션 추가 패턴
newAction: (params) =>
  set((s) => ({
    field: s.field.map(...) // 또는 filter, concat 등
  })),
```

### 색상 팔레트 (파스텔 핑크 테마)

| 용도 | 클래스 |
|------|--------|
| 배경 | `bg-pink-50` |
| 카드 | `bg-white border-pink-100` |
| 강조 체중 | `text-pink-500` |
| 증가 | `text-red-400` |
| 감소 | `text-blue-400` |
| 보조 텍스트 | `text-gray-500` |
| 아주 보조 | `text-gray-400` |

## 삭제 패턴

고양이 삭제는 cascade — `entries`도 함께 삭제:
```typescript
deleteCat: (id) =>
  set((s) => ({
    cats: s.cats.filter((c) => c.id !== id),
    entries: s.entries.filter((e) => e.catId !== id),
  })),
```

## 모달 패턴

```tsx
{showSomething && (
  <Modal title="제목" onClose={() => setShowSomething(false)}>
    <ComponentForm
      onSubmit={(data) => { doAction(data); setShowSomething(false); }}
      onCancel={() => setShowSomething(false)}
    />
  </Modal>
)}
```

## 주의사항

- `app/cats/[id]/page.tsx`는 `"use client"` 페이지 — `useParams` 사용
- Recharts 컴포넌트는 `"use client"` 필수
- localStorage persist는 Zustand `persist` 미들웨어가 자동 처리
