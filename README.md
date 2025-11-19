## Tiny URL Dashboard

A polished bit.ly style application built with **Next.js App Router** and **Neon Postgres**. Shorten links, track click stats, and manage campaigns from a single dashboard.

## Quick start

1. Duplicate `.env.example` → `.env.local` and set your Neon connection string:

```bash
DATABASE_URL="postgresql://..."
```

2. Install dependencies & run the dev server:

```bash
npm install
npm run dev
```

3. Visit `http://localhost:3000`

## Features

- **Dashboard (`/`)**
  - Create short links with optional custom codes (`[A-Za-z0-9]{6,8}`)
  - Inline validation, loading & success states
  - Filterable table with copy + delete actions
- **Stats (`/code/:code`)** – detail view for a single link
- **Redirect (`/:code`)** – 302 redirect + click tracking
- **Healthcheck (`/healthz`)** – JSON uptime + version info

## API surface

| Method | Path             | Description                     |
| ------ | ---------------- | ------------------------------- |
| GET    | `/api/links`     | List all active links           |
| POST   | `/api/links`     | Create a new short link         |
| GET    | `/api/links/:code` | Fetch stats for a single link |
| DELETE | `/api/links/:code` | Delete a short link           |

### Model

```sql
CREATE TABLE IF NOT EXISTS links (
  code TEXT PRIMARY KEY,
  target_url TEXT NOT NULL,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_clicked_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);
```

## Deployment

The app is production ready on any Next.js host (Vercel, Netlify, Render, etc.). Ensure `DATABASE_URL` is set and run:

```bash
npm run build
npm start
```
