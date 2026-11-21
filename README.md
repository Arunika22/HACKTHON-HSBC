# MealMate

MealMate is a mobile-first weekly meal planner for a working professional in Pune. It plans breakfast, lunch and dinner around your food preferences, office days and the ingredients you explicitly add to your pantry. Suggestions use a curated local recipe catalog; no AI API or account is required.

## Run locally

From the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:5173`). The app starts with clearly marked sample data and saves changes in this browser.

## Checks

```powershell
cd frontend
npm test
npm run build
```

## What’s included

- Monday–Sunday plans, week navigation, packable office lunches, meal acceptance, swapping and rejection.
- Editable preferences for dietary pattern, cuisine, pinned and avoided dishes, allergies, disliked ingredients, spice, cooking time and optional protein preference.
- Searchable pantry with quantities, units, categories and “At home” / “Can buy” status.
- Shopping suggestions from accepted meals and explicitly marked “Can buy” ingredients, plus custom list items.
- Curated Bengali, Indian and Pune meal suggestions with approximate protein estimates.
- Browser persistence by default and optional Supabase magic-link authentication and cloud sync.
- Use **Reset demo** in the sidebar or profile to restore the sample pantry, profile and week.

Protein values are estimates for planning, not medical or nutrition advice. Meal planning is flexible and does not infer a calorie requirement, body metrics or medical condition.

## Optional Supabase setup

1. Create a Supabase project.
2. In the Supabase SQL editor, run [`frontend/supabase/schema.sql`](./frontend/supabase/schema.sql). The table has row-level security so authenticated users can only read or change their own plan.
3. Copy `frontend/.env.example` to `frontend/.env.local` and set:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-project-anon-key
   ```

4. In Supabase Authentication, enable email sign-in and configure the local and deployed app URLs as allowed redirect URLs.
5. Restart the Vite server. Use the avatar / **Account settings** to request a sign-in link.

Only the Supabase project URL and publishable anon key belong in the frontend environment. Never put a service-role key in this app. If either environment variable is missing, MealMate stays in local demo mode.

## Deploy to Vercel

Create a Vercel project from this repository and set its **Root Directory** to `frontend`. The included [`frontend/vercel.json`](./frontend/vercel.json) uses `npm run build` and `dist`. For cloud sync, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Vercel environment variables, deploy, and add the deployed URL to the Supabase authentication redirect allow-list. Deployments without those variables still run in local demo mode.

## Publish on GitHub Pages

The workflow in [`.github/workflows/pages.yml`](./.github/workflows/pages.yml) builds and deploys MealMate after a push to `main` or an `agents/**` branch. In the repository’s **Settings → Pages**, set the source to **GitHub Actions** if it is not already enabled. After the workflow succeeds, the site URL is `https://arunika22.github.io/HACKTHON-HSBC/`.

To show the hosted app in Notion, add an **Embed** block to a Notion page and paste that URL. Notion can display the hosted app, but cannot host or execute the React app itself.

## Project layout

- `frontend/src/App.jsx` — responsive planner, pantry, shopping and profile interfaces.
- `frontend/src/data/recipes.js` — curated catalog and rule-based planner.
- `frontend/src/data/storage.js` — localStorage and optional Supabase data-access boundary.
- `frontend/supabase/schema.sql` — per-user Supabase persistence table and policies.

The repository also retains its original standalone FastAPI backend and database schema; MealMate runs independently in `frontend`.
