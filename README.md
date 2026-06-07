# Barry Platform

A containerised family assistant platform. Each family gets their own AI agent (powered by OpenClaw + Gemini via Vertex AI) that manages lists, calendars, and daily organisation through Telegram.

## Quick Start (on GCP VM)

```bash
# 1. Start infrastructure
cd infra
docker compose up -d
cd ..

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your actual values

# 4. Run database migrations
pnpm db:migrate

# 5. Seed test data
pnpm db:seed

# 6. Start the platform
pnpm dev
```

## Project Structure

- `apps/web/` — Next.js platform (API routes + future admin panel)
- `packages/shared/` — Shared types and constants
- `skills/` — OpenClaw skills (mounted into agent containers)
- `agent-template/` — OpenClaw container image and config templates
- `infra/` — Docker Compose, GCP configs, provisioning scripts

## Tech Stack

- **Runtime:** OpenClaw (latest stable)
- **LLM:** Gemini 2.5 Flash via Vertex AI (`australia-southeast1`)
- **Framework:** Next.js 15, React 19
- **Database:** PostgreSQL 16, Drizzle ORM
- **Messaging:** Telegram Bot API
- **Hosting:** GCP (`australia-southeast1`)

## Development

All OpenClaw development and testing happens on the remote GCP VM. OpenClaw never runs on local machines.

**Workflow:** Write code locally → push to GitHub → pull on VM → run/test there.
