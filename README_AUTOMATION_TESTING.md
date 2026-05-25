# Automation Testing Setup (Frontend + Backend)

Production-level testing setup using:
- **Frontend**: Playwright (E2E)
- **Backend**: Jest + Supertest (API integration + unit-ish middleware checks)
- **CI**: GitHub Actions (run on push)

> This repo already contains some initial Playwright and Jest scaffolding. The instructions below standardize it into a scalable, POM-friendly, CI-ready structure.

---

## 1) Frontend Automation Testing (Playwright)

### Installation (frontend)
From `d:/ReactProject/readymade/frontend`:
```bash
npm i -D @playwright/test playwright
```

### Folder structure (recommended)
```
frontend/
  tests/
    e2e/
      auth/
        login.spec.ts
        signup.spec.ts
      cart/
        cart.spec.ts
      admin/
        products-crud.spec.ts
    smoke/
    helpers/
      utils.ts
    pages/
      LoginPage.ts
      RegisterPage.ts
      Navbar.ts
      CartPage.ts
  playwright.config.js
  .env
```

### Environment variables
Create/Update `frontend/.env`:
```bash
# Frontend base URL
VITE_BASE_URL=http://localhost:5173

# Credentials used by tests
TEST_USER_EMAIL=ankit@gmail.com
TEST_USER_PASSWORD=654321

# Optional admin creds
TEST_ADMIN_EMAIL=admin@gmail.com
TEST_ADMIN_PASSWORD=admin_password

# Backend URL (used by some tests that hit APIs directly)
TEST_API_BASE_URL=http://localhost:5000/api
```

### Playwright config (recommended features)
- multi-browser projects (Chromium/Firefox/WebKit)
- screenshots + trace
- HTML reporting
- retry on CI

Use the existing `frontend/playwright.config.js`, and ensure it includes:
- `reporter: 'html'`
- `use: { screenshot: 'only-on-failure', trace: 'on-first-retry' }`

### Reusable utilities
Create: `frontend/tests/helpers/utils.js`
- `setViewportResponsive(page)` helper
- `takeScreenshotOnFailure()` (or rely on Playwright hook)
- `getEnv()` helper

### Page Object Model (POM)
Create `frontend/tests/pages/*.js`:
- `LoginPage`
- `RegisterPage`
- `Navbar`
- `CartPage`
- `AdminDashboardPage`
- `ProductsPage`

Each POM should:
- expose actions like `login(email, password)`
- expose locators via `getByRole` / `locator`

### Test cases to implement
Implement these test groups under `frontend/tests/e2e/`:

1. **Login**
   - valid credentials -> redirected
   - invalid credentials -> error message
   - blocked admin login from user login page

2. **Signup**
   - valid data -> success
   - duplicate email -> validation

3. **Logout**
   - logout button clears auth state

4. **Form validation**
   - required fields empty
   - invalid email format
   - password length/strength (if enforced)

5. **Navigation**
   - from navbar links
   - route protection (ProtectedRoute)

6. **CRUD operations**
   - admin: add/edit/delete product
   - admin: manage categories/subcategories

7. **Search functionality**
   - search bar updates results

8. **API response validation (UI level)**
   - when API fails, UI shows fallback error

9. **Error handling**
   - network failure simulation (route abort)

10. **Responsive testing**
   - verify cart page layout at 320px, 768px

### Screenshot capture on failure
In Playwright, enable:
```js
use: {
  screenshot: 'only-on-failure',
  trace: 'on-first-retry',
}
```

---

## 2) Backend Automation Testing (Jest + Supertest)

### Installation (backend)
From `d:/ReactProject/readymade/backend`:
```bash
npm i -D jest supertest
```

### Recommended folder structure
```
backend/test/
  setup.js
  helpers/
    apiHelper.js
    tokenHelper.js
    dbHelper.js
  integration/
    auth.test.js
    products.test.js
    cart.test.js
    orders.test.js
  unit/
    middleware.test.js
  fixtures/
    users.js
```

### Mock database setup
Option A (best): use **in-memory Mongo** (e.g. `mongodb-memory-server`).
Option B: use a dedicated test DB.

Given this codebase is already using Mongo, you can:
- create `backend/test/helpers/dbHelper.js`
- connect to `MONGO_URI_TEST`
- drop DB between test files

### Test setup
In `backend/test/setup.js`:
- set env vars (JWT secret, DB URI)
- connect to DB

### Test coverage report
Configure Jest to generate coverage:
- `collectCoverage: true`
- `coverageReporters: ['text','lcov','html']`

### Sample test types to include
1. **Authentication tests**
   - register
   - login success/failure
   - blocked user cannot login
   - admin login role gating

2. **CRUD API tests**
   - products: create/edit/delete (admin)
   - reviews: create (auth)
   - categories/subcategories

3. **Middleware tests**
   - missing token -> 401
   - non-admin -> 403
   - invalid JWT -> 401

4. **Error handling tests**
   - invalid payloads -> 400
   - nonexistent resources -> 404

5. **Async/await correctness**
   - always `return`/`await` promises
   - use `beforeAll/afterAll` for DB connections

---

## 3) CI/CD Integration (GitHub Actions)

Create `.github/workflows/tests.yml` at repo root:
- run backend tests
- run frontend lint (optional)
- run Playwright (requires starting dev server)

### Example workflow steps
1. checkout
2. setup node
3. backend install + test
4. frontend install + build/test
5. optionally start `vite` and run Playwright

---

## 4) Best Practices Included
- POM for maintainability
- environment-driven configuration
- separate test DB / test URLs
- trace + screenshot artifacts
- CI-friendly retry strategy

---

## Commands Summary

### Backend
```bash
cd backend
npm test
```

### Frontend Playwright
```bash
cd frontend
npm run dev
npx playwright test
```

### Run in CI
Actions workflow handles it automatically.

