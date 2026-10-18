import assert from 'node:assert/strict';
import { articles } from '../src/data/articles.js';
import { buyerDecisionClusters, HAIR_CLIP_BUYER_DECISION_CLUSTER } from '../src/data/buyerDecisionClusters.js';
import { relatedArticleSlugs, selectRelatedArticles } from '../src/data/relatedArticles.js';

const slugs = results => results.map(article => article.slug);
const existing = new Set(articles.map(article => article.slug));

for (const [currentSlug, recommendations] of Object.entries(relatedArticleSlugs)) {
  assert.ok(existing.has(currentSlug), `Unknown source article: ${currentSlug}`);
  assert.equal(new Set(recommendations).size, recommendations.length, `Duplicate recommendations: ${currentSlug}`);
  for (const slug of recommendations) {
    assert.ok(existing.has(slug), `Broken recommendation from ${currentSlug}: ${slug}`);
    assert.notEqual(slug, currentSlug, `Self recommendation: ${currentSlug}`);
  }
}

const cluster = buyerDecisionClusters[HAIR_CLIP_BUYER_DECISION_CLUSTER];
const clusterSlugs = cluster.steps.map(step => step.slug);
assert.deepEqual(slugs(selectRelatedArticles(articles, 'metal-hair-clip-material-guide', clusterSlugs)), [
  'best-barrettes-fine-thin-hair',
  'hair-accessories-moq-guide',
  'claw-clip-size-guide',
], 'The existing buyer decision path must precede the material guide recommendation');

assert.deepEqual(slugs(selectRelatedArticles(articles, 'best-claw-clips-fine-thin-hair')), [
  'claw-clip-size-guide',
  'flexible-vs-rigid-claw-clips',
  'do-claw-clips-damage-hair',
], 'Fine-hair readers should receive clip-specific guidance');

const partialArticles = [
  { slug: 'silk-vs-satin-scrunchies' },
  { slug: 'fallback' },
  { slug: 'scrunchie-too-loose-too-tight' },
  { slug: 'how-to-wash-scrunchies' },
  { slug: 'last' },
];
assert.deepEqual(slugs(selectRelatedArticles(partialArticles, 'silk-vs-satin-scrunchies', [
  'silk-vs-satin-scrunchies', 'missing', 'scrunchie-too-loose-too-tight', 'scrunchie-too-loose-too-tight',
])), ['scrunchie-too-loose-too-tight', 'how-to-wash-scrunchies', 'fallback'],
'Missing references, self links and duplicates must not consume recommendation slots');

assert.deepEqual(slugs(selectRelatedArticles(partialArticles, 'last')), [
  'silk-vs-satin-scrunchies', 'fallback', 'scrunchie-too-loose-too-tight',
], 'Unmapped articles retain the existing site-order fallback');
assert.deepEqual(selectRelatedArticles([{ slug: 'only' }], 'only'), [], 'Do not repeat an article to fill the grid');

console.log('[related-articles] Topic relevance, cluster priority, fallback and missing-reference handling verified');
