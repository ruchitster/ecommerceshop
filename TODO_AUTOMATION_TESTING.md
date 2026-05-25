# TODO - Automation Testing Setup

## Frontend (Playwright)
- [ ] Add `frontend/.env` with `VITE_BASE_URL`, `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`, etc.
- [ ] Add/adjust `frontend/playwright.config.js` to enable `screenshot: only-on-failure` and HTML reporter.
- [ ] Create POM folder: `frontend/tests/pages/*`
- [ ] Create utilities folder: `frontend/tests/helpers/*`
- [ ] Implement E2E test suites:
  - [ ] login
  - [ ] signup
  - [ ] logout
  - [ ] form validation
  - [ ] navigation + route protection
  - [ ] CRUD operations (admin)
  - [ ] search
  - [ ] API response validation (via UI)
  - [ ] error handling
  - [ ] responsive checks

## Backend (Jest + Supertest)
- [ ] Define test DB strategy (dedicated DB or mongodb-memory-server)
- [ ] Update `backend/test/setup.js` to connect to test DB via env vars
- [ ] Add integration tests for:
  - [ ] auth (register/login/admin login)
  - [ ] products CRUD (admin)
  - [ ] cart ops
  - [ ] orders + stock deduction
  - [ ] middleware authorization (missing/invalid token)
  - [ ] error handling paths
- [ ] Enable coverage reports in Jest config

## CI
- [ ] Verify GitHub Actions runs backend tests and frontend build
- [ ] Enable Playwright E2E in CI once credentials + test environment are stable

