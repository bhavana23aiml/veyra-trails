# Live database

## Tables

| Table | Purpose | Client access |
| --- | --- | --- |
| profiles | Name, phone, trusted verification status | Owner SELECT; verified-owner UPDATE of name/phone only |
| user_preferences | Experience, fitness, difficulty, destinations, duration, budget, months, altitude experience, group style, interests | Owner reads/deletes; verified owner inserts/updates |
| destinations | Discovery destinations | Public read; verified admin writes |
| treks | Existing journey catalog | Published public read; verified admin writes |
| wishlists | Composite user/trek saved collection | Owner read/insert/delete; inserts require published trek |
| admins | Administrator membership | Owner can read membership; only trusted service can grant/revoke |

All tables have RLS. Ordinary table operations are granted to `service_role`; that key is never exposed to the browser. Supabase default client grants were revoked explicitly, then replaced with least-privilege grants. Catalog indexing includes slug uniqueness, destination, difficulty, and status. Wishlist primary key `(user_id, trek_id)` prevents duplicate saves and supports owner lookups.

`sync_auth_profile` runs after auth insert or email-confirmation update. Its direct execution privilege is revoked from public clients. Signup metadata cannot set verification or administrator flags. Preferences have database checks for enums, numeric ranges, text lengths and months.

## Sample inventory

15 journeys and eight destinations are stored in the live database. `is_sample=true` is preserved; no departures or bookings were fabricated. Catalog fallback remains clearly labeled when the server cannot reach Supabase. Admin publication does not enable sales.

## Migration status

This increment applied schema through the connected database service. Existing `001_catalog.sql`, `002_repair_sample_images.sql`, and `seed.sql` are earlier historical scaffolding, not a fresh-environment deployment procedure for the current schema. They were not manually rewritten. Use a managed schema export/migration workflow before creating another production database; never replay the old bootstrap onto an existing project.

Types describe the currently used table shapes. A generated-schema type synchronization pipeline is not yet installed.
