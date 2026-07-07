# Project Context
This project is the Employer Portal frontend.
Implementation specs are located in the `specs/` directory:
- `specs/functional/` — functional requirements
- `specs/acceptance_criteria/` — acceptance criteria
- `specs/technical/` — technical design docs

When generating code, ALWAYS read the relevant spec files first before implementation.

# Core Instructions
- **Main Goal**: Achieve full feature parity with the existing React application — the Angular app must replicate the same UI, functionality, and user experience using Angular best practices
- Build a production-ready Angular 18 employer portal using React code as a **UI/styling reference only** (Figma-generated prototype — no real APIs or business logic)
- **Reuse from React**: Tailwind classes, layout structure, theme, Shadcn component styling, fonts
- **Do NOT reuse**: hardcoded data, inline logic, React-specific patterns (hooks, JSX, React Router)
- React code path will be provided when needed

# Tech Stack
- Angular 18, standalone components, `ChangeDetectionStrategy.OnPush`
- **Tailwind CSS v4** (via `@tailwindcss/postcss`) — copy classes directly from React
- Shadcn-style UI components rebuilt for Angular in `src/app/shared/ui/`
- `lucide-angular` for icons
- **DM Sans** (primary) + **Bebas Neue** (accent) fonts via Google Fonts
- Angular CDK for overlays, dialogs, a11y, drag/drop
- `@angular/animations` for motion
- **ngx-charts** for charts and data visualizations (React uses Recharts)
- Reactive Forms (strictly typed), `HttpClient`, NgRx (when needed)
- Jest + jest-preset-angular for tests
- Prettier + ESLint (`angular-eslint`)

# Architecture (Standard Angular CLI — Single App)

## Structure
```
/
├── src/
│   ├── app/
│   │   ├── core/           (interceptors, guards, services, content)
│   │   ├── shared/
│   │   │   ├── ui/         (Shadcn-equivalent Angular components with Tailwind)
│   │   │   ├── models/     (interfaces, DTOs, enums)
│   │   │   ├── utils/      (cn() utility, pipes, directives, helpers)
│   │   │   └── auth/       (auth service, guards, interceptors)
│   │   ├── layout/         (header, sidebar, layout-shell)
│   │   └── features/       (lazy-loaded feature modules)
│   ├── assets/
│   ├── environments/
│   ├── styles.css
│   └── main.ts
├── angular.json
├── tsconfig.json
└── package.json
```
- Each feature domain is a **lazy-loaded route** under `src/app/features/<domain>/`
- Shared code in `src/app/shared/` only — never duplicate across features
- Path aliases (`@employer-portal/shared-ui`, `@employer-portal/shared-models`, etc.) in `tsconfig.json` point to `src/app/shared/*/index.ts` for clean imports

## Parallel Development
- Two developers can work in parallel by owning **separate feature folders** and **separate shared modules**

## Why NOT Module Federation
- Only 2 developers — MFE overhead (manifest files, singleton config, remote loading, fallback UI) adds complexity without benefit
- All features deploy together as a single app — simpler CI/CD pipeline
- Lazy-loaded routes provide the same code-splitting benefits as MFE remotes
- Can migrate to MFE later if team size grows significantly (5+ teams)

## Bootstrap
- `bootstrapApplication()` with functional providers — NO `NgModule`-based bootstrap
- Register routes with `withComponentInputBindings()`, HTTP with `withInterceptors()`, animations with `provideAnimations()`

# Component Design
- Standalone components with `OnPush` on **all** components — avoid mutating objects/arrays, always return new references
- Signal `input()` and `output()` for parent-child communication
- Keep components small and focused — each logical UI block is its own component
- Use `ng-content`, `@ContentChild`/`@ContentChildren` for flexible composition in shared UI
- Do NOT pass complex logic through templates (nested ternaries, heavy expressions)
- **Smart components**: data loading via services, state, routing, side effects
- **Presentational components**: inputs/outputs only, no service injection, rendering only
- **Control flow**: `@if`/`@else`, `@for` + `track`, `@switch`/`@case`, `@defer` (with `@placeholder`, `@loading`, `@error`) — NO legacy directives (`*ngIf`, `*ngFor`, `*ngSwitch`)
- **Signals**: `signal()` for local state, `computed()` for derived values (prefer over functions in templates), `effect()` sparingly for side effects, `toSignal()`/`toObservable()` for interop

## Shared UI Library (`src/app/shared/ui/`)
- Rebuild Shadcn components as Angular equivalents with same Tailwind classes and visual output
- `cn()` utility (clsx + tailwind-merge) in `src/app/shared/utils/`; `cva`-equivalent for variants
- **One reusable component per pattern** — never reimplement per feature; extend shared component for new variations
- Components: button, card, input, label, textarea, select, checkbox, radio-group, switch, badge, dialog, sheet, tabs, table, alert, progress, avatar, breadcrumb, dropdown-menu, popover, tooltip, separator, skeleton, scroll-area, sidebar, pagination, accordion, calendar

# UI & Styling
- **Tailwind CSS v4** — copy classes from React source for pixel-perfect match
- Port React theme to global stylesheet: CSS custom properties, light/dark mode (`.dark` class toggle), `@theme inline` block
- Design tokens (colors, spacing, radius, shadows, typography) defined **once globally** — never hardcode in components
- Extract repeated patterns into global utility classes or `@apply` — component-scoped styles only for overrides
- Preserve responsive breakpoints (`lg:`, `md:`, `sm:`)
- UI must closely match React app in spacing, alignment, typography, and hierarchy
- **No inline styles** — use Tailwind utility classes or CSS custom properties for all styling; never use `style="..."` in templates

## Theming & Color Tokens
- **No hardcoded hex colors** in components, templates, or mock data — all colors must reference CSS custom properties via Tailwind utility classes
- All theme colors are defined **once** in `src/styles.css` under `:root` (and `.dark` for dark mode), then registered in the `@theme inline` block so Tailwind generates utilities
- Changing a single variable value in `styles.css` reflects across the entire application
- **Token categories** defined in `:root`:
  - **Brand**: `--brand-primary`, `--brand-primary-hover`, `--brand-accent` → Tailwind: `bg-brand`, `hover:bg-brand-hover`, `text-brand-accent`
  - **Text**: `--text-heading`, `--text-dark` → Tailwind: `text-text-heading`, `text-text-dark`
  - **Navigation**: `--nav-text`, `--nav-active-bg` → Tailwind: `text-nav-text`, `bg-nav-active-bg`
  - **AI Assistant**: `--ai-primary`, `--ai-bg`, `--ai-border`, `--ai-hover` → Tailwind: `text-ai`, `bg-ai-bg`, `border-ai-border`, `hover:bg-ai-hover`
  - **Status/Badge**: `--status-success-bg`, `--status-success-text`, `--status-info-bg`, `--status-info-text`, `--status-destructive-bg`, `--status-destructive-text`
  - **Quick Actions**: `--action-blue`, `--action-green`, `--action-cyan`
  - **Shadcn base tokens**: `--background`, `--foreground`, `--card`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, etc.
- **Adding a new color**: (1) add CSS variable to `:root` in `styles.css`, (2) register in `@theme inline` as `--color-<name>: var(--your-var)`, (3) use as `bg-<name>` / `text-<name>` / `border-<name>` in templates
- **Never** use `bg-[#hex]`, `text-[#hex]`, or `border-[#hex]` arbitrary values — always map to a token
- Standard Tailwind palette colors (`gray-*`, `blue-*`, `green-*`, `red-*`, `orange-*`) are acceptable for general-purpose shading (e.g., `bg-gray-50`, `text-gray-600`)

## Responsive Design
- **Web-first** but must work well on tablets and phones — no horizontal scroll, no cut-off content
- Use Tailwind responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`) — avoid hardcoded inline `font-size` or `width`
- Grids should collapse gracefully: e.g., `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Section padding/margin should scale: `py-8 md:py-12 lg:py-16`
- Navigation: persistent sidebar on `lg+`, slide-in overlay drawer on smaller screens with backdrop
- Touch targets: minimum **44px** for interactive elements on touch devices
- Tables: wrap in `overflow-x-auto` for mobile scroll
- Test at 320px, 768px, 1024px, 1440px — no breakage at any width

# Services, API & Business Logic
- **All business logic in services** — components stay thin
- Each feature domain has its own service(s) for API calls, data transformation, error handling, caching
- `HttpClient` inside services only — strongly typed interfaces in `src/app/shared/models/`
- `environment.ts` / `environment.prod.ts` for API base URLs and config — never hardcode
- NEVER call APIs directly from components
- Handle loading, error, and empty states in UI

## Mock Data Strategy
- Mock/hardcoded data from React goes **inside Angular services** — never in components or templates
- Services return mock data with the **same method signatures and return types** as future real API calls
- Keep mock data in separate `.mock.ts` files imported by the service — not inline
- Components consume data **only through service methods** — unaware if data is mocked or real
- When APIs are ready, just replace the service method body — consumers stay unchanged

## Dependency Injection
- Use `inject()` function — preferred over constructor injection in Angular 18
- `providedIn: 'root'` for global singletons; feature-level providers for local services
- No monolithic SharedModule — smaller focused groupings, standalone imports where needed
- Avoid providing the same service in both lazy-loaded and eagerly-loaded contexts

## HTTP & Interceptors
- **Functional interceptors** only (Angular 18 standard) — NOT class-based
- Register via `provideHttpClient(withInterceptors([...]))`
- Interceptors for: auth headers, error handling (401/403/500), logging — in `core/` or `src/app/shared/auth/`
- Keep interceptors generic, reusable, and free of feature-specific logic

# State Management
- **Local UI state**: signals
- **Feature-shared**: services with signals and/or RxJS (`BehaviorSubject`, `ReplaySubject`)
- **Cross-feature / complex**: NgRx (store slices by domain, Effects, facades/selectors)
- No NgRx for simple forms, local UI state, or static data
- `sessionStorage` only when state must survive page refresh with a clearly defined use case

# Forms, Tables & Dialogs
- **Reactive Forms ONLY** with strict typing (`FormGroup<T>` / `FormControl<T>`) — no template-driven forms
- Always include validation, error messages, loading/submitting states
- Form controls must use shared wrapper components from `src/app/shared/ui/`
- Tailwind-styled tables (matching Shadcn) with sorting, pagination, filtering; break complex tables into reusable components
- Keep table state (page, sort, filters) in smart/container components or services
- Angular CDK for dialog/sheet behavior, Tailwind for styling; shared dialog services for common patterns
- Do NOT implement custom modal logic from scratch

# Routing & Feature Flags
- Lazy-loaded standalone route definitions; each feature owns its routes
- `withComponentInputBindings()` to bind route/query params directly to component signal inputs
- No route resolvers — navigate first, show skeleton, load data via services
- `FeatureFlagService` in `core/` — centralized flag access, runtime toggling support
- `@if` in templates + route guards for flagged features; remove flags and dead code after rollout

# Content Management (i18n-Ready)
- **No hardcoded UI text in templates or component classes** — all user-facing strings (labels, headings, button text, placeholders, error messages, aria-labels) must come from the content JSON file
- Single content file per language: `src/assets/i18n/en.json`, organized by feature sections: `common`, `header`, `sidebar`, `navigation`, `dashboard`, `welcome`, `login`, etc.
- Type definitions for content structure in `src/app/core/content/content.model.ts` — update when adding new sections
- `ContentService` (`src/app/core/services/content.service.ts`) provides typed access — inject in components via `inject(ContentService)`
- Components reference content as `content.<section>.<key>` in templates (e.g., `{{ content.dashboard.keyMetrics }}`)
- Navigation labels use `labelKey` in config, resolved via `ContentService.getNavLabel()`
- **What goes in `en.json`**: section headings, button text, form labels, placeholders, static descriptions, error messages, alt text, aria-labels
- **What stays in `.mock.ts` files**: dynamic data that simulates API responses (messages, notifications, activities, documents) — these will be replaced by real API data
- Adding a new component: add its content section to `en.json`, extend the interface in `content.model.ts`, access via `ContentService`
- Future i18n: add `fr.json`, `es.json`, etc. with the same structure; update `ContentService` to load the appropriate file

# Code Quality
- No `any` — use `unknown` when type is truly unknown; **interfaces** for models (no runtime cost); classes only when behavior is needed
- Strict equality (`===` / `!==`) always
- Observables over Promises; clean up subscriptions via: `toSignal()` → `async` pipe → `takeUntilDestroyed()` (in preference order)
- Avoid manual `.subscribe()` — if necessary, always pair with `takeUntilDestroyed(this.destroyRef)`
- Do NOT use `ngOnDestroy` + `Subject` pattern — `takeUntilDestroyed()` is the Angular 18 standard
- **Never** call functions in templates — use `computed()` signals or pure pipes
- No jQuery; no direct DOM manipulation; use Angular abstractions (`DOCUMENT` token, `Renderer2`) for SSR readiness
- **kebab-case** files; suffixes: `.component.ts`, `.service.ts`, `.directive.ts`, `.pipe.ts`, `.route.ts`, `.model.ts`, `.mock.ts`
- `try/catch` only when failure is expected and handleable — not on every method
- **Prettier** for formatting + **ESLint** with `angular-eslint` for lint; optionally Husky for pre-commit hooks

# Error Handling & Observability
- Override Angular's `ErrorHandler` for centralized logging (e.g., Sentry) and user-friendly notifications (toast/snackbar) — never swallow errors silently
- HTTP error interceptor: `401` → login redirect, `403` → access denied, `500` → error toast
- Feature-specific handling can override global behavior

# Security
- Trust Angular's built-in sanitization; no `bypassSecurityTrust*` unless absolutely necessary and reviewed
- No `innerHTML` with unsanitized input — prefer `[textContent]` / `{{ }}`
- No tokens/secrets in `localStorage` — prefer secure, httpOnly cookies
- Interceptors for auth token management; validate all user inputs at boundaries
- Follow OWASP front-end guidelines

# Accessibility (a11y)
- All interactive elements keyboard accessible; semantic HTML over generic `<div>`/`<span>`
- `aria-label`/`aria-labelledby` on components lacking visible text; WCAG AA contrast minimum
- Never rely on color alone; `alt` text on all images
- Angular CDK `a11y`: `FocusTrap` (modals), `LiveAnnouncer` (dynamic updates), `FocusMonitor` (focus origin)
- Do NOT override ARIA attributes on shared-ui components; test with screen readers and keyboard navigation

# Performance
- `OnPush` on all components; `@defer` for heavy components; `@for` with `track`; no functions in templates
- `NgOptimizedImage` (`ngSrc`) for all images — lazy loading, priority hints, layout shift prevention
- Tree-shakeable imports; Tailwind purge in production
- Monitor bundle size in CI; avoid barrel file re-exports that pull in unused code

# Testing
- **Jest** + **jest-preset-angular** as the test runner and assertion library (`expect`, `jest.spyOn`, `jest.fn()`)
- `TestBed` for services/logic; `provideHttpClientTesting()` for HTTP — no manual `HttpClient` mocks
- **Angular Testing Library** for component tests — test behavior, not internals
- Files alongside source (`*.spec.ts`); **Arrange → Act → Assert**
- Config files: `jest.config.ts` (root config), `tsconfig.spec.json` (test TS config)

# Code Generation Workflow
When given a React file path:
1. **Read** React source — layout, Tailwind classes, component composition
2. **Extract UI** — copy Tailwind classes and structure into Angular templates
3. **Implement** — smart/presentational split, `inject()` for DI, services for data, typed Reactive Forms, loading/error/empty states, `shared-ui` components, `lucide-angular`, `@angular/animations`
4. **Mock data to services** — API-ready signatures, separate `.mock.ts` files
5. Common styles → global stylesheets; business logic → services
6. Apply all rules from this document