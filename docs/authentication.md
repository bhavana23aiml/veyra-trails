# Authentication

## Routes

- `/account`: custom validated signup and Supabase Auth UI sign-in/recovery request; account landing when authenticated.
- `/verify-email`: requests a real signup verification resend. The email field targets an existing signup; it does not mutate another user's email. Correcting a signup typo requires registering the intended address.
- `/auth/callback`: explicitly exchanges a PKCE authorization code, validates the user, and redirects to onboarding or password recovery. Automatic URL exchange is disabled on the client to avoid double consumption.
- `/reset-password`: verified-session password update with confirmation and errors.
- `/onboarding`: owner-protected saved preferences; signed-out and unverified visitors are redirected.

## Session management

`SessionContextProvider` monitors Supabase Auth changes and clears sign-out errors. Authenticated users see their account landing instead of the login form. Public discovery remains public. All database authorization is enforced independently through RLS and grants.

## Verification source of truth

A security-definer trigger with an empty search path copies `auth.users.email_confirmed_at IS NOT NULL` to `profiles.email_verified` on account creation and verification updates. User metadata is used for display name/phone only, never for authority. Authenticated clients cannot insert profiles or update verification status. They can update only their own name/phone once verified.

## Required hosted configuration

Enable email confirmation and a minimum eight-character password. Set Site URL and allow exact callback paths for each deployment, including the `?next=recovery` variant. Configure SMTP, sender identity and rate limits. No external mail delivery was verified during implementation. Supabase may throttle repeated messages; the resend UI includes a 60-second cooldown but server-side provider limits remain authoritative.

PKCE requires the browser's stored verifier, so links should be opened in the requesting browser. Expired and cross-browser links display recovery guidance rather than reporting success.

## Manual acceptance still required

Use a real inbox to verify signup, delivery, callback, profile creation, preference save/reload, logout/login and reset delivery. Repeat with a second account to verify data isolation. Also test expired links, throttling, and network failure. Booking and payment verification gates cannot be acceptance-tested until those systems exist.
