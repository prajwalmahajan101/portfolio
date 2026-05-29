// =============================================================================
// resume.types.ts — TypeScript shapes for data/resume.yaml.
// The YAML at data/resume.yaml is the single source of truth for content.
// resume.ts imports the YAML and casts the default export to `ResumeData`.
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
  primary: string;
  primarySuffix: string;
  caption: string;
  source: string;
}

export interface SkillGroup {
  category: string;
  blurb: string;
  items: string[];
}

export interface Profile {
  name: string;
  title: string;
  subtitle: string;
  location: string;
  email: string;
  phone: string;
  links: {
    linkedin: string;
    github: string;
  };
  summary: string;
}

export interface Education {
  school: string;
  degree: string;
  year: string;
  notes: string[];
}

export interface About {
  paragraphs: string[];
}

export interface PlatformNode {
  id: string;
  label: string;
  sub: string;
  col: number;
  row: number;
}

export interface PlatformEdge {
  from: string;
  to: string;
  label?: string;
  kind: EdgeKind;
}

export interface ArchitectureMap {
  caption: string;
  services: PlatformNode[];
  externals: PlatformNode[];
  edges: PlatformEdge[];
}

export interface ResumeData {
  profile: Profile;
  stats: Stat[];
  about: About;
  skills: SkillGroup[];
  experience: Role[];
  projects: Project[];
  education: Education;
  architectureMap: ArchitectureMap;
}
