import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found — WINCOME Hair Accessories';
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex');
  }, []);

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="container-site text-center max-w-xl">
        <p className="text-[10px] tracking-wider uppercase text-tan mb-4">Error 404</p>
        <h1 className="text-display-md text-navy mb-6">Page Not Found</h1>
        <p className="text-tan leading-relaxed mb-10">
          The page you are looking for does not exist or has been moved.
          Browse our <Link to="/products" className="text-gold underline">full product catalog</Link> or
          visit the <Link to="/" className="text-gold underline">homepage</Link> to continue.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/products" className="btn-primary">View Products</Link>
          <Link to="/contact" className="btn-outline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
