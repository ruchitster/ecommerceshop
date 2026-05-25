# Automation Testing Suite - TODO

- [ ] Gather existing configuration and confirm test runner availability (already done basic repo scan).
- [ ] Create backend Jest + Supertest test framework scaffolding (jest config, setup/teardown, helpers).
- [ ] Create frontend Playwright (recommended) UI automation scaffolding (config, reporters, screenshot-on-failure).
- [ ] Implement API tests:
  - [ ] Auth endpoints (+ invalid credentials, token requirement, role validation)
  - [ ] Product endpoints (public + admin CRUD)
  - [ ] Cart endpoints
  - [ ] Order endpoints (user + admin order status transitions)
  - [ ] Security checks (401/403, basic injection safety)
- [ ] Implement database integrity tests (after critical operations; stock/order/cart invariants).
- [ ] Implement UI automation specs (POM + fixtures) for:
  - [ ] Register/login/logout + invalid login
  - [ ] Browse/view products + search/filter (as available)
  - [ ] Cart add/update/remove + empty checkout prevention
  - [ ] Checkout/order success + out-of-stock handling
  - [ ] Order history page
  - [ ] Admin flows: admin login + product CRUD + stock update + order status transitions
  - [ ] Unauthorized access prevention for protected/admin routes
- [ ] Add optional performance smoke tests (API response time basics).
- [ ] Add GitHub Actions CI workflow (optional).
- [ ] Run tests locally and fix failures.
- [ ] Ensure HTML reports and artifacts are produced.

