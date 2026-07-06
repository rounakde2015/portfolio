export const PROFILE = {
  name: "Alex Chen",
  title: "Senior Software Engineer",
  tagline: "Building scalable systems that power real products.",
  location: "San Francisco, CA",
  email: "hello@alexchen.dev",
  github: "https://github.com/alexchen",
  linkedin: "https://linkedin.com/in/alexchen",
  years: "7+",
};

export const HERO_ROLES = [
  "Senior Software Engineer",
  "Distributed Systems Architect",
  "Cloud Infrastructure Builder",
  "Full-Stack Craftsman",
  "Senior Software Engineer",
];

export const HERO_TICKER: Array<{ text: string; accent: boolean }> = [
  { text: "React", accent: false },
  { text: "★", accent: true },
  { text: "Java · Spring", accent: false },
  { text: "★", accent: true },
  { text: "Node.js", accent: false },
  { text: "★", accent: true },
  { text: "Kubernetes", accent: false },
  { text: "★", accent: true },
  { text: "PostgreSQL", accent: false },
  { text: "★", accent: true },
  { text: "MongoDB", accent: false },
  { text: "★", accent: true },
  { text: "AWS · GCP · Azure", accent: false },
  { text: "★", accent: true },
  { text: "Kafka", accent: false },
  { text: "★", accent: true },
  { text: "Go", accent: false },
  { text: "★", accent: true },
  { text: "TypeScript", accent: false },
  { text: "★", accent: true },
];

export const PROJECT_IMGS = [
  "https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBtaW5pbWFsJTIwdGVjaCUyMGdlb21ldHJ5fGVufDB8fHx8MTc4MjQ2ODA5OXww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1638864616275-9f0b291a2eb6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMGRhcmslMjBtaW5pbWFsJTIwdGVjaCUyMGdlb21ldHJ5fGVufDB8fHx8MTc4MjQ2ODA5OXww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1532190872407-280735d27e08?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGRhcmslMjBtaW5pbWFsJTIwdGVjaCUyMGdlb21ldHJ5fGVufDB8fHx8MTc4MjQ2ODA5OXww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1660914256311-918659fae88f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMGRhcmslMjBtaW5pbWFsJTIwdGVjaCUyMGdlb21ldHJ5fGVufDB8fHx8MTc4MjQ2ODA5OXww&ixlib=rb-4.1.0&q=85",
];

export type Project = {
  title: string;
  blurb: string;
  tags: string[];
  github: string;
  demo: string;
  img: string;
};

export const PROJECTS: Project[] = [
  {
    title: "Distributed Payments Platform",
    blurb:
      "Processed $2B+ in annual transaction volume across 40+ countries with sub-100ms p99 latency.",
    tags: ["Java", "Spring", "Kafka", "PostgreSQL", "AWS"],
    github: "https://github.com",
    demo: "https://example.com",
    img: PROJECT_IMGS[0],
  },
  {
    title: "Realtime Collaboration Engine",
    blurb: "CRDT-based document sync serving 1M+ concurrent users with 99.99% uptime SLA.",
    tags: ["Node.js", "WebSockets", "Redis", "MongoDB", "GCP"],
    github: "https://github.com",
    demo: "https://example.com",
    img: PROJECT_IMGS[1],
  },
  {
    title: "ML-Powered Search API",
    blurb:
      "Vector search platform indexing 200M+ documents, cut query latency by 73% over Elasticsearch.",
    tags: ["Python", "FastAPI", "pgvector", "React", "GCP"],
    github: "https://github.com",
    demo: "https://example.com",
    img: PROJECT_IMGS[2],
  },
  {
    title: "E-Commerce Storefront",
    blurb: "Headless commerce platform driving $45M GMV with sub-second TTI on mobile networks.",
    tags: ["React", "Next.js", "GraphQL", "PostgreSQL", "AWS"],
    github: "https://github.com",
    demo: "https://example.com",
    img: PROJECT_IMGS[3],
  },
  {
    title: "Observability Toolkit",
    blurb:
      "Open-source tracing SDK adopted by 12k+ developers; reduced MTTR by 60% across pilot teams.",
    tags: ["Go", "OpenTelemetry", "Kubernetes", "Grafana"],
    github: "https://github.com",
    demo: "https://example.com",
    img: PROJECT_IMGS[0],
  },
];

export type SkillGroup = { group: string; items: string[] };

export const SKILLS: SkillGroup[] = [
  { group: "Frontend", items: ["React", "Angular", "Vue", "TypeScript", "Next.js", "Tailwind"] },
  { group: "Backend", items: ["Node.js", "Express", "Java", "Spring", "Go", "GraphQL"] },
  { group: "Databases", items: ["PostgreSQL", "MongoDB", "Redis", "Kafka", "Elasticsearch"] },
  {
    group: "Cloud & DevOps",
    items: ["AWS", "GCP", "Azure", "Kubernetes", "Terraform", "Docker"],
  },
];

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  points: string[];
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: "Staff Software Engineer",
    company: "Stripe",
    period: "2022 — Present",
    points: [
      "Led architecture of next-gen payments orchestration layer serving $2B+ ARR.",
      "Mentored 8 engineers; established cross-team SLO discipline reducing incidents by 42%.",
      "Designed multi-region failover strategy with sub-30s RTO across 4 AWS regions.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Datadog",
    period: "2020 — 2022",
    points: [
      "Owned distributed tracing ingestion pipeline processing 50M spans/sec.",
      "Reduced storage costs 38% via custom columnar compression in ClickHouse.",
      "Drove migration of legacy Java services to Go, cutting p99 latency by 4x.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Airbnb",
    period: "2018 — 2020",
    points: [
      "Shipped guest review platform redesign — boosted completion rate by 27%.",
      "Built realtime messaging service using Node.js and Kafka, scaling to 12M DAU.",
      "Authored design doc adopted as company-wide pattern for event-driven services.",
    ],
  },
  {
    role: "Junior Software Engineer",
    company: "Square",
    period: "2017 — 2018",
    points: [
      "Built merchant analytics dashboard in React used by 500k+ small businesses.",
      "Implemented SQL query optimization pipeline reducing report time from 12s to 800ms.",
    ],
  },
];
