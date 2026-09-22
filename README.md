# VEYRA TRAILS

Next.js 15 / React 19 / TypeScript / Tailwind / Supabase / Framer Motion.

## Implemented
Editorial homepage, catalog discovery with URL filters/sorting/pagination, journey dossiers, deterministic preference matching, Supabase account flows, saved journeys, and authorized admin catalog CRUD. Fifteen explicitly sample treks and eight destinations are supplied. All reservations remain disabled.

## Supabase setup
Set the public Supabase URL and anonymous key listed in `.env.example` in your hosting environment. Apply `supabase/migrations/001_catalog.sql` through the Supabase SQL editor, followed by `supabase/seed.sql`. These files are provided but have not been remotely applied or tested by this implementation.

Enable email confirmation in Supabase Auth. Configure your deployed site URL and allow `/auth/callback` and `/account` as auth redirect URLs. Configure SMTP for production delivery. Email verification is determined by Supabase Auth, not editable profile metadata. Registration creates profiles through a database trigger.

Grant administrator membership by inserting an existing verified user's UUID into `public.admins` through a trusted database administrator. Clients cannot grant themselves access. `/admin` provides journey creation, editing, publication and archival; all writes are constrained by RLS. It cannot enable payments or live inventory.

When the catalog is unavailable, the public experience displays a labeled local inspiration collection. This is not a production-data substitute. Saved collections require a configured, migrated database. Published database catalogs with zero records remain empty.

## Deployment and verification
Deploy as a Next.js project on Vercel with environment variables configured. Confirm auth redirects match the production origin. Production build uses the existing package build script. Fonts and photographs use Google Fonts and Unsplash; photography is illustrative, not verified route imagery.

## Not implemented in this increment
Reservations, participant collection, departure inventory, Razorpay order/verification/webhooks/refunds, booking dashboards, onboarding, AI generation/chat, packing persistence, weather/maps, reviews, application emails and reminders. Their environment variable names are reserved in `.env.example`; integrations are not claimed to work. No payment or AI success is simulated. Preference matching is deterministic, not AI-generated.

Before enabling sales, implement atomic inventory and payment reconciliation, verify operator data, add transactional integration tests and perform an RLS/security review. Authentication and persistence need end-to-end verification against the configured Supabase project. No service-role or payment secrets belong in browser code.
