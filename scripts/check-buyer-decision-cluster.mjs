import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles } from '../src/data/articles.js';
import {
  buyerDecisionClusters,
  HAIR_CLIP_BUYER_DECISION_CLUSTER,
} from '../src/data/buyerDecisionClusters.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(projectRoot, 'dist');
const cluster = buyerDecisionClusters[HAIR_CLIP_BUYER_DECISION_CLUSTER];
const articleBySlug = new Map(articles.map(article => [article.slug, article]));
const clusterSlugs = cluster.steps.map(step => step.slug);

function routeFile(slug) {
  return path.join(distRoot, 'blog', slug, 'index.html');
}

assert.equal(cluster.steps.length, 3, 'Hair-clip buyer decision path must contain exactly three focused pages');
assert.equal(new Set(clusterSlugs).size, clusterSlugs.length, 'Buyer decision path slugs must be unique');
assert.equal(new Set(cluster.steps.map(step => step.number)).size, cluster.steps.length, 'Buyer decision path step numbers must be unique');

for (const step of cluster.steps) {
  const article = articleBySlug.get(step.slug);
  assert.ok(article, `Missing buyer decision article: ${step.slug}`);
  assert.equal(article.decisionCluster, cluster.id, `Cluster assignment mismatch: ${step.slug}`);
  assert.ok(article.updatedDate >= '2026-09-08', `Buyer decision article needs a current update date: ${step.slug}`);
  assert.equal(article.sections[0]?.t, 'p', `Buyer decision article must lead with a direct-answer paragraph: ${step.slug}`);
  assert.ok(article.sections.some(section => section.t === 'table'), `Buyer decision article needs a decision table: ${step.slug}`);
  assert.ok(article.sections.some(section => section.t === 'faq'), `Buyer decision article needs visible FAQs: ${step.slug}`);
  assert.ok(article.reviewedBy, `Buyer decision article needs a named reviewer: ${step.slug}`);
  assert.ok(article.evidenceNote, `Buyer decision article needs an evidence boundary: ${step.slug}`);
  assert.ok(
    article.sources.some(source => !new URL(source.url).hostname.endsWith('reddit.com')),
    `Buyer decision article needs at least one non-community source: ${step.slug}`,
  );

  const html = await fs.readFile(routeFile(step.slug), 'utf8');
  assert.match(html, /Buyer Decision Cluster/i, `Decision path label missing from rendered page: ${step.slug}`);
  assert.match(html, /Hair Clip Buyer Decision Path/i, `Decision path heading missing from rendered page: ${step.slug}`);
  assert.match(html, /Research Sources/i, `Research sources missing from rendered page: ${step.slug}`);
  assert.match(html, /"@type":"Article"/, `Article structured data missing: ${step.slug}`);
  assert.match(html, /"@type":"FAQPage"/, `FAQ structured data missing: ${step.slug}`);
  assert.ok(html.includes(`href="${cluster.hub.route}"`), `Commercial hub link missing: ${step.slug}`);

  for (const supportLink of cluster.supportLinks) {
    assert.ok(html.includes(`href="${supportLink.route}"`), `Support link ${supportLink.route} missing: ${step.slug}`);
  }

  for (const siblingSlug of clusterSlugs.filter(slug => slug !== step.slug)) {
    assert.ok(html.includes(`href="/blog/${siblingSlug}"`), `Sibling link ${siblingSlug} missing: ${step.slug}`);
  }
}

console.log(`[buyer-decision-cluster] ${cluster.steps.length} evidence-backed pages and their decision-path links verified`);
