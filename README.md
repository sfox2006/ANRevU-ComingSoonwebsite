# ANRevU Coming Soon Website

A static coming soon and waitlist page for ANRevU, separate from the main ANRevU review app.

ANRevU is an independent student-built ANU course and academic review platform. This site lets students join the launch waitlist and stores submissions in Supabase.

## Files

- `index.html` - landing page markup
- `styles.css` - responsive black, white, and gold ANRevU styling
- `app.js` - waitlist validation and Supabase insert
- `supabase/waitlist_schema.sql` - database table, constraints, and RLS policies
- `.github/workflows/deploy.yml` - GitHub Pages deployment

## Supabase Setup

Use the same Supabase project as ANRevU if you want, but do not use a service role key in this frontend. Only paste a publishable or anon key into `app.js`.

1. Open your Supabase project.
2. Go to **SQL Editor**.
3. Paste and run the full contents of `supabase/waitlist_schema.sql`.
4. Go to **Project Settings** > **API**.
5. Copy the project URL.
6. Copy the publishable/anon public key.
7. Open `app.js` and set:

```js
const SUPABASE_URL = "https://your-project-ref.supabase.co";
const SUPABASE_ANON_KEY = "your-publishable-or-anon-key";
```

The page intentionally shows a setup error only after form submission if these values are blank, so the landing page can still render before Supabase is configured.

## RLS Model

The schema enables Row Level Security on `public.anrevu_waitlist`.

Public anonymous users can:

- Insert a waitlist row.

Public anonymous users cannot:

- Read waitlist rows.
- Update waitlist rows.
- Delete waitlist rows.

The frontend sends only:

- `name`
- `email`
- `is_anu_student`
- `source`

Email is trimmed and lowercased before insert. The database also prevents empty emails and enforces uniqueness on `lower(email)`.

## Local Preview

Because this is a static site, you can open `index.html` directly in a browser.

For a local server:

```powershell
python -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173
```

## GitHub Pages Deployment

The included workflow deploys the static site from `main`.

1. Push this repo to GitHub.
2. Open the repo settings: `https://github.com/sfox2006/ANRevU-ComingSoonwebsite/settings/pages`.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main`.
5. Wait for the **Deploy to GitHub Pages** workflow to finish.

The deployed site will be available at:

```text
https://sfox2006.github.io/ANRevU-ComingSoonwebsite/
```

## Important Security Note

Never paste a Supabase service role key into `app.js`, GitHub Pages settings, or any frontend file. The service role key bypasses RLS and must remain server-side only.
