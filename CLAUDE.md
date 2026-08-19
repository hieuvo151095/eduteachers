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
`app/page.tsx` is the single page and owns top-level screen state (`'home' | 'thuc-don' | 'attendance' | 'messaging'`). Each feature is a self-contained "app" component that receives an `onBack` callback and manages its own internal screen/sub-screen state the same way (a local discriminated-union or string-literal `useState`, no routing library). Follow this pattern for any new feature: one root component per feature under `components/teachers/<feature>/`, taking `onBack`, internally switching between its own sub-screens.

### Feature modules (`components/teachers/`)
- `home-screen.tsx` — main dashboard: check-in button, promo/school cards, class selector, grid of feature entry points (`ENTRY_POINTS`), today's attendance summary. Only `thuc-don`, `diem-danh`, and `trao-doi` entry points are wired to navigation; others are inert placeholders.
- `check-in-button.tsx` — teacher check-in/check-out widget with its own status state machine (`CheckInStatus`).
- `thuc-don-lop/` (Thực đơn lớp = "Class menu") — multi-file feature: `index.tsx` orchestrates `food-menu-screen`, `class-switcher` (bottom sheet), `date-carousel`/`date-picker`, `ingredient-list-modal`, `ingredient-details`. Drills down: menu → food item → ingredient list → ingredient traceability details.
- `attendance/` — single large `index.tsx` (~1000 lines) covering check-in/check-out rosters, absence requests/approval, and filtering, all within one component using a `ScreenType` union.
- `messaging/` — single large `index.tsx` (~1300 lines) implementing a chat app: conversation list with class filters, direct chat, group chat (with pin/unpin, read-only mode), pinned-messages view, group creation flow, and group member management — all as sibling `Screen*` components switched via a `MessagingScreen` discriminated union in the parent. Includes a module-level mutable array (`DYNAMIC_GROUPS`) used to persist created groups across re-renders without a real store.

### Data layer
`lib/mock-data.ts` is the single source of truth for all mock domain data and types: classes, students, food menus/ingredients, attendance/checkout/absence records, and messaging conversations/messages. Data is generated deterministically from seeds (e.g. `make8DigitCode`, index-based modulo logic for attendance status distribution) rather than randomized, so re-renders are stable. `TODAY` is hardcoded to `2026-06-30`; date-dependent mock data (menus ±7 days, attendance "today") is generated relative to that constant, not the real current date — keep this in mind when reasoning about "today" in this app's data.

When adding new mock entities, follow the existing pattern: define an interface, add a generator function seeded by id/index, and export a `MOCK_*` constant built from it.

### Styling / UI kit
- Tailwind v4 (`@import 'tailwindcss'` in `app/globals.css`), shadcn `base-nova` style with `neutral` base color, CSS variables for theming (see `components.json`). Path aliases: `@/components`, `@/lib`, `@/hooks`, `@/components/ui`.
- Only one shadcn primitive exists so far: `components/ui/button.tsx`. Most UI in this codebase is hand-rolled Tailwind + inline SVG icons (not shadcn components), including custom line-art icons for each feature entry point in `home-screen.tsx`. `lucide-react` is used for standard icons (chevrons, X, search, etc.).
- Use the `cn()` helper (`lib/utils.ts`, clsx + tailwind-merge) for conditional class composition.
- All screens assume light mode / a phone-sized viewport; there's no responsive design for desktop beyond the centered phone frame in `app/page.tsx`.

### Conventions specific to this repo
- Every interactive component starts with `'use client'` — nothing here is a server component beyond the root layout.
- Vietnamese labels, status strings, and even some type literal values (e.g. `AttendanceStatus = 'đúng-giờ' | 'đi-trễ' | ...`) are in Vietnamese — preserve this when extending enums/unions so labels and codes stay consistent.
- Feature "apps" are added to `app/page.tsx`'s screen union and rendered conditionally; there's no lazy-loading or code-splitting set up per screen.
