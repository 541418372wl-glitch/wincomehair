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
  'how-to-wash-scrunchies': [
    'scrunchie-too-loose-too-tight',
    'silk-vs-satin-scrunchies',
    'hair-accessories-moq-guide',
  ],
  'scrunchie-too-loose-too-tight': [
    'how-to-wash-scrunchies',
    'silk-vs-satin-scrunchies',
    'hair-accessories-moq-guide',
  ],
  'custom-novelty-claw-clips-quality-guide': [
    'flexible-vs-rigid-claw-clips',
    'acetate-vs-plastic-claw-clips',
    'private-label-hair-accessories-guide',
  ],
  'flexible-vs-rigid-claw-clips': [
    'acetate-vs-plastic-claw-clips',
    'claw-clip-size-guide',
    'custom-novelty-claw-clips-quality-guide',
  ],
  'flat-claw-clips-driving-headrest': [
    'do-claw-clips-damage-hair',
    'claw-clip-size-guide',
    'best-claw-clips-fine-thin-hair',
  ],
  'best-barrettes-fine-thin-hair': [
    'private-label-hair-accessories-guide',
  ],
  'hair-bows-for-adults-style-guide': [
    'private-label-hair-accessories-guide',
    'hair-accessories-moq-guide',
    'how-to-source-hair-accessories-from-china',
  ],
  'claw-clips-thick-long-hair': [
    'claw-clip-size-guide',
    'acetate-vs-plastic-claw-clips',
    'flexible-vs-rigid-claw-clips',
  ],
  'why-headbands-hurt-or-slip': [
    'velvet-vs-cotton-headbands',
    'private-label-hair-accessories-guide',
    'how-to-source-hair-accessories-from-china',
  ],
  'how-to-source-hair-accessories-from-china': [
    'hair-accessories-moq-guide',
    'private-label-hair-accessories-guide',
    'custom-novelty-claw-clips-quality-guide',
  ],
  'do-claw-clips-damage-hair': [
    'claw-clip-size-guide',
    'flat-claw-clips-driving-headrest',
    'best-claw-clips-fine-thin-hair',
  ],
  'private-label-hair-accessories-guide': [
    'how-to-source-hair-accessories-from-china',
    'hair-accessories-moq-guide',
    'custom-novelty-claw-clips-quality-guide',
  ],
  'velvet-vs-cotton-headbands': [
    'why-headbands-hurt-or-slip',
    'private-label-hair-accessories-guide',
    'silk-vs-satin-scrunchies',
  ],
  'hair-accessories-moq-guide': [
    'how-to-source-hair-accessories-from-china',
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
