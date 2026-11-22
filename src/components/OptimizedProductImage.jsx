const responsiveImages = new Set([
  '/assets/images/product-bow-clip.webp',
  '/assets/images/product-claw-butterfly.webp',
  '/assets/images/product-clip-pearl.webp',
  '/assets/images/product-headband-braided.webp',
  '/assets/images/product-scrunchie-velvet.webp',
]);

export default function OptimizedProductImage({ image, alt, sizes, className, pictureClassName = '', eager = false }) {
  const imageProps = {
    src: image, alt, width: 1024, height: 1024, className,
    loading: eager ? undefined : 'lazy',
    fetchpriority: eager ? 'high' : undefined,
    decoding: eager ? undefined : 'async',
  };
  if (!responsiveImages.has(image)) return <img {...imageProps} />;

  const base = image.replace(/\.webp$/, '');
  const webpSet = `${base}-320.webp 320w, ${base}-640.webp 640w, ${image} 1024w`;
  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={`${base}-320.avif 320w, ${base}-640.avif 640w, ${base}.avif 1024w`} sizes={sizes} />
      <source type="image/webp" srcSet={webpSet} sizes={sizes} />
      <img {...imageProps} srcSet={webpSet} sizes={sizes} />
    </picture>
  );
}
