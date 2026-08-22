import { articles } from '../src/data/articles.js';

const errors = [];

for (const article of articles) {
  const label = article.slug || article.title || 'unknown article';
  const sources = Array.isArray(article.sources) ? article.sources : [];

  if (sources.length < 2) {
    errors.push(`${label}: expected at least 2 research sources, found ${sources.length}`);
  }

  const seenUrls = new Set();
  for (const [index, source] of sources.entries()) {
    if (!source?.label?.trim()) {
      errors.push(`${label}: source ${index + 1} is missing a label`);
    }

    try {
      const url = new URL(source?.url);
      if (url.protocol !== 'https:') {
        errors.push(`${label}: source ${index + 1} must use HTTPS`);
      }
      if (seenUrls.has(url.href)) {
        errors.push(`${label}: duplicate source URL ${url.href}`);
      }
      seenUrls.add(url.href);
    } catch {
      errors.push(`${label}: source ${index + 1} has an invalid URL`);
    }
  }

  if (article.updatedDate && !/^\d{4}-\d{2}-\d{2}$/.test(article.updatedDate)) {
    errors.push(`${label}: updatedDate must use YYYY-MM-DD`);
  }
}

if (errors.length) {
  console.error('Article trust checks failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Article trust checks passed for ${articles.length} articles.`);
