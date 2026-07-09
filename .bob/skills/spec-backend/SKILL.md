---
name: spec-backend
description: '# spec-backend Command'
metadata:
  user-invocable: true
  disable-model-invocation: true
---

# spec-backend Command
Generate comprehensive backend specification from Figma prototype data requirements.

## Usage
/spec-backend <module-name>

## Purpose
Analyzes prototype components and creates detailed backend specification WITHOUT generating any code. Only creates the specification document that guides implementation.

## Process
1. **Analyze Prototype Data**
   - Read components from `prototype/src/app/components/<module>/`
   - Extract data structures from mock data
   - Identify API requirements from UI interactions
   - Map business rules and validation patterns

2. **Define Architecture**
   - Database schema structure (tables, columns, relationships, indexes)
   - OpenAPI specification structure (endpoints, schemas, security)
   - Service layer design (business logic, transactions)
   - Security model (JWT, RBAC, persona mappings)

3. **Break Down Tasks**
   - Order tasks by dependencies (DB → Entities → Repos → Services → Controllers)
   - Define acceptance criteria for each task
   - Specify files to create (but DON'T create them)
   - Include prototype data references

4. **Create Specification File**
   - Refer: `backend/CLAUDE.md` to follow java best practices.
   - Save to: `C:\poc\specs\backend\<module-name>-backend-spec.md`
   - Include task list with IDs (BE-TASK-001, BE-TASK-002, etc.)
   - Mark all tasks as Status: PENDING
   - Include dependencies graph

## Critical Rules
- ❌ DO NOT create any code files
- ❌ DO NOT generate OpenAPI YAML
- ❌ DO NOT create SQL scripts
- ✅ DO define WHAT should be created
- ✅ DO specify structure and requirements
- ✅ DO reference prototype components
- ✅ DO order tasks by dependencies

## Output
- Creates: `C:\poc\specs\backend\<module-name>-backend-spec.md`
- Contains: ~20-30 ordered tasks with acceptance criteria
- References: Prototype components and data structures
- Includes: Database design, API contracts, security model

## Next Steps
After spec creation:
1. Review specification with team
2. Validate API contracts will meet frontend needs
3. Begin implementation: `/task-backend BE-TASK-001`
