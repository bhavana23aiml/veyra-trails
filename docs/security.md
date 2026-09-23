# Security status

## Implemented controls

- All current public tables have row-level security.
- Explicit grants replace broad Supabase default privileges.
- Anonymous users can read only published catalog data and destinations.
- Private profile, preferences, wishlist and admin membership access is owner-scoped.
- Verification comes from Auth, not editable metadata; client grants prohibit modification of the verification column.
- Admin catalog policies require trusted admin membership and a verified profile.
- Browser credentials are publishable keys only.
- Auth inputs use React Hook Form and Zod; Supabase Auth validates credentials; database constraints validate preferences and profile fields.
- PKCE code exchange avoids untrusted redirect destinations and double exchange.
- Wishlist errors roll back optimistic state and never report fake success.

## Executed database probes

Anonymous-role queries verified the 15 published demonstration treks are readable and private-table read privileges are absent. An unrelated authenticated identity had no private rows visible, no verification-update or admin-insert grant, and could not update the catalog. These are basic role probes, not a complete populated two-user penetration test.

## Outstanding production work

Real inbox auth acceptance, multi-user row-isolation tests with populated records, external-service rate limits, secure upload policies, booking inventory locking, server-side payment signature verification, replay-safe webhook handling, AI request authorization and quotas, and application email delivery are not yet complete. Do not enable live sales based on this increment.
