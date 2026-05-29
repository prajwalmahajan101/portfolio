// =============================================================================
// resume.ts — thin re-export of the YAML source of truth.
//
// The actual content lives in `data/resume.yaml` (single source of truth).
// `RESUME.md` is regenerated from the YAML via `npm run resume:md`.
// Types live in `./resume.types.ts`.
// =============================================================================

import rawData from '../../data/resume.yaml';
import type { ResumeData } from './resume.types';

const data = rawData as ResumeData;

export const profile = data.profile;
export const stats = data.stats;
export const about = data.about;
export const skills = data.skills;
export const experience = data.experience;
export const projects = data.projects;
export const education = data.education;
export const architectureMap = data.architectureMap;

export type {
  NodeKind,
  EdgeKind,
  ArchNode,
  ArchEdge,
  Architecture,
  Achievement,
  Role,
  Project,
  Stat,
  SkillGroup,
  Profile,
  Education,
  About,
  PlatformNode,
  PlatformEdge,
  ArchitectureMap,
  ResumeData,
} from './resume.types';
