export const relatedArticleSlugs = {
  'best-claw-clips-fine-thin-hair': [
    'claw-clip-size-guide',
    'flexible-vs-rigid-claw-clips',
    'do-claw-clips-damage-hair',
  ],
  'claw-clip-size-guide': [
    'best-claw-clips-fine-thin-hair',
    'claw-clips-thick-long-hair',
    'acetate-vs-plastic-claw-clips',
  ],
  'acetate-vs-plastic-claw-clips': [
    'flexible-vs-rigid-claw-clips',
    'claw-clip-size-guide',
    'custom-novelty-claw-clips-quality-guide',
  ],
  'silk-vs-satin-scrunchies': [
    'scrunchie-too-loose-too-tight',
    'how-to-wash-scrunchies',
    'hair-accessories-moq-guide',
  ],
  'metal-hair-clip-material-guide': [
    'claw-clip-size-guide',
  ],
};

export function selectRelatedArticles(articles, currentSlug, clusterSlugs = []) {
  const articleBySlug = new Map(articles.map(article => [article.slug, article]));
  const seen = new Set([currentSlug]);
  const related = [];

  // Keep the buyer's decision path first; use site order only to fill remaining places.
  const candidates = [
    ...clusterSlugs,
    ...(relatedArticleSlugs[currentSlug] || []),
    ...articles.map(article => article.slug),
  ];

  for (const slug of candidates) {
    const article = articleBySlug.get(slug);
    if (!article || seen.has(slug)) continue;
    seen.add(slug);
    related.push(article);
    if (related.length === 3) break;
  }

  return related;
}
