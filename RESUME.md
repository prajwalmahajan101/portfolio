# Prajwal Mahajan

**Senior Backend Engineer | Software Engineer | Distributed Systems**

Bengaluru, India | prajwal.mahajan101@gmail.com | +91-8827029585
[linkedin.com/in/prajwal-mahajan](https://linkedin.com/in/prajwal-mahajan) | [github.com/prajwalmahajan101](https://github.com/prajwalmahajan101)

## Summary

Senior backend engineer with three-plus years building distributed fintech, robotics and AI-integrated platforms. At Optimo Capitals, working as the lead I architected 8 of 14 internal services in 10 months — including the OptiView dashboard platform (Django + multi-DB, the company's biggest single project) and the 5-service co-lending mesh (sole author of 4 of 5 repos). Comfortable shipping production AWS Lambda services, federated EC2 deploys, and database-enforced correctness. Daily across Django, FastAPI, NestJS, PostgreSQL, Redis/Valkey, AWS (Lambda · EC2 · Bedrock), and production LLM pipelines.

## Technical Skills

- **Languages:** TypeScript, JavaScript, Python, Java
- **Backend:** NestJS, ExpressJS, Django, FastAPI, Spring Boot
- **Distributed & Data:** PostgreSQL, MySQL, MongoDB, Redis / Valkey, RabbitMQ, MQTT, Celery, SQLAlchemy, Prisma, TypeORM
- **Cloud & DevOps:** AWS EC2, AWS S3, AWS Lambda + Mangum, AWS RDS, AWS SES, EventBridge, Secrets Manager, ECR, Docker, nginx, GitHub Actions (OIDC)
- **AI & LLM:** LangChain, RAG, Prompt Engineering, GPT-4, AWS Bedrock, Ollama
- **Resilience & Security:** Circuit Breaker (PyBreaker), Retry-with-Backoff (Tenacity), Tiered Rate Limiting, SSRF Protection, HMAC + Nonce Webhooks, Fernet Encryption, JWT / RBAC, Idempotency, Audit-log + DLQ, Settings-source precedence, Event-driven Design

## Professional Experience

### Senior Full Stack Developer — Optimo Capitals, Bengaluru
*Aug 2025 – Present*

- **OptiView dashboard platform — Django + DRF · 274 commits · architected end-to-end · 5 months.** Multi-DB engine (Postgres / MySQL / Mongo / SQLite via SQLAlchemy) with JWT access+refresh rotation and blacklist-on-logout, Google OAuth via django-allauth, dashboard-level RBAC and per-tier rate limiting (Free / Pro / Enterprise), async Celery card execution with progress tracking and explicit task ownership, universal `{{param}}` parameterised queries with type validation and coercion, configurable TTL caching with user-scoped keys, thread-safe pooled connections wrapped in retry + circuit breaker, and JSON dashboard import/export with dependency resolution and a full ImportSession audit trail. _(274 commits · lead · multi-DB query layer · dashboard-level RBAC · audited import/export)_
- **Co-lending platform — 5-service mesh · sole author of 4 of 5 repos.** Django gateway, async FastAPI partner-push engine (a 7-stage BHN flow with stages 4/5/6 parallelised and AHFC-exists recovery on stage 3), React webapp, AWS Lambda email triage, and the federated Docker/nginx UAT deploy stack. Designed a shared resilience kernel (PyBreaker circuit breaker, retry-with-backoff, tiered Lua-backed rate limiting, dual caching) so every service inherits identical contracts; collapsed RabbitMQ onto Valkey to drop a container; pushed correctness invariants into Postgres via CHECK + BEFORE INSERT/UPDATE triggers + durable-id idempotency tables so admin, shell, bulk_create and raw-SQL paths all hit the same guardrails. _(5-service mesh · sole author 4/5 · 7-stage BHN flow · RabbitMQ → Valkey collapse)_
- **Three production AWS Lambda services — FastAPI + Mangum.** Employee Sync App — integrates employee records from the company's HR system (GreytHR) into the internal HRIS using EventBridge-scheduled jobs, API Gateway HTTP triggers, retry and observability. Internal Valuation Processing — wired the DS team's property-valuation model into Synoriq (LOS/LMS), building the trigger endpoints and APIs that orchestrate vendor-rate evaluation with `asyncio.gather`, Secrets-Manager-priority settings, and the async audit logs. Email Analyzer — classifies incoming partner emails by sender and keyword, then routes each message to the right processing pipeline based on use-case. Gmail Apps Script webhook → HMAC-verified Lambda → LLM (Bedrock cloud / Ollama local) → Pydantic v2 → downstream API, with idempotent dedup and SNS → S3 DLQ for permanent failures. _(3 Lambda services · EventBridge schedules · DS model + Synoriq · HMAC + idempotent dedup + DLQ)_
- **Account Aggregator + 5+ ETL/ELT pipelines.** Integrated the Account Aggregator framework for consent-based financial-data ingestion — the canonical Indian fintech consent protocol. Built the Integration Valuation Model that compares vendor valuations side-by-side so underwriters can defend a number. Shipped 5+ ETL/ELT pipelines covering HRIS employee sync, resignation-triggered offboarding, vendor reconciliation, downstream LOS data syncs and partner reconciliation — the unglamorous plumbing that makes a real platform tick. _(AA consent ingestion · Integration Valuation Model · 5+ ETL/ELT pipelines)_
- **Cross-cutting platform work — caching, resilience, observability, CI/CD.** Multi-layer Redis/Valkey caching (per-request memo + Valkey shared cache) cut API latency by 65% and dropped database query volume by 80%. Every outbound partner call sits inside a circuit breaker with exponential-backoff retry — partner blips no longer cascade — and uptime moved from 97% to 99.5%. CloudWatch distributed tracing makes the call graph legible during incidents. CI/CD on GitHub Actions + Docker + OIDC took deploy time from 45 min → under 10. Mentored interns and ran PR + code review across team repos. _(65% latency cut · 80% fewer DB queries · 97% → 99.5% uptime · 45m → <10m deploys)_
- **Security at the lowest layer.** SSRF blocking inside the HTTP client, magic-byte content sniffing on uploads, HMAC+nonce webhook signing, Fernet-encrypted partner credentials, and a fail-closed boot path that refuses to start if encryption keys are missing. Applied uniformly across the gateway, the partner-push engine and the Lambda services so the security posture stays consistent as the platform grows. _(fail-closed boot · fernet · hmac+nonce · SSRF-guarded · magic-byte sniffing)_

### Back End Engineer — Viamagus Technologies, Bengaluru
*Dec 2023 – Aug 2025*

- **Real-time AMR communication backbone (Quason).** AMRs and the orchestrator chat over MQTT (sub-100 ms commands) and RabbitMQ (durable task topics). Designed the topic routing, zone-based task assignment and collision-avoidance protocol. Built a scalable Subscription Microservice on RabbitMQ that manages the concurrent MQTT connections for hundreds of AMRs — including the 100 Hachdori AMRs and other VDA-compliant manufacturers' hardware. Peak load: 10,000+ msgs/sec across the fleet with zero message loss on a sustained 24-hour soak. _(10K+ msgs/sec · 0 message loss · <100ms cmd latency · 100+ AMRs · VDA 5050)_
- **Hardware-agnostic AGV simulator + code-quality drive.** Hardware QA was the bottleneck — you couldn't test a navigation change without booking a robot. Built a simulator that runs the same VDA-5050 envelope as the real fleet so the team could regression-test scenarios in CI. Same window, led a code-quality initiative that resolved 500+ issues across the codebase, improving maintainability by 35% and cutting production bugs by 28%. _(70% less physical-device QA · 500+ issues resolved · 35% maintainability · 28% prod-bug cut)_
- **Synthia — RAG-based AI legal assistant.** Built the full pipeline: contract ingestion → semantic chunking → vector embedding → clause-level Q&A with chain-of-thought reasoning and few-shot prompting for higher factual accuracy. Layered in a document-comparison engine that highlights clause-level differences between contract versions, an async Celery batch processor for documents up to 500 pages, and a Word plugin so legal can suggest changes, generate comments and resolve redlines from inside Office. Managed 200+ versioned Redis prompt templates so the team iterates copy without redeploying; automated about 10% of manual legal workflows. _(500-page documents · 200+ prompt templates · Word plugin · 10% manual-workflow automation)_
- **Stripe-powered trial + billing (Intelligent Life).** Led the backend team to ship the Trial User feature on Stripe. Built a Trial Invite Service with unlimited trial users plus strict validation and expiration rules, then a Scheduler Service that automates trial expirations, subscription cancellations and a multi-stage payment-reminder flow (three reminders per plan) for retention. _(unlimited trial invites · 3 reminders per plan · automated cancellation flow)_
- **Multi-tenant Mobile Notification Service.** A standalone notification service on Firebase Cloud Messaging with multi-tenant configuration, robust delivery + failure logging, and tenant-specific routing rules. Shipped across three production deployments delivering 200+ push notifications per day at 99% reliability. _(200+ FCM pushes/day · 99% delivery · 3 production tenants)_

### Software Engineer — MindRuby Technologies, Indore
*Dec 2022 – Aug 2023*

- **Blinkly Email — frontend redesign.** Spearheaded the mobile UI redesign for the email server with a focus on responsiveness; introduced a threading view, automated attachment forwarding and a global email search. Optimised the hot API calls and DB queries — HTML DOM render time fell by 50% end-to-end. End-to-end encryption applied at the email-content layer. _(50% DOM render-time cut · threading + global search · end-to-end encryption)_
- **Blinkly Email — backend modernisation.** Led the Node.js v14 → v16 migration of the legacy email backend (library compatibility, deprecated-API cleanup, transition plan). Integrated a React frontend into the existing Express project; cut the Deletion API's server load by 20%; reworked Multer for drag-and-drop file handling; added backend support for threaded email replies and forwards. _(Node 14 → 16 migration · 20% deletion-API load cut · threaded replies)_
- **Blinkly Chat — TypeScript Express server from scratch.** Designed the ER model and decomposed the messaging service into components, then built the entire TypeScript Express server from scratch with WebSocket for real-time delivery and AES-256 end-to-end encryption — supporting 1,000+ concurrent connections with sub-100ms perceived latency. Worked closely with the React frontend on API + WebSocket integration. _(1000+ concurrent users · AES-256 E2E · WebSocket real-time)_
- **Multi-tenant SaaS auth + DB perf.** JWT-based auth + RBAC with 15+ permission roles across the tenant tree. Indexed hot tables, introduced connection pooling, and the average API response time fell by half. _(15+ RBAC roles · 50% response-time cut · connection pooling + indexed hot tables)_

### Software Developer — Tvast IT Solutions, Bengaluru (Remote)
*Aug 2022 – Dec 2022*

- **ACRU bug-fix sprint — 30% issue reduction.** Triaged and closed critical frontend and backend defects across the legacy ACRU codebase during testing. Prioritised the loudest 20% of issues that produced 80% of user complaints and shipped weekly. _(30% issue reduction · frontend + backend coverage)_
- **Piggybank stabilisation + Gold-module separation.** Stabilised the Piggybank feature with backend bug fixes; collaborated with the Android team on a "close on back" UX flow that smoothed user navigation. Separated the Gold module out of the comprehensive ACRU project to streamline ownership and make the Gold surface independently shippable. _("close-on-back" flow · module separation)_
- **React UI build-out off Figma designs.** Built 2+ React frontends from scratch off Figma designs (including the new Gold-module UI), unifying the web and mobile design language with the Android team — the two products began looking like one product. _(2+ React UIs · cross-platform design tokens)_

## Key Projects

### Co-Lending Platform
*Django, FastAPI, React 19, AWS Lambda, PostgreSQL, Valkey, Docker, nginx*

- Architected and built four of five services end-to-end — Django gateway, async FastAPI partner-push engine, React 19 webapp ("Heimdall"), AWS Lambda email triage — plus the Docker Compose + nginx UAT ops repo.
- Shared resilience kernel inherited by every service — PyBreaker circuit breaker with breaker-excluded business errors, tenacity retry-with-backoff gated to 5xx, tiered Lua-backed rate limiting on Valkey, two-layer caching, outbound URL allowlist.
- Database-enforced correctness — CHECK constraints, BEFORE INSERT/UPDATE triggers and durable-id idempotency tables — so admin, shell, `bulk_create` and raw SQL paths cannot bypass business rules.
- Security at the lowest layer: SSRF blocking inside the HTTP client, magic-byte content sniffing on uploads, HMAC + nonce-protected webhooks, Fernet-encrypted partner credentials, fail-closed boot on missing keys.
- BHN five-stage push (case → sanction → assets → documents → underwriting) with stages 2–5 fanned out in parallel and AHFC-406 recovery via stored `fallback_case_id` — exactly one audit row marked `recovered: true`, never a duplicate at BHN.
- Federated UAT deploy — each app repo builds to ECR and fires a `repository_dispatch` event at the ops repo, which runs `docker compose` behind one nginx with a SAN TLS cert; ops repo holds no application code.

### Fleet Management — Quason
*NestJS, RabbitMQ, MQTT, Redis, Blockly, Docker*

- Real-time AMR communication backbone with MQTT broker + RabbitMQ topic routing — 10K+ msgs/sec, zero message loss across a 24-hour soak.
- Blockly-based dynamic workflow editor so operations compose AGV missions visually instead of filing engineering tickets.
- VDA 5050 mission compiler converts each Blockly workflow into hardware-agnostic AGV instructions every compliant robot can execute.
- Complex workflow primitives — selectable stops, conditional loops, non-AGV actions (e.g. "unlock the gate") that pause the mission until a human callback returns.
- Zone-based task assignment and a collision-avoidance protocol baked into the orchestrator for dynamic routing across the fleet.
- Live telemetry dashboard streaming battery, position and state for 100+ robots with sub-second update latency.
- Hardware-agnostic AGV simulator running the same VDA 5050 envelope as production — full regression testing in CI without physical devices, cut QA cycle by 3 days.

### AI Legal Assistant — Synthia
*Python, FastAPI, LangChain, GPT-4, Celery, Redis*

- RAG pipeline for contract ingestion, semantic chunking, vector embedding and clause-level Q&A with grounded clause citations.
- LangChain agent flow with chain-of-thought reasoning — the agent plans the analysis, calls retrieval and comparison tools step by step.
- Word plugin (Office.js) where the agent uses function-calling tools against Word's exposed APIs to insert suggestions, add comments and resolve redlines directly in the document.
- Document comparison engine highlighting clause-level diffs between contract versions for fast redline review.
- Celery-based async batch processing handling documents up to 500 pages without blocking the API.
- Redis-backed prompt vault — 200+ GPT-4-generated templates, versioned and tunable by the legal team without a redeploy.
- Reinforced-learning feedback loop on the prompt vault so reviewer corrections steadily improve agent accuracy.

### OptiView — Dashboard Platform
*Django, DRF, Celery, Redis, PostgreSQL, MySQL, MongoDB*

- Multi-DB integration across PostgreSQL / MySQL / MongoDB / SQLite via SQLAlchemy — a single query layer reaches all four.
- Universal `{{param}}` parameterised queries with type validation and coercion so analyst-authored SQL stays safe at runtime.
- Async Celery card execution with per-task progress tracking and explicit task ownership — no worker can steal another's work.
- Thread-safe pooled connections wrapped in retry + circuit breaker so a slow upstream never starves the dashboard.
- Configurable TTL caching with user-scoped keys; per-tier rate limiting (Free / Pro / Enterprise) keeps noisy tenants honest.
- JWT access+refresh rotation with blacklist-on-logout, Google OAuth via django-allauth, mandatory email-verified signups; dashboard-level RBAC.
- Full JSON dashboard export and import with dependency resolution, schema validation and ImportSession/ImportLog audit trail — ship dashboards between environments cleanly.
- Configurable analysis widgets — heat maps, pie charts, line graphs — each completely tunable from the admin portal without code changes.
- Comment section on every dashboard card so analysts leave feedback in-line on the data they actually use.
- Frontend glossary for domain jargon, with entries editable from the admin portal so terminology stays current without a deploy.

### Real-Time Encrypted Chat
*Node.js, TypeScript, WebSockets, Redis Pub/Sub, MongoDB*

- Horizontally scalable WebSocket server using Redis Pub/Sub as broker — any node can drop without losing the conversation.
- End-to-end AES-256 encryption with a client-side key-exchange protocol — the server only ever sees ciphertext.
- Optimistic UI updates for sub-100ms perceived latency, reconciled against the server ack.
- Presence + read-receipt tracking persisted in Redis so the state survives a node restart.
- Mongo holds only message metadata (timestamps, audit), never plaintext message bodies.

## Education

### Indian Institute of Technology (IIT) Indore — B.Tech in Mechanical Engineering
*2021*

- Strong analytical foundation in mathematical modelling and systems optimisation — directly applied to software architecture and performance engineering.
- Transitioned into software engineering through rigorous self-study, open-source contributions and professional practice post-graduation.
