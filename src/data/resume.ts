// =============================================================================
// resume.ts — single source of truth for content.
// Shape v2: paragraph-style narratives, per-tile stat sources, and a typed
// `architecture` graph per project that drives the 3D diagrams in the Dialogs.
// =============================================================================

export type NodeKind = 'service' | 'datastore' | 'queue' | 'client' | 'external';
export type EdgeKind = 'sync' | 'async' | 'event';

export interface ArchNode {
  id: string;
  label: string;
  type: NodeKind;
  /** Optional positional hint for the 3D layout in [-1, 1] range. */
  hint?: [number, number, number];
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
  kind: EdgeKind;
}

export interface Architecture {
  nodes: ArchNode[];
  edges: ArchEdge[];
}

export interface Achievement {
  headline: string;
  detail: string;
  metrics?: string[];
}

export interface Role {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  narrative: string;
  achievements: Achievement[];
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  stack: string[];
  problem: string;
  approach: string;
  result: string;
  bullets: string[];
  architecture: Architecture;
  accent: 'lime' | 'violet' | 'ember' | 'cyan' | 'rose';
}

export interface Stat {
  primary: string;        // big number, parseable to int via parseInt
  primarySuffix: string;  // "+", "%", "+/s" etc — render verbatim
  caption: string;        // 1-2 line sub-headline
  source: string;         // attribution: project + team
}

export interface SkillGroup {
  category: string;
  blurb: string;          // one-liner used by the Service Registry 3D scene
  items: string[];
}

// -----------------------------------------------------------------------------
// Header
// -----------------------------------------------------------------------------

export const profile = {
  name: 'Prajwal Mahajan',
  title: 'Senior Backend Engineer',
  subtitle: 'Distributed Systems · Resilient Microservices · Production LLM',
  location: 'Bengaluru, India',
  email: 'prajwal.mahajan101@gmail.com',
  phone: '+91-8827029585',
  links: {
    linkedin: 'https://linkedin.com/in/prajwal-mahajan',
    github: 'https://github.com/prajwalmahajan101',
  },
  summary:
    'Senior backend engineer with three-plus years building distributed fintech, robotics and AI-integrated platforms. Most recently the sole architect of a five-service co-lending system at Optimo Capitals, where I shipped the gateway, the async partner-push engine, the React webapp and the Lambda mail-triage end-to-end — and built a resilience kernel that every service inherits without thinking about it. I work close to the database, prefer correctness invariants encoded as Postgres triggers over comments in code, and tune APIs by the millisecond.',
} as const;

// -----------------------------------------------------------------------------
// Stats — Telemetry tiles. Each one cites the project and team it came from.
// -----------------------------------------------------------------------------

export const stats: Stat[] = [
  {
    primary: '3',
    primarySuffix: '+',
    caption:
      'Years backend · shipped to prod with four teams of varying sizes; led teams at the last two companies.',
    source: 'Optimo · Viamagus (lead) · MindRuby · Tvast',
  },
  {
    primary: '10',
    primarySuffix: 'K+/s',
    caption: 'Peak messages/sec with zero message loss — MQTT broker + RabbitMQ topic routing.',
    source: 'Quason fleet · Viamagus (3-engineer team, I led)',
  },
  {
    primary: '99.5',
    primarySuffix: '%',
    caption: 'Uptime · 65% API latency cut · 80% DB-query reduction after Redis/Valkey caching + circuit breakers.',
    source: 'Co-Lending platform · Optimo Capitals (solo author, 4 of 5 repos)',
  },
  {
    primary: '10',
    primarySuffix: '+',
    caption: 'Production systems shipped end-to-end across four companies — fintech, robotics, LLM, real-time.',
    source: '2022 → present',
  },
];

// -----------------------------------------------------------------------------
// Skills — each category gets a one-line blurb that the 3D Service Registry
// scene labels each "EC2 instance" with.
// -----------------------------------------------------------------------------

export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    blurb: 'i-languages-01 · type-strict by default',
    items: ['TypeScript', 'JavaScript', 'Python', 'Java'],
  },
  {
    category: 'Backend',
    blurb: 'i-backend-01 · nest · express · django · fastapi · spring',
    items: ['NestJS', 'ExpressJS', 'Django', 'FastAPI', 'Spring Boot'],
  },
  {
    category: 'Distributed & Data',
    blurb: 'i-data-01 · postgres-first, valkey-fast, kafka-grade',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis / Valkey', 'RabbitMQ', 'MQTT', 'Celery', 'SQLAlchemy', 'Prisma', 'TypeORM'],
  },
  {
    category: 'Cloud & DevOps',
    blurb: 'i-cloud-01 · ap-south-1a · t3.shipped',
    items: ['AWS EC2', 'AWS S3', 'AWS Lambda', 'AWS RDS', 'AWS SES', 'Secrets Manager', 'ECR', 'Docker', 'nginx', 'GitHub Actions (OIDC)'],
  },
  {
    category: 'AI & LLM',
    blurb: 'i-ai-01 · prompt-versioned · rag-shipped',
    items: ['LangChain', 'RAG', 'Prompt Engineering', 'GPT-4', 'AWS Bedrock', 'Ollama'],
  },
  {
    category: 'Resilience & Security',
    blurb: 'i-resilience-01 · fail-clean · idempotent · fernet-encrypted',
    items: [
      'Circuit Breaker (PyBreaker)',
      'Retry-with-Backoff (Tenacity)',
      'Tiered Rate Limiting',
      'SSRF Protection',
      'HMAC + Nonce Webhooks',
      'Fernet Encryption',
      'JWT / RBAC',
      'Idempotency',
      'Event-driven Design',
    ],
  },
];

// -----------------------------------------------------------------------------
// Experience — narrative paragraphs + 3-5 paragraph achievements per role.
// -----------------------------------------------------------------------------

export const experience: Role[] = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Optimo Capitals',
    location: 'Bengaluru',
    start: 'Aug 2025',
    end: 'Present',
    narrative:
      'Joined Optimo as the sole backend on a five-service co-lending platform. I shipped the Django gateway, the async FastAPI partner-push engine, the React webapp and the AWS Lambda mail-triage end-to-end — four of the five repositories are entirely my code, and the fifth I co-authored. Beyond the gateway itself, I built a shared resilience kernel that every service inherits: a circuit breaker, retry-with-backoff, tiered rate limiting and dual caching — so the team gets the same correctness contracts without copying boilerplate.',
    achievements: [
      {
        headline: 'Architected a co-lending gateway across 8+ data sources',
        detail:
          'The gateway is the only thing lenders, partners and internal admins talk to. It orchestrates eight-plus internal and external data sources — bureau pulls, AA consent flows, partner pushes, internal eligibility — behind one cohesive API. Integration time fell by 40% because every new partner reuses the same retry, signing and idempotency machinery instead of reinventing it.',
        metrics: ['40% integration-time cut', 'gateway anchor of 5-service mesh'],
      },
      {
        headline: 'Built a dynamic dashboard platform driven by JSON config',
        detail:
          'Operators were filing tickets every time they wanted a new chart. I built a widget engine that reads JSON config, parallelises data fetches via an async execution graph, and ships fifty-plus widget types without a redeployment. A per-widget TTL cache layer slashed peak database load by three-quarters.',
        metrics: ['50+ widget types', '60% load-time cut', '75% peak DB-load reduction'],
      },
      {
        headline: 'Shipped an AI document-extraction pipeline for title-deed analysis',
        detail:
          'EC, MOTD and prior-mortgage documents used to be read manually — six-plus hours per week of paralegal time. I wired up an LLM + LangChain pipeline that parses ownership chains, detects encumbrances, computes confidence scores and surfaces only the cases that still need human review. The Ops team got their evenings back.',
        metrics: ['6+ hours/week reclaimed', 'multi-doc ownership-chain extraction'],
      },
      {
        headline: 'Hardened security at the lowest layer of the stack',
        detail:
          "SSRF blocking inside the HTTP client, magic-byte content sniffing on uploads, HMAC+nonce webhook signing, Fernet-encrypted partner credentials, and a fail-closed boot path that refuses to start if encryption keys are missing. The point isn't that any one of these is novel; the point is that every service inherits the whole set, so the security posture stays consistent as the system grows.",
        metrics: ['fail-closed boot', 'fernet · hmac+nonce · ssrf-guarded'],
      },
      {
        headline: 'Pushed business invariants into the database itself',
        detail:
          "Most platforms enforce business rules in application code. We enforce them in Postgres: CHECK constraints, BEFORE INSERT/UPDATE triggers, and durable-id idempotency tables. Admins, shell scripts, bulk_create paths and raw SQL all hit the same guardrails. Partial pushes fail clean and never reach a lender — which means we never had to clean up after a partial state.",
        metrics: ['CHECK constraints', 'BEFORE triggers', 'durable-id idempotency'],
      },
      {
        headline: 'Cut deploy time from 45 minutes to under 10',
        detail:
          'Migrated CI/CD to GitHub Actions + Docker with OIDC-based credentialing across multiple deployment pipelines. Mentored two interns through their first PRs and ran code review for the team.',
        metrics: ['45m → <10m deploys', 'OIDC · no static creds'],
      },
    ],
  },
  {
    title: 'Back End Engineer',
    company: 'Viamagus Technologies',
    location: 'Bengaluru',
    start: 'Dec 2023',
    end: 'Aug 2025',
    narrative:
      'Led a three-engineer team across backend, frontend and full-stack on Quason — a VDA-5050-compliant fleet management system controlling 100+ autonomous mobile robots in production warehouses. In parallel I built two more shippable products: Synthia, a RAG-based AI legal assistant, and the trial-user / subscription billing system for Intelligent Life. This was where I learnt to design for both real-time and consistency simultaneously.',
    achievements: [
      {
        headline: 'Built a real-time AMR communication backbone',
        detail:
          'AMRs and the orchestrator chat over MQTT (sub-100 ms commands) and RabbitMQ (durable task topics). Designed the topic routing, zone-based task assignment and collision avoidance protocol. Peak load: 10,000+ msgs/sec across the fleet with zero message loss on a sustained 24-hour soak test.',
        metrics: ['10K+ msgs/sec', '0 message loss', '<100ms cmd latency'],
      },
      {
        headline: 'Introduced a hardware-agnostic AGV simulator',
        detail:
          "Hardware QA was the bottleneck — you couldn't test a navigation change without booking a robot. I built a simulator that ran the same VDA-5050 envelope as the real fleet, so the team could regression-test scenarios in CI. Result: 70% less physical-device QA, a three-day cut in the release cycle, and a backlog of 500+ code-quality issues finally addressed.",
        metrics: ['70% less physical-device QA', '500+ issues resolved', '28% prod-bug cut'],
      },
      {
        headline: 'Shipped Synthia — RAG-based AI legal assistant',
        detail:
          'Built the full pipeline: contract ingestion → semantic chunking → vector embedding → clause-level Q&A with chain-of-thought reasoning. Layered in a document-comparison engine that highlights clause-level differences between contract versions and an async Celery batch processor for documents up to 500 pages. Managed 200+ versioned Redis prompt templates so legal could iterate without redeploying.',
        metrics: ['500-page documents', '200+ prompt templates', 'clause-level Q&A'],
      },
      {
        headline: 'Shipped Stripe-powered trial / billing infrastructure',
        detail:
          'For Intelligent Life: built a Trial Invite Service (validation + expiration rules), a Scheduler Service that automates trial expirations, subscription cancellations and multi-stage payment reminders, plus a multi-tenant Mobile Notification Service on FCM delivering 200+ pushes/day at 99% reliability.',
        metrics: ['200+ FCM pushes/day', '99% delivery', '3 production tenants'],
      },
    ],
  },
  {
    title: 'Software Engineer',
    company: 'MindRuby Technologies',
    location: 'Indore',
    start: 'Dec 2022',
    end: 'Aug 2023',
    narrative:
      'My first end-to-end product role — built a horizontally-scalable real-time chat system from scratch and the auth/permissions plumbing for a multi-tenant SaaS platform. Where I learnt that horizontal scaling is mostly about being honest about what state you actually share.',
    achievements: [
      {
        headline: 'Built a real-time E2E-encrypted chat system at 1000+ concurrent users',
        detail:
          'WebSocket server backed by Redis Pub/Sub as the message broker, so the system could scale horizontally without a single point of failure. AES-256 end-to-end encryption with a key-exchange protocol that keeps message contents private even from the server. Presence + read-receipts with optimistic UI updates landed sub-100ms perceived latency.',
        metrics: ['1000+ concurrent users', 'AES-256 E2E', 'sub-100ms perceived'],
      },
      {
        headline: 'Tightened the multi-tenant SaaS platform',
        detail:
          'JWT-based auth + RBAC with 15+ permission roles across the tenant tree. Indexed the hot tables, introduced connection pooling, and the average API response time fell by half.',
        metrics: ['15+ RBAC roles', '50% response-time cut'],
      },
    ],
  },
  {
    title: 'Software Developer',
    company: 'Tvast IT Solutions',
    location: 'Bengaluru (Remote)',
    start: 'Aug 2022',
    end: 'Dec 2022',
    narrative:
      'First professional role. Inherited a legacy codebase and worked alongside the Android team to unify the web and mobile design language — and to stop the bleeding of user-reported issues.',
    achievements: [
      {
        headline: 'Cut user-reported issues by 30% on a legacy codebase',
        detail:
          'Fixed critical front-end and back-end bugs across an ageing surface. Triaged the long tail, prioritised the loudest 20% that produced 80% of the complaints, and shipped weekly.',
        metrics: ['30% issue reduction'],
      },
      {
        headline: 'Aligned web with the mobile design language',
        detail:
          'Built responsive React components mirroring the Android team\'s patterns so the two products started looking like one product.',
        metrics: ['cross-platform design tokens'],
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// Projects — Problem / Approach / Result + an architecture graph for 3D.
// -----------------------------------------------------------------------------

export const projects: Project[] = [
  {
    slug: 'co-lending',
    name: 'Co-Lending Platform',
    tagline: 'Five-service distributed lending gateway',
    stack: ['Django', 'FastAPI', 'AWS', 'PostgreSQL', 'Docker'],
    problem:
      "Co-lending in India is a partner-integration problem disguised as a fintech product. Every lender has its own auth, signing convention, retry expectation and webhook contract — and a single missed retry can mean a lost loan. Our existing five teams kept reimplementing the same retry, idempotency and webhook logic per service, with subtly different bugs each time.",
    approach:
      'I designed and built four of the five services from scratch — the Django gateway, the async FastAPI partner-push engine, the React webapp and the AWS Lambda mail-triage — plus the Docker/nginx deploy stack. The core idea was to push all the cross-cutting machinery into a shared resilience kernel that each service imports: PyBreaker circuit breaker, retry-with-backoff, tiered Lua-backed rate limiting, dual-layer caching. Correctness invariants live in Postgres as CHECK constraints and BEFORE INSERT/UPDATE triggers, with a durable-id idempotency table — so admin paths, shell scripts and raw SQL all play by the same rules.',
    result:
      'Sole author of 4 of 5 repositories. Latency dropped 65%, DB queries fell 80% after multi-layer Redis/Valkey caching, and uptime moved from 97% → 99.5%. Deploys went from 45 min → under 10 min. Partial pushes now fail clean and never reach a lender.',
    bullets: [
      'Architected and built four of five services end-to-end — Django gateway, async FastAPI partner-push engine, React webapp, AWS Lambda mail-triage, plus the Docker/nginx deploy stack.',
      'Designed a shared resilience kernel (PyBreaker circuit breaker, retry-with-backoff, tiered Lua-backed rate limiting, dual caching) inherited by every service.',
      'Hardened security at the lowest layer: SSRF blocking inside HTTP client, magic-byte content sniffing on uploads, HMAC+nonce webhook signing, Fernet-encrypted partner credentials, fail-closed boot on missing keys.',
      'Pushed business invariants into Postgres via CHECK constraints, BEFORE INSERT/UPDATE triggers and durable-id idempotency — so admin, shell, bulk_create and raw-SQL paths cannot bypass the rules.',
    ],
    architecture: {
      nodes: [
        { id: 'client',   label: 'lender app',     type: 'client',    hint: [-1.4, 0,    0] },
        { id: 'gateway',  label: 'gateway',        type: 'service',   hint: [-0.6, 0.2,  0] },
        { id: 'push',     label: 'partner-push',   type: 'service',   hint: [ 0.4, 0.6,  0] },
        { id: 'valkey',   label: 'valkey',         type: 'datastore', hint: [ 0.4,-0.6,  0] },
        { id: 'pg',       label: 'postgres',       type: 'datastore', hint: [ 1.2, 0.2,  0] },
        { id: 'lambda',   label: 'lambda-triage',  type: 'external',  hint: [-0.6,-0.8,  0] },
      ],
      edges: [
        { from: 'client',  to: 'gateway', label: 'POST /apply',     kind: 'sync' },
        { from: 'gateway', to: 'valkey',  label: 'rate.limit',      kind: 'sync' },
        { from: 'gateway', to: 'pg',      label: 'CHECK + trigger', kind: 'sync' },
        { from: 'gateway', to: 'push',    label: 'enqueue',         kind: 'async' },
        { from: 'push',    to: 'pg',      label: 'durable_id',      kind: 'sync' },
        { from: 'lambda',  to: 'gateway', label: 'mail.classified', kind: 'event' },
      ],
    },
    accent: 'lime',
  },
  {
    slug: 'quason',
    name: 'Fleet Management — Quason',
    tagline: 'VDA 5050 backbone for 100+ AMRs',
    stack: ['NestJS', 'RabbitMQ', 'MQTT', 'Redis', 'Docker'],
    problem:
      "Warehouse AMR fleets need two contradictory things at once: sub-100ms command latency (or robots crash into each other) and durable task delivery (or you lose pickups during a broker restart). Existing setups picked one and bolted on a worse version of the other.",
    approach:
      "Split the transport: MQTT for low-latency real-time command/telemetry, RabbitMQ topic routing for durable task hand-off. Zone-based task assignment and a small collision-avoidance protocol baked into the orchestrator. I also built a hardware-agnostic AGV simulator running the same VDA-5050 envelope as production, so we could regression-test fleet behaviour in CI instead of on real robots.",
    result:
      'Sustained 10,000+ msgs/sec with zero message loss in a 24-hour soak. Live telemetry dashboard for 100+ robots with sub-second update latency. 70% less physical-device QA, three days off the release cycle, 28% drop in production bugs.',
    bullets: [
      'Real-time AMR communication backbone with MQTT broker + RabbitMQ topic routing — 10K+ msgs/sec, zero message loss.',
      'Zone-based task assignment and collision-avoidance protocol for dynamic routing.',
      'Live telemetry dashboard streaming battery, position and state for 100+ robots with sub-second update latency.',
      'Hardware-agnostic AGV simulator enabling full regression testing without physical devices — cut QA cycle by 3 days.',
    ],
    architecture: {
      nodes: [
        { id: 'orch',   label: 'orchestrator',  type: 'service',   hint: [ 0,    0,    0] },
        { id: 'broker', label: 'mqtt-broker',   type: 'queue',     hint: [ 0,    0.8,  0] },
        { id: 'rmq',    label: 'rabbitmq',      type: 'queue',     hint: [ 0,   -0.8,  0] },
        { id: 'amr1',   label: 'amr-001',       type: 'external',  hint: [-1.3,  0.6,  0] },
        { id: 'amr2',   label: 'amr-002',       type: 'external',  hint: [-1.3, -0.6,  0] },
        { id: 'amr3',   label: 'amr-003',       type: 'external',  hint: [ 1.3,  0.6,  0] },
        { id: 'amr4',   label: 'amr-004',       type: 'external',  hint: [ 1.3, -0.6,  0] },
        { id: 'tele',   label: 'telemetry-db',  type: 'datastore', hint: [ 1.6,  0,    0] },
      ],
      edges: [
        { from: 'amr1', to: 'broker', label: 'state',     kind: 'event' },
        { from: 'amr2', to: 'broker', label: 'state',     kind: 'event' },
        { from: 'amr3', to: 'broker', label: 'state',     kind: 'event' },
        { from: 'amr4', to: 'broker', label: 'state',     kind: 'event' },
        { from: 'broker', to: 'orch', label: 'qos=1',     kind: 'async' },
        { from: 'orch',   to: 'rmq',  label: 'task',      kind: 'async' },
        { from: 'rmq',    to: 'amr1', label: 'pickup',    kind: 'async' },
        { from: 'rmq',    to: 'amr3', label: 'pickup',    kind: 'async' },
        { from: 'orch',   to: 'tele', label: 'persist',   kind: 'sync'  },
      ],
    },
    accent: 'violet',
  },
  {
    slug: 'synthia',
    name: 'AI Legal Assistant — Synthia',
    tagline: 'RAG pipeline for contract analysis & redlining',
    stack: ['Python', 'FastAPI', 'LangChain', 'GPT-4', 'Celery'],
    problem:
      'Legal teams skim hundred-page contracts looking for the half-dozen clauses that actually changed. A naive LLM call hallucinates or misses citations entirely; a naive search misses the semantic match. Both are unusable at scale.',
    approach:
      'Built a full RAG pipeline: contract ingestion → semantic chunking → vector embedding → clause-level Q&A with chain-of-thought reasoning so each answer cites the clause it came from. Added a document-comparison engine that highlights clause-level diffs between contract versions, and a Celery-based async batch processor so 500-page documents do not block the API. 200+ versioned Redis prompt templates let the legal team iterate copy without redeploying code.',
    result:
      'Clause-level Q&A with high factual accuracy and grounded citations. Multi-stage prompt engineering with CoT reasoning for redlining and risk identification. Document comparison engine with structured change summaries.',
    bullets: [
      'RAG pipeline for contract ingestion, semantic chunking, vector embedding and clause-level Q&A.',
      'Multi-stage prompt engineering with chain-of-thought reasoning for redlining and risk identification.',
      'Document comparison engine highlighting clause-level diffs between contract versions.',
      'Celery-based async batch processing supporting documents up to 500 pages.',
      'Managed 200+ versioned Redis prompt templates so the legal team iterates without redeploying.',
    ],
    architecture: {
      nodes: [
        { id: 'doc',     label: 'document',     type: 'client',    hint: [-1.6, 0,    0] },
        { id: 'chunk',   label: 'chunker',      type: 'service',   hint: [-0.8, 0,    0] },
        { id: 'embed',   label: 'embedder',     type: 'service',   hint: [ 0,    0,    0] },
        { id: 'vec',     label: 'vector-db',    type: 'datastore', hint: [ 0.8, 0.6,  0] },
        { id: 'qa',      label: 'rag-worker',   type: 'service',   hint: [ 0.8,-0.6,  0] },
        { id: 'prompt',  label: 'prompt-vault', type: 'datastore', hint: [ 1.6, 0.6,  0] },
        { id: 'out',     label: 'cited answer', type: 'external',  hint: [ 1.6,-0.6,  0] },
      ],
      edges: [
        { from: 'doc',    to: 'chunk',  label: '500 pages', kind: 'async' },
        { from: 'chunk',  to: 'embed',  label: 'chunks',    kind: 'async' },
        { from: 'embed',  to: 'vec',    label: 'upsert',    kind: 'async' },
        { from: 'qa',     to: 'vec',    label: 'top-k',     kind: 'sync'  },
        { from: 'qa',     to: 'prompt', label: 'tpl@v17',   kind: 'sync'  },
        { from: 'qa',     to: 'out',    label: 'cot answer',kind: 'sync'  },
      ],
    },
    accent: 'ember',
  },
  {
    slug: 'dashboard',
    name: 'Dynamic Dashboard Platform',
    tagline: 'JSON-config widget engine, async fetch graph',
    stack: ['NestJS', 'TypeScript', 'AWS', 'PostgreSQL'],
    problem:
      "Ops was filing a ticket every time they wanted a new chart. Every new widget meant a code change, a code review, a deploy and a regression risk. The dashboard team was the bottleneck for everyone else.",
    approach:
      'Built a widget engine that reads JSON config — data source, refresh interval, layout, dependencies. Widgets compose into an async execution graph that parallelises fetches by dependency level, with a per-widget TTL cache so the same data source is never hit twice in one render. Layered in an audit trail and snapshot system for regulatory point-in-time recovery.',
    result:
      '50+ widget types configurable without a redeployment. 60% load-time reduction from the parallel execution graph. 75% peak DB-load reduction from the cache layer. Audit + snapshot system meets the compliance bar.',
    bullets: [
      'JSON-config widget engine supporting 50+ widget types — data sources, refresh intervals and layouts configurable without redeployment.',
      'Async execution graph parallelises widget data fetching (60% load-time cut).',
      'Per-widget TTL caching layer (75% peak DB-load reduction).',
      'Audit trail + snapshot system enabling point-in-time dashboard recovery and regulatory compliance.',
    ],
    architecture: {
      nodes: [
        { id: 'cfg',   label: 'json config',  type: 'client',    hint: [-1.5, 0.6,  0] },
        { id: 'eng',   label: 'widget-engine',type: 'service',   hint: [-0.4, 0.6,  0] },
        { id: 'graph', label: 'exec-graph',   type: 'service',   hint: [ 0.6, 0.6,  0] },
        { id: 'cache', label: 'ttl-cache',    type: 'datastore', hint: [ 0.6,-0.6,  0] },
        { id: 'src1',  label: 'rds (pg)',     type: 'datastore', hint: [ 1.6, 0.2,  0] },
        { id: 'src2',  label: 's3 metrics',   type: 'datastore', hint: [ 1.6,-0.4,  0] },
        { id: 'audit', label: 'audit-store',  type: 'datastore', hint: [-0.4,-0.6,  0] },
      ],
      edges: [
        { from: 'cfg',   to: 'eng',   label: 'parse',    kind: 'sync' },
        { from: 'eng',   to: 'graph', label: 'plan',     kind: 'sync' },
        { from: 'graph', to: 'cache', label: 'check',    kind: 'sync' },
        { from: 'graph', to: 'src1',  label: 'fetch',    kind: 'sync' },
        { from: 'graph', to: 'src2',  label: 'fetch',    kind: 'sync' },
        { from: 'eng',   to: 'audit', label: 'snapshot', kind: 'event' },
      ],
    },
    accent: 'cyan',
  },
  {
    slug: 'chat',
    name: 'Real-Time Encrypted Chat',
    tagline: 'E2E AES-256 over horizontally-scaled WebSockets',
    stack: ['Node.js', 'WebSockets', 'Redis Pub/Sub', 'MongoDB'],
    problem:
      "A typical WebSocket chat scales until one node — and then it doesn't, because everyone needs to know about every message. Encryption gets bolted on later and ends up routing keys through the server, which defeats the point.",
    approach:
      'Used Redis Pub/Sub as the broker so any number of WebSocket nodes share message state without a single point of failure. AES-256 end-to-end with a client-side key exchange — server never sees plaintext. Optimistic UI updates for sub-100ms perceived latency, plus a presence and read-receipt system that survives node restarts.',
    result:
      '1000+ concurrent users on a horizontally-scaled cluster with zero single point of failure. Sub-100ms perceived response. Messages stay private even if the server is compromised.',
    bullets: [
      'Horizontally scalable WebSocket server using Redis Pub/Sub as broker — no SPOF.',
      'End-to-end AES-256 encryption with key-exchange protocol — server never sees plaintext.',
      'Presence + read-receipt tracking with optimistic UI updates, sub-100ms perceived response.',
    ],
    architecture: {
      nodes: [
        { id: 'a',     label: 'client A',      type: 'client',    hint: [-1.5,  0.4, 0] },
        { id: 'ws1',   label: 'ws-node-1',     type: 'service',   hint: [-0.4,  0.6, 0] },
        { id: 'pub',   label: 'redis pub/sub', type: 'queue',     hint: [ 0,    0,   0] },
        { id: 'ws2',   label: 'ws-node-2',     type: 'service',   hint: [ 0.4,  0.6, 0] },
        { id: 'b',     label: 'client B',      type: 'client',    hint: [ 1.5,  0.4, 0] },
        { id: 'mongo', label: 'mongo logs',    type: 'datastore', hint: [ 0,   -0.8, 0] },
      ],
      edges: [
        { from: 'a',   to: 'ws1', label: 'e2e enc',   kind: 'sync' },
        { from: 'ws1', to: 'pub', label: 'fanout',    kind: 'event' },
        { from: 'pub', to: 'ws2', label: 'fanout',    kind: 'event' },
        { from: 'ws2', to: 'b',   label: 'e2e enc',   kind: 'sync' },
        { from: 'ws1', to: 'mongo', label: 'metadata',kind: 'async' },
      ],
    },
    accent: 'rose',
  },
];

// -----------------------------------------------------------------------------
// Education
// -----------------------------------------------------------------------------

export const education = {
  school: 'Indian Institute of Technology (IIT) Indore',
  degree: 'B.Tech in Mechanical Engineering',
  year: '2021',
  notes: [
    'Strong analytical foundation in mathematical modelling and systems optimisation — directly applied to software architecture and performance engineering.',
    'Transitioned into software engineering through rigorous self-study, open-source contributions and professional practice post-graduation.',
  ],
};

// -----------------------------------------------------------------------------
// The "Architecture in Action" section uses this canonical request trace.
// -----------------------------------------------------------------------------

export interface SequenceStep {
  from: string;
  to: string;
  label: string;
  timing?: string;
  detail?: string;
}

export const architectureLanes = ['client', 'gateway', 'valkey', 'partner-push', 'postgres', 'lambda-triage'] as const;

export const architectureSequence: SequenceStep[] = [
  { from: 'client', to: 'gateway', label: 'POST /co-lending/applications', timing: '8 ms', detail: 'Borrower submits a loan application with PAN, bureau consent, AA token.' },
  { from: 'gateway', to: 'valkey', label: 'rate.limit.tier=burst', timing: '2 ms', detail: 'Tiered rate limit checked against partner + user composite key. Burst allowed.' },
  { from: 'gateway', to: 'postgres', label: 'CHECK + BEFORE INSERT trigger', timing: '11 ms', detail: 'Postgres CHECK constraints and triggers run; business invariants enforced at the database, not in app code.' },
  { from: 'gateway', to: 'partner-push', label: 'enqueue (idempotency_key)', timing: '3 ms', detail: 'Hand-off to the async partner-push engine. Durable idempotency table guarantees exactly-once partner delivery.' },
  { from: 'partner-push', to: 'postgres', label: 'durable_id commit', timing: '7 ms', detail: 'Push state persisted before HTTP call. Crash here is safe: replay sees commit, skips duplicate send.' },
  { from: 'lambda-triage', to: 'gateway', label: 'mail.classified intent=lender_reply', timing: '120 ms', detail: 'A few hours later: lender replies via email. Lambda triage classifies the intent and posts the result back to the gateway, closing the loop.' },
];
