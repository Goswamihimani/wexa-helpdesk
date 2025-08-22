# Smart Helpdesk with Agentic Triage (MERN, STUB_MODE)

An interview-ready implementation of the **Wexa AI Fresher Assignment**.

## Highlights
- MERN stack with **agentic triage** (classify → retrieve KB → draft → decision → audit)
- **STUB_MODE** agent (no API keys) using heuristics for category + a templated draft
- Role-based **JWT auth** (admin, agent, user)
- **Audit timeline** with per-ticket **traceId**
- **Docker Compose** one-command run
- Seeded demo users, KB, and tickets
- Health endpoints: `/healthz`, `/readyz`
- Minimal tests (Node test runner)

## Quick Start (Local, Docker)
```bash
# 1) From repo root
docker compose up --build -d

# 2) Seed demo data
docker compose exec api npm run seed

# 3) Open apps
# API:    http://localhost:8080
# Client: http://localhost:5173
```

### Demo Accounts
- Admin — **admin@acme.com** / **password123**
- Agent — **agent@acme.com** / **password123**
- User  — **user@acme.com**  / **password123**

> These are populated by the seed script.

## Architecture
```
client (Vite/React/Tailwind) ─┐
                              │
                              ├──> api (Express/Mongoose)
                              │      ├ /api/auth (JWT)
                              │      ├ /api/kb (CRUD + search)
                              │      ├ /api/tickets (create/list/detail/reply/assign)
                              │      ├ /api/agent/triage (planner + classify/retrieve/draft/decision)
                              │      ├ /api/config (thresholds, flags)
                              │      └ /api/tickets/:id/audit (timeline)
                              └──> mongo (MongoDB 6)
```
- **Planner**: small state machine calling `classify → retrieve KB → draft → decision`.
- **Deterministic stub**: controlled by `STUB_MODE=true`. Heuristic keyword match:
  - “refund/invoice”→ **billing**, “error/bug/stack”→ **tech**, “delivery/shipment”→ **shipping**, else **other**.
- **Decision**: if `autoCloseEnabled` and `confidence ≥ threshold` → auto-reply & resolve; else `waiting_human`.

## Run Without Docker (optional)
```bash
# API
cd api
cp .env.example .env   # ensure MONGO_URI, JWT_SECRET, STUB_MODE=true
npm install
npm run seed
npm run dev

# Client
cd ../client
npm install
npm run dev
```

## Testing
```bash
cd api
npm test
```
Included tests:
- `agentStub.test.js` — classifier + drafter
- `models.test.js` — schema defaults
- `trace.test.js` — trace helper
- `readme.test.js` — sanity check
- `smoke.test.js` — trivial

## Acceptance Criteria Checklist
1. Register/login + create ticket — **Yes**
2. Creating a ticket triggers triage; AgentSuggestion persisted — **Yes**
3. Auto-close when `confidence ≥ threshold` and enabled — **Yes**
4. Below threshold → `waiting_human`; agent can send reply — **Yes**
5. Audit timeline shows ordered steps with timestamps + traceId — **Yes**
6. KB search returns relevant articles (Mongo text index) — **Yes**
7. Runs with `STUB_MODE=true` — **Yes**
8. `docker compose up` + seed + README — **Yes**

## Notes for Reviewers
- No secrets committed, input validated (zod), rate-limited routes, CORS scoped.
- Observability: request logs + JSON audit events; `/healthz` & `/readyz` available.
- DevX: one-command up + seed + demo logins.
```
