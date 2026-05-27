# 🛡️ Hardening LearnFlow Production Security

This plan outlines the steps to finalize the production readiness of the LearnFlow platform, focusing on security hardening and payment infrastructure.

## 1. 💳 Payment Infrastructure Hardening

### DPO (Direct Pay Online) Webhook

- [x] **Implement Push Notification Endpoint**: Create `/api/payments/dpo/webhook` to handle asynchronous status updates from DPO.
- [ ] **Secure Webhook Verification**: Implement XML signature/token verification for DPO notifications.
- [x] **DB Update Logic**: Ensure the database is updated reliably even if the customer closes their browser before the redirect.

### PayPal Integration Security

- [x] **Implement PayPal Webhook**: Create `/api/payments/paypal/webhook` to handle `CHECKOUT.ORDER.APPROVED` and `PAYMENT.CAPTURE.COMPLETED`.
- [ ] **Server-Side Capture**: Move order capture logic fully to the backend triggered by webhooks for maximum reliability.

### Stripe Webhook Hardening

- [ ] **Signature Verification**: Ensure `STRIPE_WEBHOOK_SECRET` is strictly enforced in production.

## 2. 🔐 General Backend Security

### Rate Limiting

- [x] **Add Rate Limiter**: Install `slowapi` and apply limits to:
  - `/api/auth/token` (Login)
  - `/api/auth/signup`
  - `/api/payments/*`

### Security Headers & CSP

- [x] **Tighten CSP**: Restrict Content Security Policy to only allow necessary domains (Stripe, PayPal, Google Fonts).
- [x] **HSTS & Secure Headers**: Add `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, and `X-XSS-Protection`.

### CSRF Protection

- [ ] **Implement CSRF Tokens**: Add CSRF middleware for state-changing requests (if session-based, though we use JWT). *Note: JWT is less prone to CSRF but still good practice for some flows.*

## 3. 🌐 Environment & Deployment

### Production Configuration

- [ ] **.env.example Update**: Synchronize all required production keys in the example file.
- [ ] **Validation Script**: Create a script to verify all required production environment variables are present and valid.

## 📅 Timeline

- **Phase 1**: Payments Hardening (DPO & PayPal Webhooks)
- **Phase 2**: Security Headers & Rate Limiting
- **Phase 3**: Final Review & .env sync
