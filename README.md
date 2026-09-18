# RareHandle

Mobile-first Instagram username discovery MVP.

## Setup

Requires Node.js 20+.

```bash
npm install
```

Create `.env.local` in the project root:

```env
DOMSCAN_API_KEY=PASTE_YOUR_DOMSCAN_KEY_HERE
DOMSCAN_API_BASE_URL=https://api.domscan.io
```

**Never commit `.env.local` or expose the key with `NEXT_PUBLIC_`.**

Run:

```bash
npm run dev
```

Open `http://localhost:3000`.

Production check:

```bash
npm run build
npm start
```

## Important API note

The server adapter calls the configured DomScan social endpoint with `handle` and `platforms=instagram`. The exact DomScan response schema must be confirmed against the API documentation/account currently in use. The adapter deliberately maps unrecognized responses to `UNKNOWN` rather than falsely reporting availability.

If your DomScan API uses a different base URL, change `DOMSCAN_API_BASE_URL` in `.env.local`.

## MVP

- 4L / 5L / 6L generation
- intelligent candidate ranking
- server-side DomScan integration
- Instagram-only verification
- max 5 concurrent checks
- safe `AVAILABLE / TAKEN / UNKNOWN / ERROR` states
- copy button
- mobile-first UI
- no fake availability
