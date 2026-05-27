---
name: test-and-verify
description: >
  cat-weight-tracker의 유닛 테스트(vitest)와 Playwright 브라우저 E2E 검증을 작성하고 실행한다.
  새 피처 테스트, 기존 테스트 수정, 브라우저 스크린샷 확인이 필요하면 반드시 이 스킬을 사용하라.
  npm test 실행, verify-*.mjs 스크립트 작성/실행도 포함.
---

## 유닛 테스트 (vitest)

### 파일 위치 및 실행

```bash
# 위치: __tests__/
# 실행
npm test
```

### 필수 Mock 설정

```typescript
// localStorage mock (모든 스토어 테스트에 필요)
const store: Record<string, string> = {};
vi.stubGlobal("localStorage", {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = v; },
  removeItem: (k: string) => { delete store[k]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
});

// crypto mock
let uuidCounter = 0;
vi.stubGlobal("crypto", { randomUUID: () => `uuid-${++uuidCounter}` });

// ResizeObserver mock (Recharts 컴포넌트 테스트 시)
vi.stubGlobal("ResizeObserver", class {
  observe() {} unobserve() {} disconnect() {}
});
```

### 스토어 테스트 패턴

```typescript
beforeEach(() => {
  uuidCounter = 0;
  useCatStore.setState({ cats: [], entries: [] });
});

it("액션 결과 검증", () => {
  useCatStore.getState().addCat("나비", 4.5);
  expect(useCatStore.getState().cats).toHaveLength(1);
});
```

### 폼 유효성 검사 테스트 패턴

```typescript
it("유효하지 않은 입력 거부", () => {
  const onSubmit = vi.fn();
  render(<WeightEntryForm onSubmit={onSubmit} onCancel={vi.fn()} />);
  fireEvent.change(screen.getByPlaceholderText("예: 4.2"), { target: { value: "0" } });
  fireEvent.submit(screen.getByRole("button", { name: "기록" }).closest("form")!);
  expect(onSubmit).not.toHaveBeenCalled();
});
```

## E2E 검증 (Playwright)

### 스크립트 패턴

```javascript
// 파일명: verify-{feature}.mjs (프로젝트 루트)
import { chromium } from "playwright";
const SS = (n) => `screenshots/{feature}-${n}.png`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } }); // 모바일
await page.goto("http://localhost:3000");
await page.waitForLoadState("networkidle");
// ... 테스트 스텝
await browser.close();
```

### 셀렉터 규칙 (충돌 방지)

```javascript
// ✅ 모달 내 submit 버튼
await page.locator("form button[type='submit']").click();

// ✅ 위험 동작 버튼 (삭제 확인)
await page.locator(".bg-red-400").click();

// ✅ 특정 클래스 기반
await page.locator(".text-pink-500").first().isVisible();

// ❌ 텍스트만으로 버튼 클릭 (여러 매칭 가능)
// await page.click("button:has-text('추가')");  // 피하기
```

### 검증 포인트

각 E2E 스크립트에 반드시 포함:
1. happy path (정상 흐름)
2. 데이터 유지 확인 (페이지 새로고침 후)
3. 프로브 1개 이상 (엣지 케이스 — 예: 빈 입력, 0 체중)

### 스크린샷 네이밍

```
screenshots/{feature}-{step}.png
예: screenshots/calories-with-activity.png
```

## 테스트 커버리지 기준

| 대상 | 테스트 유형 | 우선순위 |
|------|-----------|---------|
| CatStore 액션 | 유닛 | 필수 |
| 폼 유효성 검사 | 유닛 | 필수 |
| 계산 로직 (lib/) | 유닛 | 필수 |
| 컴포넌트 렌더링 | 유닛 | 선택 |
| 사용자 흐름 | E2E | 필수 |
