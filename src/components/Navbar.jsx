import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/customization', label: 'OEM / ODM' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/cases', label: 'Cases' },
  { to: '/quality', label: 'Quality' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Request Quote' },
];

function WincomeLogo({ scrolled }) {
  const boxFill   = scrolled ? '#1a2b3c' : 'rgba(255,255,255,0.12)';
  const boxStroke = scrolled ? 'none'    : 'rgba(255,255,255,0.5)';
  const wColor    = '#c5a059';
  const nameColor = scrolled ? '#1a2b3c' : '#ffffff';
  const subColor  = '#c5a059';

  return (
    <svg width="186" height="40" viewBox="0 0 186 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="WINCOME Hair Accessories">
      {/* Icon box */}
      <rect x="0.5" y="0.5" width="37" height="37" fill={boxFill} stroke={boxStroke} strokeWidth="0.75" />
      {/* W lettermark */}
      <text x="19" y="27" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="22" fontWeight="700" fill={wColor} letterSpacing="-0.5">W</text>
      {/* Thin vertical divider */}
      <line x1="46" y1="8" x2="46" y2="32" stroke={scrolled ? 'rgba(26,43,60,0.15)' : 'rgba(255,255,255,0.25)'} strokeWidth="0.75" />
      {/* Brand name */}
      <text x="54" y="21" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="13.5" fontWeight="700" fill={nameColor} letterSpacing="2.5">WINCOME</text>
      {/* Sub-label */}
      <text x="54" y="34" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="7.5" fontWeight="400" fill={subColor} letterSpacing="2">HAIR ACCESSORIES</text>
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const dark = scrolled || location.pathname !== '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      dark ? 'bg-cream/95 backdrop-blur-sm shadow-[0_1px_0_rgba(67,60,53,0.06)]' : 'bg-transparent'
    }`}>
      <div className="container-site flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center">
          <WincomeLogo scrolled={dark} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-wide transition-colors duration-200 ${
                link.to === '/contact'
                  ? 'bg-white text-navy px-6 py-2 hover:bg-white/90 hover:text-navy'
                  : dark
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
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block w-5 h-px bg-bronze transition-all ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
          <span className={`block w-5 h-px bg-bronze transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-bronze transition-all ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
        </button>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="md:hidden bg-cream border-t border-bronze/10">
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
