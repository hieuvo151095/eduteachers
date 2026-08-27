# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is a **v0.app-generated Next.js prototype** ("ECO School Giáo viên") of a Vietnamese school teacher mobile app. It's a client-side-only UI mockup — there is no backend, no database, and no auth. All content is Vietnamese-language. The entire app renders inside a fake iPhone frame (`app/page.tsx`) with a fixed 390×844 screen, simulating a native mobile app in the browser.

Screen state is driven by simple `useState` switches at each level (root `screen`, then per-feature sub-screens) rather than a router — there is only one real Next.js route (`/`).

## Commands

```bash
pnpm dev      # start dev server (Next.js, Turbopack by default in v16)
pnpm build    # production build
pnpm lint     # eslint .
```

Package manager is **pnpm** (pnpm-lock.yaml present). There is no test suite configured.

Note: `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `pnpm build` will succeed even with type errors — use `tsc --noEmit` or editor diagnostics to actually check types.

## Architecture

### Navigation model
`app/page.tsx` owns the top-level screen state union: `'home' | 'thuc-don' | 'attendance' | 'messaging' | 'ket-qua-hoc-tap' | 'phieu-be-ngoan' | 'danh-sach-hoc-sinh' | 'hoat-dong'`. All 7 feature entry points on the home screen are wired to navigation. Each feature is a self-contained "app" component that receives an `onBack` callback and manages its own internal screen/sub-screen state the same way (a local discriminated-union `useState`, no routing library). Follow this pattern for any new feature: one root component per feature under `components/teachers/<feature>/`, taking `onBack`, internally switching between its own sub-screens.

### Feature modules (`components/teachers/`)
- `home-screen.tsx` — main dashboard: teacher check-in button, promo/school cards, class selector, grid of feature entry points (`ENTRY_POINTS`), today's attendance summary.
- `check-in-button.tsx` — teacher check-in/check-out widget with its own status state machine (`CheckInStatus`).
- `shared/header.tsx` — `AppHeader` (back button, title, subtitle, optional class-change button) and `classSubtitle()` helper shared across features. Import from here rather than duplicating headers.
- `thuc-don-lop/` (Thực đơn lớp = "Class menu") — `index.tsx` orchestrates `main-screen`, `week-picker-sheet`, `ingredient-sheet`, `image-viewer`. Drills down: weekly menu → food item → ingredient list → ingredient traceability/image details.
- `attendance/` — split across `index.tsx` (orchestrator), `overview-screen`, `student-list-screen`, `absence-list-screen`, `confirm-screen`, `date-picker-sheet`, `class-picker-sheet`, `shared.tsx` (shared types/helpers including `Session = 'sang' | 'chieu'`). Covers check-in/check-out rosters, absence requests/approval, per-session (morning/afternoon) tracking.
- `messaging/` — single large `index.tsx` (~1300 lines) implementing a chat app: conversation list with class filters, direct chat, group chat (with pin/unpin, read-only mode), pinned-messages view, group creation flow, and group member management — all as sibling `Screen*` components switched via a `MessagingScreen` discriminated union in the parent. Includes a module-level mutable array (`DYNAMIC_GROUPS`) used to persist created groups across re-renders without a real store.
- `ket-qua-hoc-tap/` (Kết quả học tập = "Academic results") — `index.tsx` + `student-picker-sheet` + `cap1-screen` (Cấp 1: tabbed subject scores) + `cap23-screen` (Cấp 2/3: score tables with DDGTX columns). Grade level (cap) is derived from the selected class.
- `phieu-be-ngoan/` (Phiếu bé ngoan = "Good behavior report") — `index.tsx` + `phat-phieu-screen` (issue reports to students) + `lich-su-screen` (history view) + `chu-ky-picker-sheet` (week picker) + `missed-weeks-banner`. Supports back-filling up to `PHIEU_PHAT_BU_LIMIT_WEEKS` past weeks.
- `danh-sach-hoc-sinh/` (Danh sách học sinh = "Student list") — `index.tsx` + `student-list-screen` + `student-profile-screen`. Shows class roster with profile drill-down.
- `hoat-dong/` (Hoạt động = "Activity/News feed") — `index.tsx` + `feed-screen` + `compose-screen`. Teacher posts activity updates with optional photo attachments.

**Shared sheet**: `attendance/class-picker-sheet.tsx` is imported directly by `phieu-be-ngoan`, `danh-sach-hoc-sinh`, and `hoat-dong` — it's a de-facto shared component despite its path.

**Toast pattern**: features that need ephemeral confirmations (phieu-be-ngoan, hoat-dong) define a local `Toast` component at the top of `index.tsx` using fixed positioning and CSS opacity transitions.

### Data layer
`lib/mock-data.ts` is the single source of truth for all mock domain data and types. Data is generated deterministically from seeds (index-based modulo logic) rather than randomized, so re-renders are stable. `TODAY` is hardcoded to `2026-06-30`; all date-dependent mock data is generated relative to that constant, not `new Date()` — keep this in mind when reasoning about "today."

Key exports by feature:
- Thực đơn: `MOCK_THUC_DON_WEEKS`, `ThucDonTuan/Ngay/Bua/Mon/NguyenLieu` types
- Điểm danh: `DIEM_DANH_CLASSES`, `DIEM_DANH_STUDENTS`, `createInitialCheckInRecords`, `createInitialCheckOutRecords`, `DIEM_DANH_ABSENCE_REQUESTS`
- Messaging: `MOCK_CONVERSATIONS`, `MOCK_MESSAGES_DIRECT/GROUP`, `MOCK_TEACHER_INFO`
- Kết quả học tập: `KET_QUA_HOC_TAP_CLASSES/STUDENTS`, `getCap1TabData`, `getCap23TabData`, `capHocFromGrade`
- Phiếu bé ngoan: `PHIEU_BE_NGOAN_RECORDS`, `PHIEU_TUAN_OPTIONS`, `PHIEU_TUAN_DEFAULT_ID`, `phieuSentCount`, `phieuIsFullySent`, `computeMissedTuanOptions`
- Danh sách học sinh: `DANH_SACH_HOC_SINH`, `HocSinhProfile` (richer profile type than `DiemDanhStudent`)
- Hoạt động: `HOAT_DONG_POSTS`, `HoatDongPost`, `HoatDongAttachment`

When adding new mock entities, follow the existing pattern: define an interface, add a deterministic generator function, and export a `MOCK_*` constant.

Note: each feature that needs a class list imports its own scoped constant (`DIEM_DANH_CLASSES`, `KET_QUA_HOC_TAP_CLASSES`, etc.) rather than the shared `MOCK_CLASSES` — class lists intentionally differ per feature.

### Styling / UI kit
- Tailwind v4 (`@import 'tailwindcss'` in `app/globals.css`), shadcn `base-nova` style with `neutral` base color, CSS variables for theming (see `components.json`). Path aliases: `@/components`, `@/lib`, `@/hooks`, `@/components/ui`.
- Only one shadcn primitive exists: `components/ui/button.tsx`. Most UI is hand-rolled Tailwind + inline SVG icons. `lucide-react` is used for standard icons (chevrons, X, search, etc.).
- Use the `cn()` helper (`lib/utils.ts`, clsx + tailwind-merge) for conditional class composition.
- All screens assume light mode / a phone-sized viewport; there's no responsive design for desktop beyond the centered phone frame in `app/page.tsx`.
- Bottom sheets use `fixed` positioning. The scroll container in `app/page.tsx` has `transform: translateZ(0)` to establish a containing block so `position: fixed` elements anchor to the phone viewport rather than the browser window.

### Conventions specific to this repo
- Every interactive component starts with `'use client'` — nothing here is a server component beyond the root layout.
- Vietnamese labels, status strings, and even some type literal values (e.g. `AttendanceStatus = 'chưa-đón' | 'có-mặt' | ...`) are in Vietnamese — preserve this when extending enums/unions.
- Feature "apps" are added to `app/page.tsx`'s screen union and rendered conditionally; there's no lazy-loading or code-splitting set up per screen.
