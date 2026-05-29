#!/usr/bin/env node
// =============================================================================
// scripts/generate-resume-md.mjs
//
// Renders RESUME.md from data/resume.yaml.
//
// Usage:
//   npm run resume:md
//
// data/resume.yaml is the single source of truth. After editing the YAML,
// run this script to regenerate the markdown. Both files are committed.
// =============================================================================

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const yamlPath = resolve(root, 'data', 'resume.yaml');
const mdPath = resolve(root, 'RESUME.md');

const data = parse(readFileSync(yamlPath, 'utf8'));

const lines = [];
const emit = (s = '') => lines.push(s);

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
const linkHost = (url) => url.replace(/^https?:\/\//, '');
emit(`# ${data.profile.name}`);
emit('');
emit(`**${data.profile.title} | Software Engineer | Distributed Systems**`);
emit('');
emit(`${data.profile.location} | ${data.profile.email} | ${data.profile.phone}`);
emit(
  `[${linkHost(data.profile.links.linkedin)}](${data.profile.links.linkedin}) | ` +
    `[${linkHost(data.profile.links.github)}](${data.profile.links.github})`,
);
emit('');

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
emit('## Summary');
emit('');
emit(data.profile.summary.trim());
emit('');

// ---------------------------------------------------------------------------
// Technical Skills
// ---------------------------------------------------------------------------
emit('## Technical Skills');
emit('');
for (const group of data.skills) {
  emit(`- **${group.category}:** ${group.items.join(', ')}`);
}
emit('');

// ---------------------------------------------------------------------------
// Professional Experience
// ---------------------------------------------------------------------------
emit('## Professional Experience');
emit('');

for (const role of data.experience) {
  emit(`### ${role.title} — ${role.company}, ${role.location}`);
  emit(`*${role.start} – ${role.end}*`);
  emit('');

  for (const ach of role.achievements) {
    const detail = ach.detail.trim().replace(/\s+/g, ' ');
    const metrics = ach.metrics?.length
      ? ` _(${ach.metrics.join(' · ')})_`
      : '';
    emit(`- **${ach.headline}.** ${detail}${metrics}`);
  }
  emit('');
}

// ---------------------------------------------------------------------------
// Key Projects
// ---------------------------------------------------------------------------
emit('## Key Projects');
emit('');

for (const project of data.projects) {
  emit(`### ${project.name}`);
  emit(`*${project.stack.join(', ')}*`);
  emit('');
  for (const bullet of project.bullets) {
    emit(`- ${bullet}`);
  }
  emit('');
}

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------
emit('## Education');
emit('');
emit(`### ${data.education.school} — ${data.education.degree}`);
emit(`*${data.education.year}*`);
emit('');
for (const note of data.education.notes) {
  emit(`- ${note}`);
}
emit('');

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------
const out = lines.join('\n');
writeFileSync(mdPath, out, 'utf8');

const wordCount = out.split(/\s+/).filter(Boolean).length;
console.log(`✓ wrote ${mdPath}`);
console.log(`  ${lines.length} lines · ${wordCount} words · ${data.experience.length} roles · ${data.projects.length} projects`);
