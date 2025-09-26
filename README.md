# CineBook - Starter Fullstack Movie Booking
This is a minimal starter repo (backend + frontend + docker-compose) for the CineBook final-year project.

## Run with Docker (recommended)
```
docker-compose up --build
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api

## Notes
- This starter implements simple seat-hold and booking flows but **does not include payment gateway integration**.
- Seed script available at `backend/scripts/seed.js`.

Happy building — ask me to expand any part (payment integration, better concurrency, admin UI, tests, zip with sample PDF, etc.).


## Added features
- Razorpay & Stripe sample endpoints + webhook verification (set secrets in backend/.env)
- Redis-based seat locks to prevent race conditions
- Admin routes with role-based auth
- Basic Jest + Supertest setup for backend and GitHub Actions CI workflow

Run with Docker:
```
docker-compose up --build
```
Note: for local tests, run `cd backend && npm ci && npm test`.


## 🔑 Payment Testing Walkthrough

### 1. Setup Razorpay Test Account
- Go to [Razorpay Dashboard](https://dashboard.razorpay.com/).
- Create a **Test Mode** account.
- Copy your **KEY_ID** and **KEY_SECRET**.
- Put them into `backend/.env`:
  ```env
  RAZORPAY_KEY_ID=rzp_test_xxxxx
  RAZORPAY_KEY_SECRET=yyyyyyyyyyyy
  ```

### 2. Setup Stripe Test Account
- Go to [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard).
- Copy your **Secret Key** (starts with `sk_test_...`).
- Put it into `backend/.env`:
  ```env
  STRIPE_SECRET=sk_test_12345
  ```

### 3. Start Services
```bash
docker-compose up --build
```
Backend → http://localhost:5000  
Frontend → http://localhost:3000

### 4. Test Razorpay Flow
1. Open frontend → `CheckoutDemo` page.
2. Select seats → click "Pay with Razorpay".
3. Razorpay checkout opens → use test card:
   ```
   4111 1111 1111 1111  Any future date  Any CVV
   ```
4. On success → frontend calls `/api/payments/confirm`.
5. Booking marked as **paid** instantly.

### 5. Test Stripe Flow
1. Open frontend → `CheckoutDemo` page.
2. Trigger Stripe demo flow (placeholder integration).
3. In real app → use Stripe Elements to confirm PaymentIntent with card:
   ```
   4242 4242 4242 4242  Any future date  Any CVV
   ```
4. After success → frontend calls `/api/payments/confirm-stripe` with `paymentIntentId`.
5. Booking marked as **paid**.

### 6. Webhooks (Optional Redundancy)
- Both Razorpay + Stripe send webhooks for final confirmation.
- Already wired in backend: `/api/payments/webhook-razorpay`, `/api/payments/webhook-stripe`.
- In test mode you can simulate events from dashboards.

---
✅ With confirm endpoints + webhooks → your bookings are **double-protected** (frontend confirm + server webhook).
