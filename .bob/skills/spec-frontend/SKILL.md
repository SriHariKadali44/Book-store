---
name: spec-frontend
description: '# spec-frontend Command'
metadata:
  user-invocable: true
  disable-model-invocation: true
---

# spec-frontend Command
Generate comprehensive frontend specification from the prompt which user giving.

## Usage
/spec-frontend <module-name>

## Purpose
Analyzes prototype UI/UX and backend API contracts to create detailed frontend specification WITHOUT generating any code. Only creates the specification document.

## Process



1. **Define Architecture**
   - Component hierarchy
   - Module structure (feature modules, shared modules, lazy loading)
   - Service layer for API abstraction (injectable services)
   - State management strategy (component state vs NgRx/signals)
   - Reactive patterns (Observables, Subjects, async pipe)
   - Type definitions and interfaces (formalize prototype mock data)

2. **Folder Structure Convention**
   - Each component MUST have its own dedicated folder (e.g., `components/<component-name>/<component-name>.component.ts`)
   - All services MUST go in a `services/` folder (e.g., `services/<service-name>.service.ts`)
   - Example structure:
     ```
     features/<module-name>/
     ├── components/
     │   ├── <component-a>/
     │   │   ├── <component-a>.component.ts
     │   │   ├── <component-a>.component.html
     │   │   └── <component-a>.component.scss
     │   └── <component-b>/
     │       ├── <component-b>.component.ts
     │       ├── <component-b>.component.html
     │       └── <component-b>.component.scss
     ├── services/
     │   └── <module-name>.service.ts
     └── models/
         └── <module-name>.model.ts
     ```

3. **Break Down Tasks**
   - Order tasks by dependencies (Types → Services → Guards/Pipes → Components)
   - Define acceptance criteria (UI fidelity, testing, accessibility)
   - Specify files to create (but DON'T create them)
   - Include prototype component references

4. **Create Specification File**
   - Refer: `book-store\CLAUDE.md` to follow angular best practices.
   - Save to: `book-store\spec\<module-name>-frontend-spec.md`
   - Look and feel should match pixel to pixel with prototype.
   - Include task list with IDs (FE-TASK-001, FE-TASK-002, etc.)
   - Mark all tasks as Status: PENDING
   - Include dependencies graph

## Critical Rules
- ❌ DO NOT create any component files
- ❌ DO NOT generate TypeScript code
- ❌ DO NOT create service files
- ✅ DO define WHAT components are needed
- ✅ DO specify component structure


## Output
- Creates: `\Ai-App\book-store\spec\<module-name>-frontend-spec.md`
- Contains: ~15-25 ordered tasks with acceptance criteria
- References: Prototype components and backend OpenAPI
- Includes: Component mapping, service interfaces, type definitions

## Next Steps
After spec creation:
1. Review specification with team
2. Validate data models align with backend APIs
3. Begin implementation: `task frontend FE-TASK-001`
