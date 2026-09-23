# VEYRA TRAILS

A Next.js 15 / React 19 / TypeScript / Tailwind / Supabase / Framer Motion trekking platform in active development. The existing editorial design is preserved. This is **not yet a production booking service**.

## Working implementation

- Editorial homepage, catalog discovery with URL filters/sorting/pagination, and dynamic journey pages.
- Connected Supabase catalog: 15 clearly labeled sample treks and eight destinations. These are demonstration records, not verified offers or bookable departures.
- Supabase signup with full name, phone, password confirmation; supported Supabase Auth login and forgot-password UI.
- PKCE verification callback, verification resend, dedicated password reset, shared session provider, and real sign-out.
- Auth-triggered profile creation and trusted verification synchronization.
- Verified-user onboarding preferences persisted in PostgreSQL.
- Database-backed wishlist add/remove, saved state, loading and error feedback.
- Existing admin catalog create/edit/publish/archive UI backed by protected tables. Membership must be granted by a trusted project administrator; no self-enrollment.
- Deterministic catalog matching. It is explicitly **not AI generation**.

## Architecture

App Router pages live under `src/app`; components under `src/components`. Public catalog reads run server-side in `src/lib/supabase/catalog.ts`. Browser authentication and RLS-protected writes use one client in `src/integrations/supabase/client.ts`. `src/lib/supabase/browser.ts` preserves the existing client access interface. Types for the current tables are maintained in `src/lib/supabase/types.ts` and `preferences.ts`.

The linked Supabase project's public URL/key are defaults; hosting environment variables may override them. A publishable key is not a secret. No service-role key is used by browser code.

## Configuration

`.env.example` contains placeholders only. Set values through your hosting environment settings. Supabase is connected to the linked project; payment, AI, and application email integrations are not implemented merely by populating the reserved variables.

In Supabase Authentication settings:

1. Enable email/password and **Confirm email**.
2. Set the Site URL to your deployment origin.
3. Allow the exact redirect URLs `{origin}/auth/callback` and `{origin}/auth/callback?next=recovery` for each intended preview/production origin.
4. Configure custom SMTP for production delivery, sender identity, and appropriate rate limits.
5. Set a minimum password length of at least eight characters.

Verification and recovery links use PKCE. Open links in the same browser where they were requested. The callback exchanges each authorization code once. Verification leads to `/onboarding`; recovery leads to `/reset-password`. Mail delivery and hosted Auth settings require real inbox testing and are not claimed as verified.

## Database

The connected project now has `profiles`, `user_preferences`, `destinations`, `treks`, `wishlists`, and `admins`. Schema, policies, grants, triggers, and sample inventory were applied directly to the connected database. RLS is enabled on all six tables. Default grants were explicitly revoked before granting only intended operations. Verification is writable only by trusted Auth synchronization, never by clients.

Earlier checked-in SQL files are historical scaffolding and are **not a replayable migration chain for the current live schema**. Do not apply the old catalog bootstrap on top of the connected project: it recreates existing tables and does not contain the current privilege hardening. Future schema changes should use managed database migrations and preserve the live security constraints. See `docs/database.md`.

## Local preview and deployment

The project uses the standard `dev`, `build`, and `start` package scripts. Deploy as a Next.js project on Vercel; configure environment variables and matching Supabase redirect origins in the hosting consoles. Google Fonts and Unsplash require network access. Photography is illustrative rather than verified route imagery.

## Verification and limits

Type checking, production build, and database permission probes are performed during implementation. Database probes cover anonymous catalog access, private-table grants, verification-column restrictions, and denial of non-admin catalog updates. They do not substitute for multi-account browser tests.

Not yet delivered: departure inventory, transaction-safe bookings, participants/coupons, Razorpay orders/signatures/webhooks/refunds, booking dashboards, real AI planning/chat, packing persistence, reviews, application emails/reminders, weather/maps, expanded admin operations, and the full requested route set. No payment, booking, review, AI response, or delivery success is simulated. Reservations remain closed.

Before production launch: verify operator data, complete remaining integrations, test auth with real inboxes, run cross-account RLS tests with populated records, and complete payment/booking idempotency and end-to-end acceptance tests.

## Documentation

- [Authentication](docs/authentication.md)
- [Database](docs/database.md)
- [Security](docs/security.md)
