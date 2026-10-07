# Playwright Agents Guide for Cursor

## 1. Purpose

This guide explains how to use Playwright Test Agents with Cursor and
how to combine them with an existing Playwright automation project.

Playwright provides three agents:

-   **Planner** -- explores the application and creates a Markdown test
    plan.
-   **Generator** -- converts the test plan into executable Playwright
    tests.
-   **Healer** -- runs failing tests and attempts to repair them.

Playwright officially documents agent initialization through:

``` bash
npx playwright init-agents --loop=vscode
```

Cursor is not currently listed as a separate `init-agents` loop. For
Cursor, use the VS Code-compatible agent definitions when appropriate,
or use Playwright MCP directly from Cursor.

------------------------------------------------------------------------

## 2. Important: Playwright Agents vs Playwright MCP

These are related but different capabilities.

### Playwright Test Agents

Use:

``` bash
npx playwright init-agents --loop=vscode
```

This creates agent definitions for the Planner, Generator and Healer
workflow.

Typical workflow:

``` text
Requirement
   ↓
Planner
   ↓
specs/*.md
   ↓
Generator
   ↓
tests/*.spec.ts
   ↓
Healer
   ↓
Fixed tests
```

### Playwright MCP

Playwright MCP allows Cursor's AI agent to control a browser.

Official configuration uses:

``` text
npx @playwright/mcp@latest
```

MCP is useful when you want Cursor to:

-   Open a browser
-   Navigate to an application
-   Inspect the page
-   Click/type/select elements
-   Inspect accessibility snapshots
-   Explore application behaviour
-   Help create or debug tests

Current Playwright MCP requires Node.js 20 or newer.

------------------------------------------------------------------------

# 3. Recommended Cursor Setup

## Step 1 -- Open the project in Cursor

Open the root of your Playwright project.

Example:

``` text
inveniam_automation/
├── package.json
├── playwright.config.ts
├── tests/
├── pages/
├── fixtures/
└── ...
```

Open the Cursor terminal and verify:

``` bash
pwd
ls
```

You should be in the project root.

------------------------------------------------------------------------

## Step 2 -- Check Playwright

Run:

``` bash
npx playwright --version
```

If Playwright is installed locally, prefer the local project version.

You can also verify:

``` bash
npx --no-install playwright --version
```

------------------------------------------------------------------------

# 4. Initialize Playwright Test Agents

Run from the project root:

``` bash
npx playwright init-agents --loop=vscode
```

Do not use:

``` bash
npx playwright init-agents --loop=cursor
```

unless a future Playwright release explicitly documents a Cursor loop.

The generated files are Playwright-managed agent definitions. Regenerate
them after upgrading Playwright so that the latest agent instructions
and tools are picked up.

------------------------------------------------------------------------

# 5. Using the Agents from Cursor

After initialization, open Cursor Agent mode.

A useful sequence is:

### Planner

Ask Cursor:

``` text
Use the Playwright planner agent to explore the application and create a test plan for the Login functionality.

Use the existing project configuration, fixtures and seed/setup tests.

Save the test plan under specs/.
```

The Planner should produce a Markdown test plan.

Example:

``` text
specs/
└── login.md
```

------------------------------------------------------------------------

### Generator

Then ask:

``` text
Use the Playwright generator agent to generate tests from specs/login.md.

Follow the existing project structure, fixtures, page objects and coding conventions.
```

The generated tests should be placed under the project's test directory.

------------------------------------------------------------------------

### Healer

When a test fails:

``` text
Use the Playwright healer agent to investigate and fix the failing test.

First reproduce the failure.
Inspect the current UI and locator.
Make the smallest appropriate change.
Run the test again.
Do not hide or skip the test unless the functionality is genuinely unavailable.
```

------------------------------------------------------------------------

# 6. Cursor + Playwright MCP

For browser exploration from Cursor, configure Playwright MCP.

In Cursor:

``` text
Cursor Settings
    ↓
MCP
    ↓
Add new MCP Server
```

Use a command-type MCP server with:

``` text
npx @playwright/mcp@latest
```

The standard configuration is conceptually:

``` json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

Restart/reload Cursor if required and verify that the Playwright MCP
server is available.

------------------------------------------------------------------------

# 7. Test the MCP Connection

Ask Cursor Agent:

``` text
Use Playwright MCP to open https://demo.playwright.dev/todomvc
and inspect the page.
```

Then:

``` text
Use Playwright MCP to add two todo items and verify that they are displayed.
```

This confirms that Cursor can control the browser through Playwright
MCP.

------------------------------------------------------------------------

# 8. Recommended Workflow for an Existing Project

For an established automation project, do not ask the agent to create a
completely new framework.

Tell the agent to inspect and reuse:

``` text
package.json
playwright.config.ts
fixtures/
pages/
tests/
existing helper classes
existing API utilities
existing authentication utilities
existing assertion conventions
```

Example prompt:

``` text
Before generating the test:

1. Inspect package.json.
2. Inspect playwright.config.ts.
3. Inspect existing fixtures.
4. Inspect existing Page Object classes.
5. Inspect existing API utilities.
6. Inspect representative tests.
7. Follow the existing project conventions.
8. Do not introduce a new test framework.
9. Do not duplicate existing utilities.
```

------------------------------------------------------------------------

# 9. Important Rule for API Preconditions and UI Validation

For projects where test setup should happen through APIs and the actual
validation should happen through the UI, add this rule to the project
instructions.

## Test Generation Rule

``` text
For every generated test:

1. Steps under PRECONDITIONS must be performed through APIs.

2. API details must be obtained from the application's Swagger/OpenAPI documentation or the existing API utilities in the repository.

3. Do not perform precondition/setup steps through the UI when an API is available.

4. Use the API to create, update, configure or prepare the required test data/state.

5. After the preconditions are completed, open the required application page directly using its URL.

6. Steps under VALIDATION must be performed through the UI.

7. UI validations must use Playwright locators and UI assertions.

8. Do not recreate API setup through UI actions.

9. Do not validate UI behaviour by directly querying backend APIs unless the test explicitly requires API validation.

10. Reuse existing API helpers, authentication utilities, fixtures and Page Objects whenever available.
```

------------------------------------------------------------------------

# 10. Swagger/API Discovery Rule

When an API is required for a precondition:

``` text
First inspect the application's Swagger/OpenAPI documentation.

Identify:

- HTTP method
- endpoint
- required path parameters
- query parameters
- request body
- authentication requirements
- required headers
- response structure
- identifiers returned by the API

Then implement the API call using the project's existing API utility/framework.

Do not guess an endpoint when Swagger or existing project code can provide the information.
```

Example instruction:

``` text
For creating a Data Room:

1. Find the relevant API in Swagger.
2. Determine the required request payload.
3. Reuse the project's API client/helper.
4. Create the Data Room through API.
5. Capture the generated ID.
6. Construct the direct UI URL.
7. Navigate directly to that URL.
8. Perform UI validation.
```

------------------------------------------------------------------------

# 11. Direct URL Rule

After API preconditions are complete:

``` text
Navigate directly to the page required for validation.

Do not reproduce the user's navigation journey through menus unless navigation itself is the functionality being tested.
```

Example:

``` typescript
await page.goto(`${baseURL}/data-rooms/${dataRoomId}`);
```

The exact URL must be determined from the application and existing
project conventions.

------------------------------------------------------------------------

# 12. Seed Tests

Playwright agents can use a seed test to establish the environment and
provide an example of the project's fixtures.

Example:

``` typescript
import { test, expect } from './fixtures';

test('seed', async ({ page }) => {
  // Project-specific setup
});
```

For an existing project, prefer the project's existing fixtures/setup
instead of creating duplicate authentication or setup logic.

------------------------------------------------------------------------

# 13. Agent Instructions for Existing Page Objects

Tell Cursor:

``` text
Before creating a new locator or Page Object:

1. Search the repository for an existing locator.
2. Search existing Page Object classes.
3. Reuse an existing method when possible.
4. Add a new method only when required.
5. Follow the naming and structure of existing Page Objects.
```

Prefer resilient locators such as:

``` typescript
page.getByRole()
page.getByLabel()
page.getByText()
page.getByTestId()
```

Avoid unnecessary brittle selectors such as:

``` typescript
page.locator('div:nth-child(4) > div > button')
```

unless the application requires them.

------------------------------------------------------------------------

# 14. Assertions

Use the assertion framework already used by the project.

If the project uses Playwright Test:

``` typescript
import { expect } from '@playwright/test';
```

If the project intentionally uses another assertion framework, do not
automatically replace it with Playwright Test assertions.

The agent must inspect the existing project before generating tests.

------------------------------------------------------------------------

# 15. Important Existing-Framework Check

Before using Playwright Test Agents, inspect:

``` bash
cat package.json
```

Look for:

``` text
@playwright/test
```

and/or:

``` text
jest
```

This matters because the Playwright Test Agents documentation generates
Playwright Test-style tests.

For example:

``` typescript
import { test, expect } from '@playwright/test';

test('example', async ({ page }) => {
  ...
});
```

If the existing project is based on Jest + Playwright, do not blindly
replace the existing framework.

Instead instruct Cursor:

``` text
This repository uses the existing Jest + Playwright framework.

Do not convert the project to @playwright/test.

Generate tests compatible with the existing framework and reuse the existing test utilities, fixtures, API helpers and assertion style.
```

------------------------------------------------------------------------

# 16. Recommended Prompt for Cursor

Use this as a general prompt:

``` text
You are working in an existing Playwright automation repository.

Before making any changes:

1. Inspect package.json.
2. Inspect the Playwright configuration.
3. Inspect existing test files.
4. Inspect fixtures.
5. Inspect Page Objects.
6. Inspect API utilities.
7. Inspect authentication utilities.
8. Inspect existing test conventions.

Do not introduce a new framework or duplicate existing utilities.

For test generation:

PRECONDITIONS:
- Perform all precondition/setup actions through APIs.
- Find API details from Swagger/OpenAPI documentation or existing API utilities.
- Create/update the required test data through API.
- Capture IDs and other required values from API responses.

VALIDATION:
- Navigate directly to the required application URL.
- Perform validation through the UI.
- Use existing Page Objects where available.
- Use resilient Playwright locators.
- Validate expected UI behaviour using the project's existing assertion framework.

Do not perform precondition actions through the UI when an API is available.

Do not use backend API responses as a substitute for UI validation.

Follow the existing project's coding style and directory structure.
```

------------------------------------------------------------------------

# 17. Suggested Project Structure

A project using the agent workflow can look like:

``` text
project/
│
├── .github/
│   └── agents/
│
├── specs/
│   ├── login.md
│   ├── data-room.md
│   └── extraction.md
│
├── tests/
│   ├── login.spec.ts
│   ├── data-room.spec.ts
│   └── extraction.spec.ts
│
├── pages/
│   ├── LoginPage.ts
│   ├── DataRoomPage.ts
│   └── ExtractionPage.ts
│
├── api/
│   ├── auth.ts
│   ├── dataRoom.ts
│   └── extraction.ts
│
├── fixtures/
│
├── playwright.config.ts
├── package.json
└── playwright_agents_guide.md
```

The exact directories should follow the existing repository structure
rather than being created just to match this example.

------------------------------------------------------------------------

# 18. Useful Cursor Prompts

### Explore an application

``` text
Use Playwright MCP to explore the application.

Do not modify the code.

Identify the UI flow, relevant URLs, controls, API calls and important test data required for the requested scenario.
```

### Find an API

``` text
Find the API required for this precondition.

First inspect Swagger/OpenAPI documentation and then inspect existing API utilities in the repository.

Do not guess the endpoint.
```

### Generate one test

``` text
Generate the requested test.

Use API calls for all Preconditions.

Use the direct UI URL for Validation.

Reuse existing fixtures, API helpers and Page Objects.

Do not create duplicate framework infrastructure.
```

### Debug a test

``` text
Run the failing test.

Determine whether the failure is caused by:

1. Application behaviour
2. Incorrect test data
3. API setup
4. Locator
5. Timing/synchronization
6. Authentication/session
7. Environment configuration

Fix only the test-side issue when appropriate.
Do not hide genuine application failures.
```

------------------------------------------------------------------------

# 19. Running Tests

Standard Playwright Test:

``` bash
npx playwright test
```

Headed mode:

``` bash
npx playwright test --headed
```

UI mode:

``` bash
npx playwright test --ui
```

A specific test:

``` bash
npx playwright test tests/login.spec.ts
```

Debug:

``` bash
npx playwright test tests/login.spec.ts --debug
```

Open the HTML report:

``` bash
npx playwright show-report
```

------------------------------------------------------------------------

# 20. Updating Agent Definitions

After upgrading Playwright:

``` bash
npx playwright init-agents --loop=vscode
```

Regenerate the definitions so the project picks up the latest Playwright
agent instructions and tools.

------------------------------------------------------------------------

# 21. Final Recommended Architecture for Cursor

For an existing automation project, the recommended division is:

``` text
                    Cursor
                      │
          ┌───────────┴───────────┐
          │                       │
   Playwright Agents        Playwright MCP
          │                       │
     ┌────┴────┐             Browser control
     │    │    │                    │
 Planner Generator Healer           │
     │    │    │                    │
     └────┴────┘                    │
          │                          │
       Test code  ←──────────────────┘
```

Use **Playwright MCP** when Cursor needs to interact with or explore the
browser.

Use the **Planner → Generator → Healer** workflow when building and
maintaining a suite of Playwright tests.

For an existing project, the most important rule is to make the agents
follow the project's existing framework and utilities rather than
allowing them to generate a new Playwright architecture.
