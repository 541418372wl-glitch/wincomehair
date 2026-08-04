import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/customization', label: 'OEM / ODM' },
  { to: '/about', label: 'About' },
  { to: '/cases', label: 'Cases' },
  { to: '/quality', label: 'Quality' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Request Quote' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-[0_1px_0_rgba(67,60,53,0.06)]' : 'bg-transparent'
    }`}>
      <div className="container-site flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/images/logo.webp" alt="WINCOME Hair Accessories" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-wide transition-colors duration-200 ${
                link.to === '/contact'
                  ? 'bg-white text-navy px-6 py-2 hover:bg-white/90 hover:text-navy'
                  : scrolled
                    ? (location.pathname === link.to ? 'text-navy font-medium' : 'text-tan hover:text-navy')
                    : (location.pathname === link.to ? 'text-gold font-medium' : 'text-white/70 hover:text-white')
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-bronze transition-all ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
          <span className={`block w-5 h-px bg-bronze transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-bronze transition-all ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-bronze/10">
          <div className="container-site py-6 flex flex-col gap-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm tracking-wide py-2 ${
                  link.to === '/contact'
                    ? 'bg-navy text-white px-6 py-3 text-center'
                    : location.pathname === link.to ? 'text-navy font-medium' : 'text-tan'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
