/* eslint-env node */
/* global process */
// @ts-nocheck
const fs = require('fs');

module.exports = async function run({ github, context }) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!context.payload.pull_request) {
    console.log('Not a pull request event. Skipping PR comment.');
    return;
  }

  const prNumber = context.payload.pull_request.number;

  if (!apiKey) {
    console.log('No GEMINI_API_KEY found in secrets. Skipping AI review.');
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: prNumber,
      body: '⚠️ **AI Code Review Skipped**: `GEMINI_API_KEY` secret is not configured in this repository.'
    });
    return;
  }

  if (!fs.existsSync('pr_diff.txt')) {
    console.log('pr_diff.txt not found.');
    return;
  }

  const diff = fs.readFileSync('pr_diff.txt', 'utf8');
  if (!diff.trim()) {
    console.log('Empty diff, skipping AI review.');
    return;
  }

  const truncatedDiff = diff.length > 50000 ? diff.slice(0, 50000) + '\n\n...[Diff truncated]...' : diff;

  const lintStatus = process.env.LINT_STATUS || 'unknown';
  const buildStatus = process.env.BUILD_STATUS || 'unknown';

  const prompt = [
    'You are a Senior Angular and Redux Principal Engineer conducting an automated pull request code review.',
    '',
    'Context:',
    '- Framework: Angular 22+ Standalone Architecture',
    '- State Management: Redux / NgRedux Store',
    `- Automated Lint Status: ${lintStatus}`,
    `- Automated Build Status: ${buildStatus}`,
    '',
    'Review Focus:',
    '1. Redux Immutability: Verify state is never mutated directly in reducers or actions.',
    '2. Angular 22+ Standards: Standalone imports, control flow syntax (@if, @for), proper Observable/AsyncPipe typing.',
    '3. Performance & Memory Leaks: Unsubscribed observables, expensive getters in templates, track expression in @for.',
    '4. Bug Risks & Security: Potential undefined/null pointer exceptions, missing error handling.',
    '',
    'Instructions:',
    '- Provide an Executive Summary (1-2 sentences).',
    '- Give a markdown table of Key Findings categorized by: [Critical / Warning / Suggestion / Praise].',
    '- Provide constructive code suggestions with markdown diff blocks where relevant.',
    '- State a final Verdict: [Approved / Needs Attention / Blocked].',
    '',
    'Here is the Git Diff for this PR:',
    '```diff',
    truncatedDiff,
    '```'
  ].join('\n');

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const reviewText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No review generated.';

    const commentBody = [
      '## 🤖 AI Code Review Summary',
      '',
      `- **Automated Build**: ${buildStatus === 'success' ? '✅ Passed' : '❌ Failed'}`,
      `- **Automated Linter**: ${lintStatus === 'success' ? '✅ Passed' : '⚠️ Issues Found'}`,
      '',
      '---',
      '',
      reviewText,
      '',
      '---',
      '*Powered by Google Gemini 2.5 Flash via GitHub Actions*'
    ].join('\n');

    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: prNumber,
      body: commentBody
    });

    console.log('AI code review posted successfully.');
  } catch (err) {
    console.error('Error during AI review:', err);
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: prNumber,
      body: `❌ **AI Review Error**: Failed to process review with Gemini API:\n\`\`\`\n${err.message}\n\`\`\``
    });
  }
};
