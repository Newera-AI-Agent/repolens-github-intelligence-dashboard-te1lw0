# RELAY HANDOFF — job vm-mutvfh50-e54nev4y (VM 1 of 3)
Written at the 15-minute checkpoint with 112 min left, after 8 steps.

## Original task
Build and deploy RepoLens — a GitHub Project Intelligence Dashboard web application.

## Stack
- Next.js 14+ (App Router, TypeScript)
- Tailwind CSS for styling
- Deploy to Cloudflare Pages via Wrangler
- No external API keys required (public GitHub API only)

## Core Feature: Repository Intelligence Dashboard

### Input
Single page with a search bar where user enters a public GitHub repository URL:
`https://github.com/owner/repository`

### Data to Fetch (via public GitHub REST API v3)
- Repository name, owner, description
- Stars, forks, watchers count
- Open issues count, open pull requests count
- Primary language
- License (SPDX ID + name)
- Repository size (KB)
- Created date, last updated date, last push date
- Default branch
- Topics/tags array
- Homepage URL (if any)

### Intelligence Section — Derived Metrics

1. **Repository Health Score (0–100)**
   Factors:
   - Recent activity (commits in last 30/90 days)
   - Issue response time (median time to first response on issues)
   - Issue close rate (closed / total in last 90 days)
   - PR merge rate (merged / total in last 90 days)
   - Contributor diversity (number of unique contributors in last 90 days)
   - Documentation presence (README, CONTRIBUTING, CODE_OF_CONDUCT, LICENSE)
   - Release cadence (releases in last year)
   - Dependency freshness (Dependabot alerts or package.json age if detectable)
   Weighted formula producing 0–100 with label: Excellent/Good/Fair/Needs Attention

2. **Activity Velocity**
   - Commits per week (last 12 weeks)
   - Issues opened vs closed per week (last 12 weeks)
   - PRs opened vs merged per week (last 12 weeks)
   - Visual: small sparkline charts

3. **Community Health**
   - Bus factor (contributors covering 80% of commits)
   - First-time contributor friendliness (good first issue labels, contributing guide)
   - Response rate (% issues/PRs with maintainer response in 48h)
   - Stale issue/PR ratio

4. **Code Quality Signals** (from GitHub API where available)
   - Branch protection on default branch
   - Required status checks
   - Code review requirements
   - Signed commits requirement
   - Dependabot alerts count (if accessible)
   - Code scanning alerts (if accessible)

5. **Repository Maturity**
   - Age in months
   - Total releases
   - Semantic versioning adoption
   - Changelog presence

### UI/UX Requirements
- Clean, professional dashboard layout (style: professional or clean)
- Responsive: mobile-first, works on desktop
- Loading states, error states (invalid URL, private repo, rate limit, not found)
- Copy-to-clipboard for repo URL
- Shareable result URL (encode owner/repo in query param)
- Dark mode support (system preference + toggle)
- Accessible: semantic HTML, focus management, color contrast, ARIA labels
- Polished micro-interactions (staggered reveal, hover states)

### Technical Implementation
- Server-side data fetching in Next.js route handlers or server components
- Client-side only for interactivity (theme toggle, copy, tabs)
- Graceful handling of GitHub API rate limits (unauthenticated: 60 req/hr)
- Cache responses for 5 minutes (Next.js cache or in-memory)
- Type-safe API responses with Zod schemas
- Error boundaries for each dashboard section

### Pages
- `/` — Landing + search input
- `/repo/[owner]/[repo]` — Dashboard (shareable, SEO-friendly)
- Optional: `/api/github/[owner]/[repo]` — JSON API endpoint

### Quality Bar
- TypeScript strict mode
- ESLint + Prettier pass
- Build passes on Cloudflare Pages (static export or SSR-compatible)
- Lighthouse: Performance > 90, Accessibility > 95, Best Practices > 90
- No console errors in production build

### Deliverable
- Live deployed URL: https://githubz.newera.page.dev
- GitHub repo: github.com/Newera-AI-Agent/repolens-github-intelligence-dashboard-te1lw0 (public)
- All source code committed and pushed

## GREENFIELD
No project files were uploaded — the repository contains ONLY the NewEra runner, workflow and skills. You are building this project FROM SCRATCH: scaffold it yourself (create-next-app / flutter create / npm create vite / npm init / python), then install, build and test for real. Read the relevant stack skill first (list_skills → read_skill) — it encodes the scaffold commands, the build loop and the static-output contract the deploy stage requires.
All requirements live in this brief — the user cannot answer questions here.

## DEPLOY (user pre-approved)
When the build VERIFIABLY passes, call request_deploy{subdomain:"githubz", mode:"permanent"} IMMEDIATELY — the user already approved githubz.newera.page.dev. Do not ask again; do not deploy off a red build. If the tool returns an error, RETRY it — never claim the site is live unless request_deploy returned ok. (The harness also auto-requests this at wind-down as a safety net, but call it yourself the moment the build is green.)

## Progress so far
(no rolling summary was generated — reconstruct state from the git log below and the repo itself)

## Worklog (latest lines — every VM in this chain appended)
# VM Agent Worklog
Durable session memory for this VM job chain. Each line is one step or wind-down from one VM. Read it on boot; never delete it.
- [2026-10-04T13:43:30.457Z | VM 1/3] boot: VM 1/3 online (job vm-mutvfh50-e54nev4y, 120 min budget)
- [2026-10-04T13:43:30.457Z | VM 1/3] self-check PASS: shell: VERIFIED (the harness executed bash on this VM at boot); node: v24.21.0; npm: 11.19.0; python3: Python 3.12.3; git: repo checked out @ e393400; filesystem: WRITABLE (the harness wrote + read back a probe file); skills: 22 knowledge docs in .newera/skills/ (list_skills / read_skill)

## Repository state
Changed/added files:
?? .newera/vm/WORKLOG.md
?? agent.log

Recent commits:
e393400 newera: VM agent job vm-mutvfh50-e54nev4y

## Current plan (todo state)
(no plan was recorded — write one with todo{steps} before editing)

## Contract status
## TASK CONTRACT — the requirement matrix the user approved (SCOPE LOCK)
- [pending] REQ-001 — Build and deploy RepoLens — a GitHub Project Intelligence Dashboard web application. (MANDATORY) | acceptance: A relevant build or static verification passed after the latest relevant edit.
- [pending] REQ-002 — ## Stack (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-003 — Next.js 14+ (App Router, TypeScript) (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-004 — Tailwind CSS for styling (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-005 — Deploy to Cloudflare Pages via Wrangler (MANDATORY) | acceptance: The deployment URL was probed successfully and matches the verified revision.
- [pending] REQ-006 — No external API keys required (public GitHub API only) (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-007 — ## Core Feature: Repository Intelligence Dashboard (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-008 — ### Input (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-009 — Single page with a search bar where user enters a public GitHub repository URL: (MANDATORY) | acceptance: The requested file or implementation exists and its relevant contents were inspected.
- [pending] REQ-010 — `https://github.com/owner/repository` (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-011 — ### Data to Fetch (via public GitHub REST API v3) (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-012 — Repository name, owner, description (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-013 — Stars, forks, watchers count (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-014 — Open issues count, open pull requests count (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-015 — Primary language (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-016 — License (SPDX ID + name) (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-017 — Repository size (KB) (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-018 — Created date, last updated date, last push date (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-019 — Default branch (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
- [pending] REQ-020 — Topics/tags array (MANDATORY) | acceptance: Concrete implementation evidence is recorded and the outcome matches the user request.
Work ONLY on these requirements — anything else is out of scope. Mark progress with update_contract. finish requires every MANDATORY requirement complete (or blocked with documented evidence).

## What the next VM must do
1. Check the repo state above — everything committed so far is real and on disk.
2. Do NOT redo finished work. Verify what exists (build, tests) before touching anything.
3. Continue the ORIGINAL task to completion, then finish with an honest summary.
4. If a deploy was requested and the build is green, make sure request_deploy was called (see .newera/vm/deploy-request.json).
