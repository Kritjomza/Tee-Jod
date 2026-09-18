# Tee-Jod — KMUTT Smart Parking Prototype

Tee-Jod is a mobile-first LINE LIFF prototype that shows mock parking availability for four KMUTT parking areas. It includes a public dashboard, a PIN-protected demo control page, Supabase persistence support, and a LINE Messaging API webhook.

## Included

- Public dashboard at `/`
- Demo controls at `/admin`
- Parking JSON endpoint at `/api/parking`
- Admin update endpoint at `/api/admin/parking/:id`
- LINE webhook at `/api/line/webhook`
- In-memory mock mode for immediate local use
- Supabase mode for persistent hosted data
- Automated unit and component tests

## Run locally

Requirements: Node.js 22 and npm.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The default `DATA_MODE=mock` needs no Supabase or LINE credentials. Set a private `ADMIN_PIN` in `.env.local` before using `/admin`.

## Quality checks

```powershell
npm test
npm run lint
npm run typecheck
npm run build
```

## Configuration and deployment

Follow [docs/setup-report.md](docs/setup-report.md) for the complete Supabase, environment variable, Vercel, LIFF, and LINE Messaging API procedure.

## Important prototype limitations

- Values are mocked and are not connected to parking sensors.
- In-memory mock changes can reset when the development server or serverless instance restarts.
- Navigation remains disabled until verified coordinates are added to Supabase.
- The admin PIN is suitable for a controlled prototype, not a production authorization system.
