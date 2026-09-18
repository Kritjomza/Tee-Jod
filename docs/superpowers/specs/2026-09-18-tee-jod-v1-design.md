# Tee-Jod V1 Design Specification

## Product goal

Tee-Jod is a KMUTT smart-parking prototype delivered through LINE. It helps students check mock parking availability before travelling and confirm the same status when they arrive. V1 does not reserve spaces, track vehicles, or connect to physical sensors.

## Success criteria

- A student can open the LIFF app from LINE and understand which parking area has space within five seconds.
- The app lists all four prototype parking areas with available spaces, total capacity, status, and last-updated time.
- A student can open Google Maps navigation for a selected parking area.
- A chatbot can answer the parking intent and provide a compact summary plus a LIFF button.
- A demo administrator can change mock availability without editing or redeploying code.
- The interface clearly labels the data as prototype/mock data.

## Parking areas

| ID | Display name | Capacity | Initial mock availability |
|---|---|---:|---:|
| `student-lot` | Student Parking | 60 | 8 |
| `stadium` | Sports Field Parking | 100 | 42 |
| `fibo` | FIBO Parking | 200 | 127 |
| `parking-building-1` | Parking Building 1 | 366 | 19 |

Exact coordinates must be entered from verified KMUTT map pins before enabling navigation. Until then, seed rows use `null` coordinates and the navigation buttons remain disabled.

## User experience

### LIFF home

The home screen is a single mobile-first page:

1. Header with the Tee-Jod name, a small KMUTT seal, and “Prototype data”.
2. Summary showing the lot with the most available spaces.
3. Four parking cards sorted by available spaces descending.
4. Each card shows name, `available / capacity`, occupancy bar, semantic status, update time, and a navigation button.
5. A manual refresh action and a compact error/retry state.

Status is derived from the available ratio:

- `available`: more than 30% free, green.
- `limited`: 10% through 30% free, amber.
- `full`: below 10% free, red. The label reads “Nearly full” when spaces remain and “Full” at zero.

Color is never the only status signal. Every state includes text and an icon.

### LINE chatbot

The bot handles Thai and English parking keywords, including `parking`, `ที่จอด`, `ว่าง`, `FIBO`, and `สนามกีฬา`. It replies with a Flex Message containing the best current option, a short list of all lots, the mock-data disclaimer, and a button opening the LIFF URL. Unknown text receives a short help reply showing supported commands.

### Admin page

The `/admin` page is a demo-only control surface. An administrator enters a PIN and can set an exact availability value or apply `-10`, `-1`, `+1`, and `+10`. Values are clamped to `0..capacity`. The service-role key and PIN remain server-only.

## Visual system

The palette is derived from the user-provided KMUTT seal rather than treated as an official digital brand specification:

- Primary orange: `#F04400`
- Deep orange: `#B83200`
- Ink: `#161616`
- Warm surface: `#FFF7F2`
- White: `#FFFFFF`
- Success: `#16834A`
- Warning: `#B86300`
- Danger: `#C62828`

Use orange for identity and primary actions, not for parking status. Body text uses ink on white or warm surfaces. The UI must meet WCAG AA contrast, show visible keyboard focus, support 320px-wide screens, and respect reduced-motion preferences.

The supplied seal is displayed as a small brand mark with preserved aspect ratio. Do not redraw, crop, recolor, or use it as a decorative background.

## Architecture

- Next.js App Router with TypeScript and Tailwind CSS hosts the LIFF page, admin page, read API, admin update API, and LINE webhook.
- Supabase Postgres stores the four parking rows. Anonymous access may only read the public parking view/table. Writes occur only in server route handlers using the service-role key after PIN validation.
- The LIFF SDK initializes only in the browser. The website remains usable in an ordinary browser for demos.
- The LINE Messaging API webhook validates LINE signatures before parsing events and uses the server-side channel access token to reply.
- Vercel hosts the app. Environment variables provide Supabase and LINE credentials.

## Data contract

```ts
type ParkingStatus = "available" | "limited" | "full";

type ParkingLot = {
  id: string;
  name: string;
  capacity: number;
  availableSpaces: number;
  latitude: number | null;
  longitude: number | null;
  updatedAt: string;
};
```

`GET /api/parking` returns:

```json
{
  "lots": [],
  "generatedAt": "2026-09-18T00:00:00.000Z",
  "source": "prototype"
}
```

`PATCH /api/admin/parking/:id` accepts `{ "availableSpaces": 42, "pin": "..." }` and returns the updated lot. It returns 400 for invalid input, 401 for a bad PIN, 404 for an unknown lot, and 503 when storage is unavailable.

## Reliability and safety

- If Supabase cannot be reached, the public page shows an error state with retry; it must not silently show stale values as live.
- All visible timestamps use the Asia/Bangkok timezone.
- The read response uses `Cache-Control: no-store` so demos reflect admin changes immediately.
- The webhook rejects invalid signatures with HTTP 401 and acknowledges supported LINE events within the platform timeout.
- Secrets are never committed or exposed through `NEXT_PUBLIC_*` variables, except the public LIFF ID and Supabase publishable key.
- The site contains a persistent “Prototype / not real-time” disclaimer.

## Out of scope

Reservations, payments, automatic notifications, vehicle identity, analytics dashboards, indoor maps, sensor ingestion, historical reporting, and production identity/authorization are excluded from V1.

## Verification

- Unit tests cover status derivation, sorting, input validation, and navigation URL construction.
- Route tests cover public reads, admin authorization and bounds, LINE signature rejection, and supported bot intents.
- Component tests cover loading, success, empty/error, and admin update states.
- Playwright verifies the main mobile flow at 390×844 and the desktop admin flow.
- Manual verification runs inside LINE on iOS and Android before the demo.
