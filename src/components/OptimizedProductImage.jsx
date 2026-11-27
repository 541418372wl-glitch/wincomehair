import imageManifest from '../generated/imageManifest.json';
import { productImageSizes } from '../lib/responsivePhotos';

export default function OptimizedProductImage({
  image, alt, sizes = productImageSizes, className, pictureClassName, width, height, eager = false, priority = eager,
}) {
  const entry = imageManifest[image];
  const photo = (
    <img src={image} alt={alt} className={className}
      width={entry?.width || width || 1024} height={entry?.height || height || 1024}
      loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : 'async'} srcSet={entry?.webpSrcSet} sizes={entry ? sizes : undefined} />
  );
  if (!entry) return photo;
  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={entry.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={entry.webpSrcSet} sizes={sizes} />
      {photo}
    </picture>
  );
}
