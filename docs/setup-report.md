# Tee-Jod V1 Implementation Report and Setup Procedure

## 1. What has been implemented

The project now contains a working Next.js application with:

- A responsive KMUTT-inspired parking dashboard using orange, black, white, and warm neutral surfaces.
- Four parking areas with capacities and initial mock availability from the approved brief.
- Availability states (`Available`, `Limited`, `Nearly full`, and `Full`) with text and color indicators.
- A best-option summary, manual refresh, Bangkok timestamps, loading state, retry state, and mobile layout.
- A `/admin` page for changing mock counts using an administrator PIN.
- Local in-memory mock mode and persistent Supabase mode.
- A LINE LIFF initializer that keeps the page usable in ordinary browsers.
- A LINE Messaging API webhook with signature validation, Thai/English keywords, and a Flex Message linking to LIFF.
- A Supabase migration containing the database schema, read policy, and four seed rows.
- Tests for parking rules, formatting, admin validation, chatbot intent recognition, dashboard behavior, and LIFF initialization.

## 2. Choose the operating mode

### Option A — local mock demonstration

Use this first to review the interface without creating external accounts.

1. Install Node.js 22.
2. Open PowerShell in the project folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. In `.env.local`, keep `DATA_MODE=mock`.
6. Replace `change-this-demo-pin` with a private demo PIN.
7. Run `npm run dev`.
8. Open `http://localhost:3000` for the student view.
9. Open `http://localhost:3000/admin` for demo controls.

Mock updates live only in the current application process. Restarting the server—or using multiple Vercel server instances—can reset them. Use Supabase mode for a shared demo.

### Option B — persistent shared demonstration

Complete Sections 3–7 below. This is the recommended mode for presenting through LINE.

## 3. Create and initialize Supabase

1. Sign in at `https://supabase.com` and create a new project.
2. Choose a nearby region, set a strong database password, and wait for provisioning to finish.
3. Open **SQL Editor** in the Supabase dashboard.
4. Open `supabase/migrations/001_parking_lots.sql` from this project.
5. Copy its complete SQL content into the SQL Editor and select **Run**.
6. Open **Table Editor → parking_lots** and confirm four rows exist: `student-lot` (60), `stadium` (100), `fibo` (200), and `parking-building-1` (366).
7. Open **Project Settings → API** or the project **Connect** panel.
8. Record the project URL, publishable key, and service-role key. Treat the service-role key as a secret.

The database allows anonymous reads only. Browser clients cannot update the table; the server performs updates with the service-role key after checking the admin PIN.

## 4. Prepare environment variables

Create `.env.local` for local use. Add the same variables to Vercel later.

```dotenv
DATA_MODE=supabase

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

NEXT_PUBLIC_LIFF_ID=
NEXT_PUBLIC_LIFF_URL=
LINE_CHANNEL_SECRET=
LINE_CHANNEL_ACCESS_TOKEN=

ADMIN_PIN=USE_A_LONG_PRIVATE_PIN
```

| Variable | Source | Exposure |
|---|---|---|
| `DATA_MODE` | Set to `mock` or `supabase` | Server configuration |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API settings | Public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase API settings | Public, protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase API settings | Secret; server only |
| `NEXT_PUBLIC_LIFF_ID` | LINE Developers LIFF app | Public identifier |
| `NEXT_PUBLIC_LIFF_URL` | LINE Developers LIFF app | Public URL |
| `LINE_CHANNEL_SECRET` | LINE Messaging API basic settings | Secret; server only |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Messaging API tab | Secret; server only |
| `ADMIN_PIN` | Choose a long private value | Secret; server only |

Never commit `.env.local` or paste secret values into client-side code. Variables beginning with `NEXT_PUBLIC_` are included in the browser bundle and must not contain secrets.

## 5. Deploy the website to Vercel

1. Push this repository to a GitHub repository.
2. Sign in at `https://vercel.com` and select **Add New → Project**.
3. Import the GitHub repository.
4. Keep the detected framework as **Next.js**.
5. In **Environment Variables**, add all variables from Section 4. LINE values may remain blank for the first deployment.
6. Set `DATA_MODE=supabase` for Preview and Production.
7. Select **Deploy**.
8. Record the production URL, for example `https://tee-jod.vercel.app`.
9. Open the production root page and `/admin`.
10. Change one count through `/admin`, refresh the root page, and confirm that the value persists.

After changing a `NEXT_PUBLIC_*` variable, redeploy because public variables are embedded during the build.

## 6. Create the LINE Login channel and LIFF app

1. Sign in at `https://developers.line.biz/console/`.
2. Create or select a provider for the project.
3. Create a **LINE Login** channel under that provider.
4. Open the channel’s **LIFF** tab and select **Add**.
5. Configure:
   - LIFF app name: `Tee-Jod`
   - Size: `Full`
   - Endpoint URL: the Vercel production URL
   - Scope: `openid` and `profile` are sufficient; V1 does not store profile data
6. Save the LIFF app.
7. Copy the LIFF ID into `NEXT_PUBLIC_LIFF_ID`.
8. Copy the `https://liff.line.me/...` URL into `NEXT_PUBLIC_LIFF_URL`.
9. Update both variables in Vercel and redeploy.
10. Open the LIFF URL inside LINE and verify that the dashboard loads.

## 7. Create the Messaging API chatbot

1. In the same LINE provider, create a **Messaging API** channel or connect a LINE Official Account.
2. Copy the channel secret from **Basic settings** into `LINE_CHANNEL_SECRET`.
3. Issue a channel access token in the **Messaging API** tab and copy it into `LINE_CHANNEL_ACCESS_TOKEN`.
4. Add both secret values to Vercel and redeploy.
5. Set the webhook URL to `https://YOUR_VERCEL_DOMAIN/api/line/webhook`.
6. Enable **Use webhook**.
7. Select **Verify** and confirm that LINE reports success.
8. Disable default greeting or automatic replies if they conflict with the prototype bot.
9. Add the Official Account as a friend.
10. Send `ที่จอด`, `parking`, `ว่างไหม`, or `FIBO`.
11. Confirm that the bot sends a Flex Message and its button opens LIFF.

## 8. Add verified parking coordinates

Navigation is deliberately disabled because exact entrance pins have not been verified.

1. Confirm each vehicle entrance with KMUTT staff or an authoritative campus map.
2. Record coordinates for the vehicle entrance, not merely the building center.
3. Update `latitude` and `longitude` for each row in Supabase Table Editor.
4. Refresh Tee-Jod and confirm **Map pending** changes to **Navigate**.
5. Test every link and verify Google Maps selects the intended entrance.

## 9. Final acceptance procedure

Run:

```powershell
npm install
npm test
npm run lint
npm run typecheck
npm run build
```

Then manually verify:

1. Open the LIFF URL on one iOS and one Android phone.
2. Confirm all four lots and the prototype disclaimer are visible.
3. Confirm the lot with the highest free-space count is the best option.
4. Change a value through `/admin` on a laptop.
5. Refresh LIFF and confirm the same value appears.
6. Send a Thai parking keyword to the bot and open its LIFF button.
7. Test every enabled navigation link.
8. Tell test participants that values are mocked rather than sensor data.

## 10. Recommended work after V1

1. Validate all parking entrance coordinates.
2. Test whether Tee-Jod changes students’ parking choices before they travel.
3. Check whether students understand the mock-data disclaimer and update time.
4. Replace the shared PIN with authenticated staff access before wider release.
5. Define a sensor or authoritative parking-data API contract before replacing mock values.
6. Add analytics only after the core decision-making test is complete.

Do not present V1 as a real-time system until the data source, refresh frequency, failure handling, and accuracy are validated with real parking operations.
