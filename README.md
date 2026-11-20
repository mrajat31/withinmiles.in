# Within Miles — Travel Website

Professional multi-language travel website for **Within Miles** (withinmiles.in).

- 🌍 **3 languages** — English, हिंदी, मराठी (switcher in the navbar, remembered per visitor)
- 🧳 **Trips catalogue** — search, category filters, detail pages
- 📲 **WhatsApp booking** — every trip has a "Book on WhatsApp" button that opens a pre-filled chat to +91 87679 59561
- 🔐 **Team admin panel** at `/admin` — team members log in to add / edit / hide / delete trips and upload images
- ⚡ Built with Vite + React + TypeScript + Tailwind CSS, data in Supabase (free tier)

> Until Supabase is connected, the site shows 6 bundled sample trips so you can preview everything immediately.

---

## 1. Run locally

```powershell
npm install
npm run dev
```

Open http://localhost:5173

## 2. Connect Supabase (one-time, ~10 minutes)

1. Create a free account at https://supabase.com and create a **New project** (any name, region `Mumbai` recommended).
2. In the dashboard open **SQL Editor → New query**, paste the full contents of [schema.sql](./supabase/schema.sql) and click **Run**. This creates the `trips` table, security rules, and the `trip-images` storage bucket.
3. Go to **Settings → API** and copy:
   - `Project URL`
   - `anon public` key
4. In this project folder, copy `.env.example` to `.env` and paste both values:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
5. **Add team members:** Supabase Dashboard → **Authentication → Users → Add user → Create new user**. Enter each team member's email + a password (tick "Auto confirm user"). These are the logins for `/admin`.
6. Rebuild/restart the site. The `/admin` page now shows the team login.

## 3. Deploy to Hostinger

1. Build the production site:
   ```powershell
   npm run build
   ```
   This creates a `dist/` folder containing the whole website (including the `.htaccess` needed for page routing).
2. Log in to **Hostinger hPanel → Websites → your domain → File Manager** (or use FTP).
3. Open the `public_html` folder and delete any default files.
4. Upload **everything inside `dist/`** (not the dist folder itself) into `public_html`.
   - Tip: zip the contents of `dist/`, upload the zip, then extract it in File Manager.
5. Visit your domain — the site is live. 🎉

Re-deploying after changes = run `npm run build` again and re-upload `dist/`.

> **Note:** trips are stored in Supabase, so adding/editing trips through `/admin` is instant and needs **no** re-upload. You only re-upload when you change the website design/code.

## 4. Managing trips (for the team)

1. Go to `yourdomain.com/admin`
2. Sign in with the email + password created in Supabase
3. **Add Trip** — fill in English title/description (Hindi & Marathi optional — English is shown as fallback), destination, category, days/nights, price, dates, highlights, and upload a photo
4. Toggle **Visible on website** to hide a trip without deleting it; **Featured on homepage** pins it to the homepage
5. **Edit** / **Delete** from the list

## Project structure

```
src/
  components/    Navbar, Footer, TripCard, LanguageSwitcher, WhatsApp button
  pages/         Home, Trips, TripDetail, About, Contact
  pages/admin/   Admin login + dashboard + trip form
  i18n/          en / hi / mr translations
  lib/           Supabase client, trips API, sample data
supabase/
  schema.sql     Database + storage setup (run once in Supabase)
public/
  .htaccess      SPA routing config for Hostinger (Apache)
```
