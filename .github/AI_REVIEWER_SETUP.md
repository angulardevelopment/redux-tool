# AI CI/CD Code Reviewer Setup Guide

This repository includes an automated AI-powered Code Reviewer workflow in [`.github/workflows/ai-pr-reviewer.yml`](./workflows/ai-pr-reviewer.yml) designed specifically for Angular 22+ and Redux applications.

---

## What It Does

Whenever a Pull Request is opened or updated:
1. **Automated Verification**:
   - Runs `npm run lint` and `npm run build` on Node 22.
2. **AI Analysis (Google Gemini 2.5 Flash)**:
   - Evaluates the pull request `git diff` with domain knowledge of:
     - **Redux Immutability**: Flags direct state mutations in reducers or components.
     - **Angular 22+ Standards**: Checks standalone component imports, `@if` / `@for` control flow, and typed observables with `async` pipe.
     - **Memory & Resource Leaks**: Detects unmanaged RxJS subscriptions and missing track functions in loops.
     - **Bug Risks**: Flags null/undefined access and unhandled edge cases.
3. **Automated Feedback**:
   - Posts a structured review report with code diff suggestions directly as a comment on the Pull Request.

---

## 1-Minute Setup Instructions

To enable the AI review comments on your GitHub repository:

### Step 1: Obtain a Free Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Click **Create API Key**.
3. Copy your key.

### Step 2: Add to GitHub Secrets
1. In your GitHub repository, click **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret**.
3. Name: `GEMINI_API_KEY`
4. Secret: *(paste your Gemini API key)*
5. Click **Add secret**.

---

## Example Review Output

When a PR is submitted, Gemini will comment:

```markdown
## 🤖 AI Code Review Summary

- **Automated Build**: ✅ Passed
- **Automated Linter**: ✅ Passed

---

### Executive Summary
The PR adds a new filter feature to the Todo list. The Redux action dispatch logic is clean, but there is an opportunity to improve reducer immutability.

### Key Findings
| Type | Location | Description |
|---|---|---|
| ⚠️ Warning | `src/app/store.ts:24` | `Array.push()` modifies state directly instead of creating a copy. |
| 💡 Suggestion | `src/app/todo-list.component.html:12` | Use `track t.id` rather than `track t` for optimal DOM reconciliation. |
| 👏 Praise | `src/app/todo-list.component.ts` | Good use of typed `Observable<ITodo[]>` with async pipe. |

### Suggested Changes
```diff
- state.todos.push(action.todo);
- return state;
+ return {
+   ...state,
+   todos: [...state.todos, action.todo]
+ };
```

**Verdict**: Needs Attention
```
