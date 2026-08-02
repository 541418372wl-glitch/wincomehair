import { Link } from 'react-router-dom';

const footerLinks = {
  Products: [
    { to: '/products', label: 'Hair Claws & Clips' },
    { to: '/products', label: 'Headbands' },
    { to: '/products', label: 'Scrunchies & Hair Ties' },
    { to: '/products', label: 'Hair Bows & Ribbons' },
    { to: '/products', label: 'Hair Pins & Barrettes' },
  ],
  Services: [
    { to: '/customization', label: 'OEM / ODM' },
    { to: '/customization', label: 'Custom Logo' },
    { to: '/customization', label: 'Private Label' },
    { to: '/customization', label: 'Packaging Design' },
  ],
  Company: [
    { to: '/about', label: 'About Us' },
    { to: '/about', label: 'Our Factory' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="container-site py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-col leading-none mb-6">
              <span className="text-base font-medium tracking-[0.15em] uppercase text-white">WINCOME</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/50">Hair Accessories</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Custom hair accessories manufacturer for global brands. OEM/ODM, low MOQ, worldwide shipping.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-white/60 mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-white/50 hover:text-gold transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider !bg-white/10 my-12" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} WINCOME Hair Accessories. All rights reserved.</p>
          <div className="flex gap-6">
            <span>wincomehair.com</span>
            <span>info@wincomehair.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
