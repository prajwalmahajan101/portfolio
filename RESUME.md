# Prajwal Mahajan

**Senior Backend Engineer | Software Engineer | Distributed Systems**

Bengaluru, India | prajwal.mahajan101@gmail.com | +91-8827029585
[linkedin.com/in/prajwal-mahajan](https://linkedin.com/in/prajwal-mahajan) | [github.com/prajwalmahajan101](https://github.com/prajwalmahajan101)

## Summary

Senior backend engineer with 3+ years of experience building distributed fintech, robotics, and AI-integrated platforms — most recently as sole architect of a 5-service co-lending system at Optimo Capitals. Specialized in resilient microservices, async systems, security-first architecture, and database-enforced correctness. Strong experience across Django, FastAPI, NestJS, PostgreSQL, Redis/Valkey, AWS, and production LLM pipelines.

## Technical Skills

- **Languages:** TypeScript, JavaScript, Python, Java
- **Backend Frameworks:** NestJS, ExpressJS, Django, FastAPI, Spring Boot
- **Distributed Systems & Data:** PostgreSQL, MySQL, MongoDB, Redis / Valkey, RabbitMQ, MQTT, Celery, SQLAlchemy, Prisma, TypeORM
- **Cloud & DevOps:** AWS (EC2, S3, Lambda, SES, RDS, Secrets Manager, ECR), Docker, nginx, GitHub Actions (OIDC), CI/CD
- **AI & LLM Systems:** LangChain, RAG, Prompt Engineering, GPT-4, Bedrock, Ollama
- **Resilience & Architecture:** Circuit Breaker (PyBreaker), Retry-with-Backoff (Tenacity), Tiered Rate Limiting, SSRF Protection, HMAC+Nonce Webhooks, Fernet Encryption, JWT/RBAC, Idempotency, Event-driven Design, Microservices

## Professional Experience

### Senior Full Stack Developer — Optimo Capitals, Bengaluru
*Aug 2025 – Present*

- Architected the co-lending gateway service orchestrating 8+ internal/external data sources, reducing integration time by 40% and cutting inter-service coupling — anchor of the 5-service co-lending platform
- Built dynamic dashboard platform with JSON-config-driven widget engine and async execution pipelines supporting 50+ widget configurations without redeployment
- Built AI-powered document extraction pipeline (EC, MOTD, prior mortgages) using LLMs + LangChain for ownership-chain computation and title-deed analysis, saving 6+ manual hours/week
- Integrated Account Aggregator framework for consent-based financial-data ingestion; built Integration Valuation Model for vendor valuation comparison; shipped supporting microservices for employee sync, resignation triggers, and ETL pipelines
- Implemented Redis/Valkey multi-layer caching reducing API latency by 65% and DB queries by 80%; applied circuit breaker + exponential-backoff retry improving uptime from 97% to 99.5% with CloudWatch distributed tracing
- Automated CI/CD with GitHub Actions + Docker across multiple deployment pipelines, reducing deployment time from 45 minutes to under 10 minutes; mentored interns and led PR + code reviews

### Back End Engineer — Viamagus Technologies, Bengaluru
*Dec 2023 – Aug 2025*

- Developed VDA 5050-compliant fleet management system (Quason) controlling 100+ AMRs with sub-100ms bidirectional MQTT/RabbitMQ communication; led a 3-member team across backend, frontend, and full-stack
- Built AGV simulator enabling hardware-free end-to-end testing (70% less physical-device QA); led code quality initiative resolving 500+ issues, improving maintainability by 35% and cutting production bugs by 28%
- Developed RAG-based AI legal assistant (Synthia) using LangChain + GPT-4 for contract analysis, redlining, and compliance; managed 200+ Redis prompt templates and Celery background jobs automating 10% of manual workflows
- Shipped Stripe-powered Trial User feature for Intelligent Life with a Trial Invite Service (validation + expiration rules) and a Scheduler Service automating trial expirations, subscription cancellations, and multi-stage payment reminders
- Designed a multi-tenant Mobile Notification Service on Firebase Cloud Messaging delivering 200+ push notifications/day at 99% reliability across 3 production deployments

### Software Engineer — MindRuby Technologies, Indore
*Dec 2022 – Aug 2023*

- Built real-time WebSocket chat system with AES-256 end-to-end encryption supporting 1,000+ concurrent connections
- Optimized backend APIs and DB queries via indexing and connection pooling, improving average response time by 50%
- Implemented JWT-based auth and RBAC for a multi-tenant SaaS platform with 15+ permission roles

### Software Developer — Tvast IT Solutions, Bengaluru (Remote)
*Aug 2022 – Dec 2022*

- Fixed critical frontend/backend bugs across a legacy codebase, reducing user-reported issues by 30%
- Built responsive React UI components in collaboration with the Android team to unify web and mobile design language

## Key Projects

### Co-Lending Platform — Optimo Capitals
*Django, FastAPI, AWS, PostgreSQL, Docker*

- Architected and built a 5-service co-lending platform end-to-end — Django gateway, async FastAPI partner-push engine, React webapp, AWS Lambda email triage, and the full Docker/nginx deploy stack — as sole author of 4 of 5 repositories
- Designed a shared resilience kernel (PyBreaker circuit breaker, retry-with-backoff, tiered Lua-backed rate limiting, dual caching) so every service inherits identical contracts; collapsed RabbitMQ onto Valkey to drop a container from the runtime stack
- Hardened security at the lowest layer: SSRF blocking inside HTTP client, magic-byte content sniffing on uploads, HMAC+nonce webhook signing, Fernet-encrypted partner credentials, fail-closed boot on missing encryption keys
- Pushed correctness invariants into Postgres via CHECK constraints, BEFORE INSERT/UPDATE triggers, and durable-id idempotency — so admin, shell, bulk_create, and raw-SQL paths cannot bypass business rules; partial pushes fail clean and never reach a lender

### Fleet Management System — Quason
*NestJS, RabbitMQ, MQTT, Redis, Docker*

- Built real-time AMR communication backbone using MQTT broker and RabbitMQ topic routing (10,000+ msgs/sec, no message loss); designed zone-based task assignment for dynamic AMR routing and collision avoidance
- Built live telemetry dashboard streaming battery, position, and state data for 100+ robots with sub-second update latency
- Introduced hardware-agnostic AGV simulator enabling full regression testing without physical devices, cutting QA cycle by 3 days

### AI Legal Assistant — Synthia
*Python, FastAPI, LangChain, GPT-4*

- Developed RAG pipeline for contract ingestion, semantic chunking, vector embedding, and clause-level Q&A with high factual accuracy; implemented multi-stage prompt engineering with chain-of-thought reasoning for redlining and risk identification
- Built document comparison engine highlighting clause-level differences between contract versions with structured change summaries
- Deployed Celery-based async batch processing supporting documents up to 500 pages; managed 200+ versioned Redis prompt templates

### Dynamic Dashboard Platform
*NestJS, TypeScript, AWS, PostgreSQL*

- Designed JSON-config-driven widget engine supporting 50+ widget types — data sources, refresh intervals, and layouts configurable without redeployment
- Implemented async execution graph parallelising widget data fetching (60% load-time reduction) plus per-widget TTL caching layer (75% peak DB-load reduction)
- Added audit trail and snapshot system enabling point-in-time dashboard recovery and regulatory compliance reporting

### Real-Time Encrypted Chat System
*Node.js, WebSockets, AES-256, MongoDB*

- Engineered horizontally scalable WebSocket server using Redis Pub/Sub as message broker, supporting multi-instance deployment with no single point of failure
- Implemented end-to-end AES-256 encryption with key exchange protocol ensuring message privacy even from server-side access
- Designed presence system and read-receipt tracking with optimistic UI updates achieving sub-100ms perceived response time for 1,000+ concurrent users

## Education

### Indian Institute of Technology (IIT) Indore — B.Tech in Mechanical Engineering
*2021*

- Strong analytical foundation in mathematical modelling and systems optimization — directly applied to software architecture and performance engineering
- Transitioned into software engineering through rigorous self-study, open-source contributions, and professional practice post-graduation
