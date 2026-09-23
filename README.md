# Playwright QA Automation Lab

[![Playwright](https://img.shields.io/badge/Playwright-1.63%2B-2ead33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-learning-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/status-in%20progress-f2c14e)](#learning-roadmap)

A hands-on Playwright practice repository for building strong QA automation skills with JavaScript and TypeScript fundamentals.

This project is intentionally small at the start and will grow through focused exercises covering reliable UI testing, test design, debugging, API testing, fixtures, and CI automation.

## What This Project Covers

- End-to-end browser testing with Playwright Test
- Cross-browser execution in Chromium, Firefox, and WebKit
- Accessible locators such as roles and visible page assertions
- HTML test reports and trace collection on the first retry
- Practical exercises based on public websites and test applications

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install

```bash
npm install
npx playwright install
```

### Run the tests

```bash
# Run the complete suite
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run a specific browser project
npx playwright test --project=chromium
```

### Review the report

```bash
npx playwright show-report
```

## Current Exercises

The starter suite in `tests/example.spec.ts` currently validates:

1. The Playwright documentation page title
2. Navigation from the Playwright documentation to the Installation page
3. The initial route of the Bondar Academy IoT dashboard

## Project Structure

```text
.
├── tests/
│   └── example.spec.ts       # Browser scenarios and assertions
├── playwright.config.ts      # Test runner and browser configuration
├── package.json              # Project metadata and dependencies
└── playwright-report/        # Generated HTML report
```

## Learning Roadmap

- [ ] Replace starter examples with focused test suites
- [ ] Practice robust locators and page object models
- [ ] Add test data and reusable fixtures
- [ ] Cover forms, tables, dialogs, uploads, and network mocking
- [ ] Add API testing with Playwright request fixtures
- [ ] Improve negative and boundary-value coverage
- [ ] Add linting, formatting, and useful npm scripts
- [ ] Run the suite in GitHub Actions
- [ ] Track flaky tests and improve test isolation

## Quality Principles

- Prefer user-facing locators over brittle CSS or XPath selectors.
- Keep tests independent, readable, and focused on one behavior.
- Assert meaningful outcomes rather than implementation details.
- Use trace, screenshots, and video evidence to investigate failures.
- Treat automation as code: review it, refactor it, and keep feedback fast.

## Why This Repository Exists

This is a public learning log and a practical portfolio of my journey deeper into QA automation. It documents not only passing tests, but also the reasoning behind test design, maintainability, debugging, and continuous improvement.

## Useful Links

- [Playwright documentation](https://playwright.dev/docs/intro)
- [Playwright best practices](https://playwright.dev/docs/best-practices)
- [Playwright test assertions](https://playwright.dev/docs/test-assertions)
- [Playwright trace viewer](https://playwright.dev/docs/trace-viewer)

## License

This repository is for learning and practice.