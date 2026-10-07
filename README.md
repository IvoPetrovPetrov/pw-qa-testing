# Playwright QA Automation Lab

[![Playwright](https://img.shields.io/badge/Playwright-1.63%2B-2ead33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-learning-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/status-in%20progress-f2c14e)](#learning-roadmap)

A hands-on Playwright practice repository for building strong QA automation skills with TypeScript, page object modeling, and user-facing browser testing.

This project focuses on practical UI automation against the Bondar Academy playground, with emphasis on test design, robust locators, debugging, and CI-friendly execution.

## What This Project Covers

- End-to-end browser testing with Playwright Test and TypeScript
- Cross-browser execution in Chromium, Firefox, and WebKit
- Reusable page object patterns for UI flows
- Robust, user-facing locators and assertion-based validation
- HTML reports, screenshots, and trace retention for failed runs
- GitHub Actions execution for the Chromium suite on pushes and pull requests to `main`
- Practice scenarios based on test pages and public UI playgrounds

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

The GitHub Actions workflow installs Chromium, runs `npm run test:chromium`, and uploads the HTML report as a workflow artifact, including on failed runs.

## Current Test Coverage

The automated suites in `tests/` currently cover a range of UI scenarios on the Bondar Academy playground, including:

- datepicker interactions
- dialog and modal behavior
- footer validation
- form layout checks
- IoT dashboard assertions
- main header navigation
- popover behavior
- sidebar menu interactions
- window-based page scenarios

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── playwright.yml     # Chromium tests on pushes and pull requests
├── UI/
│   ├── components/            # Reusable UI component objects
│   └── pages/                 # Page objects
├── docs/                      # Project notes and supporting documentation
├── tests/
│   └── *.spec.ts              # Browser scenarios and assertions
├── playwright.config.ts       # Test runner and browser configuration
├── package.json               # Project scripts and dependencies
├── playwright-report/         # Generated HTML report (not committed)
├── test-results/              # Generated test artifacts (not committed)
├── README.md                  # Project overview and onboarding guide
└── .gitignore                 # Ignored generated files
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