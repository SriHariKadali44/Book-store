# task-frontend Command
Execute specific frontend task from specification, creating production Angular 18 code.

## Usage
/task-frontend <task-id>

## Purpose
Implements a single frontend task from the specification. This command CREATES all Angular components, services, hooks, and tests while maintaining prototype fidelity.

## Process
1. **Locate & Validate**
   - Find spec file in `C:\Ai-App\specs\frontend\*.md`
   - Locate task by ID (e.g., FE-TASK-001)
   - Verify Status is PENDING or IN_PROGRESS
   - **CRITICAL**: Check all dependencies are COMPLETED
   - If dependencies not met, STOP and report

2. **Update Status**
   - Change task Status to IN_PROGRESS
   - Update specification file

3. **Analyze Requirements**
   - Understand task referenced in task
   - Study UI structure, styling, interactions
   - Review acceptance criteria
   - Note files to create

4. **Implement Task**
   Based on task type, create:

   **Type Definition Tasks (FE-TASK-001, FE-TASK-002)**
   - TypeScript interfaces 
   - Enum types for status values
   - Type guards and validators

   **Service Layer Tasks (FE-TASK-003)**
   - Service interfaces matching API contracts
   - Service implementations with HttpClient
   - Error handling and retry logic
   - Request/response transformations
   - Mock service for development ( create mock data as we dont have backend here)

   **Guard/Pipe Tasks (FE-TASK-004)**
   - Route guards for authentication/authorization
   - Custom pipes for data transformation
   - Validators for forms

   **Component Tasks (FE-TASK-005+)**
   - Use service layer for API calls
   - Implement reactive forms
   - Implement loading/error states
   - Handle form validation
   - Ensure accessibility (ARIA labels)
   - Reuse shared components

   **Integration Tasks (FE-TASK-010+)**
   - Route configuration
   - Navigation integration
   - Module imports
   - Lazy loading setup

   **Testing Tasks (FE-TASK-015+)**
   - Unit tests for components
   - Service tests with HttpClientTestingModule
   - Integration tests for flows
   - Accessibility tests
   - Visual regression tests

5. **Verify Acceptance Criteria**
   - Check ALL criteria are met
   - UI matches prototype design ✓
   - Service layer abstraction ✓
   - Tests pass with >80% coverage ✓
   - Accessibility compliant (WCAG 2.1 AA) ✓
   - Run: `ng test --code-coverage`

6. **Update Status**
   - Change Status to COMPLETED
   - Mark all criteria as [x] checked
   - Update specification file

## Critical Rules
- ⚠️ MUST check dependencies before starting
- ⚠️ MUST update status to IN_PROGRESS before coding
- ⚠️ MUST use service layer (no direct HTTP in components)
- ⚠️ MUST use reactive forms (FormBuilder, FormGroup)
- ⚠️ MUST write tests (>80% coverage)
- ⚠️ MUST ensure accessibility (WCAG 2.1 AA)
- ⚠️ MUST update status to COMPLETED only when ALL criteria met

## Dependencies Check
If dependencies not met:

❌ STOP: Cannot execute FE-TASK-XXX

Dependencies not completed:
- FE-TASK-001: Status = IN_PROGRESS (required: COMPLETED)
- FE-TASK-002: Status = PENDING (required: COMPLETED)

Execute in order:
1. /task-frontend FE-TASK-001
2. /task-frontend FE-TASK-002
3. /task-frontend FE-TASK-XXX

## Output
- Creates/modifies: TS/HTML/SCSS files, test files, service files
- Updates: Specification file with COMPLETED status
- Summary: Components created, tests passed

## Next Steps
After task completion:
1. Review implementation against prototype
2. Run quality checks
3. Continue to next task: `/task-frontend <next-task-id>`