# Playwright QA Automation Lab

[![Playwright](https://img.shields.io/badge/Playwright-1.63%2B-2ead33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-learning-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/status-in%20progress-f2c14e)](#learning-roadmap)

A hands-on Playwright practice repository for building strong QA automation skills with JavaScript and TypeScript fundamentals.

This repository contains Playwright UI automation practice focused on test design, reusable page objects, debugging, and continuous integration.

## What This Project Covers

- End-to-end browser testing with Playwright Test
- Cross-browser execution in Chromium, Firefox, and WebKit
- Accessible locators such as roles and visible page assertions
- HTML reports, failure screenshots, and traces retained for failed tests
- Practical exercises based on public websites and test applications
- A GitHub Actions workflow that runs the Chromium suite on pushes and pull requests to `main`

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Install

```bash
npm ci
npx playwright install
```

### Run the tests

```bash
# Run all configured browser projects
npm test

# Run the Chromium suite (also used by GitHub Actions)
npm run test:chromium

# Run tests in headed mode
npm test -- --headed
```

### Review the report

```bash
npm run report
```

The GitHub Actions workflow installs Chromium, runs `npm run test:chromium`, and uploads the HTML report as a workflow artifact, including when tests fail.

## Current Test Coverage

The test suites in `tests/` cover the Bondar Academy playground's datepicker, dialogs, footer, forms, IoT dashboard, main header, and sidebar navigation.

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── playwright.yml     # Chromium tests on pushes and pull requests
├── UI/
│   ├── components/            # Reusable UI component objects
│   └── pages/                 # Page objects
├── tests/
│   └── *.spec.ts              # Browser scenarios and assertions
├── playwright.config.ts       # Test runner and browser configuration
├── package.json               # Project scripts and dependencies
└── playwright-report/         # Generated HTML report (not committed)
```

## Learning Roadmap

- [x] Replace starter examples with focused test suites
- [x] Practice robust locators and page object models
- [ ] Add test data and reusable fixtures
- [ ] Cover forms, tables, dialogs, uploads, and network mocking
- [ ] Add API testing with Playwright request fixtures
- [ ] Improve negative and boundary-value coverage
- [x] Add useful npm scripts
- [x] Run the Chromium suite in GitHub Actions
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