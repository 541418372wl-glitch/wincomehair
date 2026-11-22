const largePhotos = {
  '/assets/images/selected-ruched-fabric-headband.webp': 1500,
  '/assets/images/selected-textured-bow-barrette-reverse.webp': 1920,
};

// Lazy-loaded cards can use their actual layout width in supporting browsers.
const cardSizes = 'auto, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw';

export function responsivePhotoProps(src, sizes = cardSizes) {
  const originalWidth = largePhotos[src];
  if (!originalWidth) return {};

  const base = src.slice(0, -'.webp'.length);
  const candidates = [480, 800, 1200].map(width => `${base}-${width}.webp ${width}w`);
  candidates.push(`${src} ${originalWidth}w`);
  return { srcSet: candidates.join(', '), sizes };
}
