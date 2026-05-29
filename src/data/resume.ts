export interface Role {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  stack: string[];
  bullets: string[];
  highlight: string;
  accent: 'lime' | 'violet' | 'ember' | 'cyan' | 'rose';
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Stat {
  label: string;
  value: string;
  suffix?: string;
}

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
    'Senior backend engineer with 3+ years of experience building distributed fintech, robotics, and AI-integrated platforms — most recently as sole architect of a 5-service co-lending system at Optimo Capitals. Specialized in resilient microservices, async systems, security-first architecture, and database-enforced correctness.',
} as const;

export const stats: Stat[] = [
  { label: 'Years building backend', value: '3', suffix: '+' },
  { label: 'Services architected', value: '5', suffix: ' co-lending' },
  { label: 'AMRs orchestrated', value: '100', suffix: '+' },
  { label: 'Concurrent connections', value: '1000', suffix: '+' },
];

export const skills: SkillGroup[] = [
  { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Java'] },
  { category: 'Backend', items: ['NestJS', 'ExpressJS', 'Django', 'FastAPI', 'Spring Boot'] },
  {
    category: 'Distributed & Data',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis / Valkey', 'RabbitMQ', 'MQTT', 'Celery', 'SQLAlchemy', 'Prisma', 'TypeORM'],
  },
  {
    category: 'Cloud & DevOps',
    items: ['AWS EC2', 'AWS S3', 'AWS Lambda', 'AWS RDS', 'AWS SES', 'Secrets Manager', 'ECR', 'Docker', 'nginx', 'GitHub Actions (OIDC)'],
  },
  {
    category: 'AI & LLM',
    items: ['LangChain', 'RAG', 'Prompt Engineering', 'GPT-4', 'AWS Bedrock', 'Ollama'],
  },
  {
    category: 'Resilience & Security',
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

export const experience: Role[] = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Optimo Capitals',
    location: 'Bengaluru',
    start: 'Aug 2025',
    end: 'Present',
    bullets: [
      'Architected the co-lending gateway service orchestrating 8+ internal/external data sources, reducing integration time by 40% — anchor of the 5-service co-lending platform.',
      'Built dynamic dashboard platform with JSON-config-driven widget engine and async execution pipelines supporting 50+ widget configurations without redeployment.',
      'Built AI-powered document extraction pipeline (EC, MOTD, prior mortgages) using LLMs + LangChain for ownership-chain computation and title-deed analysis, saving 6+ manual hours/week.',
      'Integrated Account Aggregator framework for consent-based financial-data ingestion; shipped supporting microservices for employee sync, resignation triggers, and ETL pipelines.',
      'Implemented Redis/Valkey multi-layer caching reducing API latency by 65% and DB queries by 80%; applied circuit breaker + exponential-backoff retry improving uptime from 97% to 99.5%.',
      'Automated CI/CD with GitHub Actions + Docker across multiple deployment pipelines, reducing deployment time from 45 minutes to under 10 minutes.',
    ],
  },
  {
    title: 'Back End Engineer',
    company: 'Viamagus Technologies',
    location: 'Bengaluru',
    start: 'Dec 2023',
    end: 'Aug 2025',
    bullets: [
      'Developed VDA 5050-compliant fleet management system (Quason) controlling 100+ AMRs with sub-100ms bidirectional MQTT/RabbitMQ communication; led a 3-member team.',
      'Built AGV simulator enabling hardware-free end-to-end testing (70% less physical-device QA); led code quality initiative resolving 500+ issues, improving maintainability by 35%.',
      'Developed RAG-based AI legal assistant (Synthia) using LangChain + GPT-4 for contract analysis, redlining, and compliance.',
      'Shipped Stripe-powered Trial User feature for Intelligent Life with a Trial Invite Service and Scheduler Service automating trial expirations and multi-stage payment reminders.',
      'Designed a multi-tenant Mobile Notification Service on Firebase Cloud Messaging delivering 200+ push notifications/day at 99% reliability across 3 production deployments.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'MindRuby Technologies',
    location: 'Indore',
    start: 'Dec 2022',
    end: 'Aug 2023',
    bullets: [
      'Built real-time WebSocket chat system with AES-256 end-to-end encryption supporting 1,000+ concurrent connections.',
      'Optimized backend APIs and DB queries via indexing and connection pooling, improving average response time by 50%.',
      'Implemented JWT-based auth and RBAC for a multi-tenant SaaS platform with 15+ permission roles.',
    ],
  },
  {
    title: 'Software Developer',
    company: 'Tvast IT Solutions',
    location: 'Bengaluru (Remote)',
    start: 'Aug 2022',
    end: 'Dec 2022',
    bullets: [
      'Fixed critical frontend/backend bugs across a legacy codebase, reducing user-reported issues by 30%.',
      'Built responsive React UI components in collaboration with the Android team to unify web and mobile design language.',
    ],
  },
];

export const projects: Project[] = [
  {
    slug: 'co-lending',
    name: 'Co-Lending Platform',
    tagline: 'Five-service distributed lending gateway',
    stack: ['Django', 'FastAPI', 'AWS', 'PostgreSQL', 'Docker'],
    highlight: 'Sole author of 4 of 5 repositories. Resilience kernel inherited by every service.',
    bullets: [
      'Architected and built a 5-service co-lending platform end-to-end — Django gateway, async FastAPI partner-push engine, React webapp, AWS Lambda email triage, and the full Docker/nginx deploy stack.',
      'Designed a shared resilience kernel (PyBreaker circuit breaker, retry-with-backoff, tiered Lua-backed rate limiting, dual caching) so every service inherits identical contracts.',
      'Hardened security at the lowest layer: SSRF blocking inside HTTP client, magic-byte content sniffing, HMAC+nonce webhook signing, Fernet-encrypted partner credentials, fail-closed boot on missing keys.',
      'Pushed correctness invariants into Postgres via CHECK constraints, BEFORE INSERT/UPDATE triggers, and durable-id idempotency — admin, shell, bulk_create, and raw-SQL paths cannot bypass business rules.',
    ],
    accent: 'lime',
  },
  {
    slug: 'quason',
    name: 'Fleet Management — Quason',
    tagline: 'VDA 5050 backbone for 100+ AMRs',
    stack: ['NestJS', 'RabbitMQ', 'MQTT', 'Redis', 'Docker'],
    highlight: '10,000+ msgs/sec with zero message loss across a 100-robot fleet.',
    bullets: [
      'Built real-time AMR communication backbone using MQTT broker and RabbitMQ topic routing (10,000+ msgs/sec, no message loss); designed zone-based task assignment for dynamic AMR routing.',
      'Built live telemetry dashboard streaming battery, position, and state data for 100+ robots with sub-second update latency.',
      'Introduced hardware-agnostic AGV simulator enabling full regression testing without physical devices, cutting QA cycle by 3 days.',
    ],
    accent: 'violet',
  },
  {
    slug: 'synthia',
    name: 'AI Legal Assistant — Synthia',
    tagline: 'RAG pipeline for contract analysis & redlining',
    stack: ['Python', 'FastAPI', 'LangChain', 'GPT-4', 'Celery'],
    highlight: 'Clause-level Q&A across 500-page contracts. 200+ versioned prompt templates.',
    bullets: [
      'Developed RAG pipeline for contract ingestion, semantic chunking, vector embedding, and clause-level Q&A; implemented multi-stage prompt engineering with chain-of-thought reasoning.',
      'Built document comparison engine highlighting clause-level differences between contract versions with structured change summaries.',
      'Deployed Celery-based async batch processing supporting documents up to 500 pages; managed 200+ versioned Redis prompt templates.',
    ],
    accent: 'ember',
  },
  {
    slug: 'dashboard',
    name: 'Dynamic Dashboard Platform',
    tagline: 'JSON-config widget engine, async fetch graph',
    stack: ['NestJS', 'TypeScript', 'AWS', 'PostgreSQL'],
    highlight: '50+ widget types, 60% load-time cut, 75% peak DB-load reduction.',
    bullets: [
      'Designed JSON-config-driven widget engine supporting 50+ widget types — data sources, refresh intervals, and layouts configurable without redeployment.',
      'Implemented async execution graph parallelising widget data fetching (60% load-time reduction) plus per-widget TTL caching layer (75% peak DB-load reduction).',
      'Added audit trail and snapshot system enabling point-in-time dashboard recovery and regulatory compliance reporting.',
    ],
    accent: 'cyan',
  },
  {
    slug: 'chat',
    name: 'Real-Time Encrypted Chat',
    tagline: 'E2E AES-256 over horizontally-scaled WebSockets',
    stack: ['Node.js', 'WebSockets', 'Redis Pub/Sub', 'MongoDB'],
    highlight: 'Sub-100ms perceived response for 1,000+ concurrent users.',
    bullets: [
      'Engineered horizontally scalable WebSocket server using Redis Pub/Sub as message broker, supporting multi-instance deployment with no single point of failure.',
      'Implemented end-to-end AES-256 encryption with key exchange protocol ensuring message privacy even from server-side access.',
      'Designed presence system and read-receipt tracking with optimistic UI updates achieving sub-100ms perceived response time.',
    ],
    accent: 'rose',
  },
];

export const education = {
  school: 'Indian Institute of Technology (IIT) Indore',
  degree: 'B.Tech in Mechanical Engineering',
  year: '2021',
  notes: [
    'Strong analytical foundation in mathematical modelling and systems optimization — directly applied to software architecture and performance engineering.',
    'Transitioned into software engineering through rigorous self-study, open-source contributions, and professional practice post-graduation.',
  ],
};
