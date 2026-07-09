---
name: task-backend
description: '# task-backend Command'
metadata:
  user-invocable: true
  disable-model-invocation: true
---

# task-backend Command
Execute specific backend task from specification, creating production Spring Boot code.

## Usage
/task-backend <task-id>

## Purpose
Implements a single backend task from the specification. This command CREATES all backend code, tests, and database migrations.

## Process
1. **Locate & Validate**
   - Find spec file in `C:\poc\specs\backend\*.md`
   - Locate task by ID (e.g., BE-TASK-001)
   - Verify Status is PENDING or IN_PROGRESS
   - **CRITICAL**: Check all dependencies are COMPLETED
   - If dependencies not met, STOP and report

2. **Update Status**
   - Change task Status to IN_PROGRESS
   - Update specification file

3. **Analyze Requirements**
   - Read prototype components referenced in task
   - Understand data structures and API needs
   - Review acceptance criteria
   - Note files to create

4. **Implement Task**
   Based on task type, create:

   **Database Tasks (BE-TASK-001, BE-TASK-002)**
   - Flyway migration scripts (`src/main/resources/db/migration/`)
   - Table creation with proper indexes
   - Foreign key relationships
   - Seed data scripts

   **Entity Tasks (BE-TASK-003)**
   - JPA entity classes with proper annotations
   - Match prototype data structures
   - Include relationships (@ManyToOne, @OneToMany)
   - Add audit fields (createdAt, updatedAt)

   **Repository Tasks (BE-TASK-004)**
   - JpaRepository interfaces
   - Custom query methods
   - Named queries with @Query
   - Pagination support

   **Service Tasks (BE-TASK-005)**
   - Service interfaces
   - Service implementations
   - Business logic from prototype
   - Transaction management (@Transactional)
   - Validation logic

   **DTO Tasks (BE-TASK-006)**
   - Request DTOs with validation annotations
   - Response DTOs matching prototype format
   - Mapper utilities

   **Controller Tasks (BE-TASK-007)**
   - REST controllers (@RestController)
   - Endpoint implementations
   - OpenAPI annotations
   - Authorization (@PreAuthorize with roles)
   - Error handling

   **Security Tasks (BE-TASK-008)**
   - SecurityConfig class
   - JWT configuration
   - Role-based access control
   - Persona-to-role mappings

   **Testing Tasks (BE-TASK-009)**
   - Unit tests for services
   - Integration tests for APIs
   - Test data builders
   - Mock configurations

5. **Verify Acceptance Criteria**
   - Check ALL criteria are met
   - Run tests (`./mvnw test`)
   - Verify compilation
   - Test with Swagger UI

6. **Update Status**
   - Change Status to COMPLETED
   - Mark all criteria as [x] checked
   - Update specification file

## Critical Rules
- ⚠️ MUST check dependencies before starting
- ⚠️ MUST update status to IN_PROGRESS before coding
- ⚠️ MUST create ALL files specified in task
- ⚠️ MUST write tests (>80% coverage)
- ⚠️ MUST match prototype data structures
- ⚠️ MUST implement authorization for personas
- ⚠️ MUST use Spring Boot best practices
- ⚠️ MUST update status to COMPLETED only when ALL criteria met

## Dependencies Check
If dependencies not met:

❌ STOP: Cannot execute BE-TASK-XXX

Dependencies not completed:
- BE-TASK-001: Status = IN_PROGRESS (required: COMPLETED)
- BE-TASK-002: Status = PENDING (required: COMPLETED)

Execute in order:
1. /task-backend BE-TASK-001
2. /task-backend BE-TASK-002
3. /task-backend BE-TASK-XXX

## Output
- Creates/modifies: Java files, SQL scripts, test files
- Updates: Specification file with COMPLETED status
- Summary: Files created, tests passed, next task

## Next Steps
After task completion:
1. Review implementation
2. Run quality checks
3. Continue to next task: `/task-backend <next-task-id>`
