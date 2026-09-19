# Velclaw Deploy Console

A web-based deployment control plane for Velclaw. This repository is no longer the original Autoship CLI.

## Stack
Next.js App Router, React, and a server-side Vercel REST API integration.

## Local
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment
Set `VERCEL_TOKEN` and optionally `VERCEL_TEAM_ID` on the server. Never expose the token through `NEXT_PUBLIC_`.

## Deployment flow
GitHub repository → Velclaw Deploy Console → Vercel project → Preview deployment → `vercel.app` URL.

## Roadmap
Deployment history, production promotion, rollbacks, GitHub Issues/PRs, CI/CD activity, infrastructure, documentation, and authentication.
