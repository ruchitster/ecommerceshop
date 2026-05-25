# Frontend UX/UI Testing Plan (ShopSphere)

## Scope
UX/UI testing for the frontend in `frontend/` covering:
- Public store: `Home`, `ProductDetails`, `Cart`, `Checkout`, `Orders`, `OrderDetails`, `Contact`
- Shared UI: `Navbar`, `Footer`
- Auth entry points: `Login`, `Register`, `Auth`
- Admin journeys: `AdminLogin`, `Dashboard`, `ManageProducts`, `AddProduct`, `EditProduct`, `ManageCategories`, `AddCategory`, `EditCategory`, `ManageSubcategories`, `AddSubcategory`, `EditSubcategory`, `ManageOrders`, `ManageUsers`

## Goals
1. Validate core purchase flows end-to-end.
2. Confirm loading/error/empty states are understandable and consistent.
3. Verify responsive layout and interaction behavior across devices.
4. Perform a minimum accessibility/keyboard usability pass.
5. Produce a prioritized issue list (Blocker/High/Medium/Low) that maps to user impact.

## Environments & Devices
- Desktop: 1366×768 and 1920×1080
- Tablet: 768×1024
- Mobile: 390×844 (iPhone) and ~360×740 (Android)
- Browsers: Chrome and (if available) Firefox

## Test Data/Setup Assumptions
- Backend/API is running at `http://localhost:5000/api`
- Product images served at `http://localhost:5000/uploads/:filename`
- Typical data exists: products with variants (size/color), categories, subcategories.
- Razorpay checkout is configured in backend for the test key (currently `rzp_test_SpgOrdausMLPKf`).

## Priority Journeys (Manual)

### Journey A: Browse & Filter
**Start:** `/` (Home)
1. Verify hero section loads and rotation looks smooth.
2. Verify search input updates product list.
3. Open filter panel (Show Filters) and:
   - Select category, then verify subcategory options narrow.
   - Apply sort and min/max price.
4. Click **Clear** and verify UI + results reset.
5. Validate states:
   - Loading state
   - No products found
   - API failure message

**Success Criteria:** UI never becomes confusing; results always match the filter UI.

### Journey B: Product Details → Add to Cart
**Start:** `/product/:id`
1. Verify product loading + error state.
2. Validate variant UX:
   - Size dropdown updates available size options.
   - Selecting size resets color (or at least doesn’t leave invalid combinations).
   - Selecting both size+color enables accurate price/stock.
3. Quantity:
   - Ensure quantity respects min=1 and max=stock.
4. CTA:
   - Out-of-stock disables Add to Cart (label and disabled styling look correct).
5. Review section:
   - Verify review form layout and submission feedback.
   - Verify star rendering (5 stars etc.) and “No Reviews Yet” state.

**Success Criteria:** user can’t accidentally add invalid variants; feedback is clear.

### Journey C: Cart → Checkout
**Start:** `/cart`
1. Empty cart state looks intentional and directs user (at least provides context).
2. For each cart item:
   - Image renders with correct alt/placeholder behavior.
   - Subtotal matches `price * quantity`.
3. Quantity controls:
   - Increase/decrease updates quantity and totals.
   - Rapid clicks don’t break UI.
4. Proceed to checkout routes to `/checkout`.

**Success Criteria:** numbers are consistent and UI doesn’t lag without indicators.

### Journey D: Checkout → Payment → Orders
**Start:** `/checkout`
1. Validate shipping form:
   - required validation
   - placeholder clarity
2. Verify Order Summary matches cart items and total.
3. Submit payment:
   - Razorpay opens.
   - On “Payment Successful”, order is placed and navigate to `/orders`.
4. Failure handling:
   - if backend errors, user sees actionable feedback.

**Success Criteria:** no silent failures; order appears in Orders list after success.

### Journey E: Orders → Order Details → Invoice
**Start:** `/orders` and `/orders/:id`
1. Orders list loading & empty state.
2. Click order card to route to details.
3. Order details:
   - Header fields (order number, date, status)
   - Items list layout
   - Total matches backend values
4. Invoice download:
   - Button works and downloads PDF
   - Failure case shows clear message

**Success Criteria:** invoice download works reliably and doesn’t navigate away unexpectedly.

### Journey F: Navbar & Authorization UX
1. When logged out:
   - Login link visible
   - Admin link hidden
2. When logged in (non-admin):
   - Admin link hidden
   - Cart link visible
3. When logged in (admin):
   - Admin link visible
   - Cart link hidden (as implemented)
4. Logout:
   - Token/user removed and user navigates correctly

**Success Criteria:** nav state always reflects actual auth role.

### Journey G: Admin CRUD & Confirmations
**Start:** `/admin/login` → `/admin/dashboard`
For each admin page (manage/add/edit):
1. Loading states and error displays.
2. Form validation and UX (labels, required fields, disabled states).
3. Delete confirmations:
   - Confirm modal/copy is accurate
   - Cancel aborts action
4. Navigation after successful CRUD.

**Success Criteria:** admin cannot accidentally delete without clear confirmation.

## Accessibility & Usability Checks (Minimum)
For each page in scope:
- Keyboard navigation:
  - Tab order is logical
  - Focus indicators are visible (not removed)
- Labels:
  - inputs/selects have associated labels
- Images:
  - meaningful `alt` text where relevant
  - decorative images can be `alt=""`
- Color contrast:
  - text over black/gray panels remains readable
- Motion:
  - carousel/hero transitions don’t trap focus

## What to Capture During Testing
- Screenshot or screen recording of UI issues
- Steps to reproduce
- Expected vs actual behavior
- Device/browser and user state (logged out / user / admin)
- Impact severity and suggested fix

## Deliverable Format
- `FRONTEND_UX_ISSUES.md` with:
  - Summary
  - Issue list (severity, page/component, repro steps, evidence)
  - Suggested fixes (implementation notes)

