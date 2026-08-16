import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SEO from './components/SEO';
import Breadcrumb from './components/Breadcrumb';
import AnalyticsTracker from './components/AnalyticsTracker';
import ConsentBanner from './components/ConsentBanner';
import Home from './pages/Home';

const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const ProductCategory = lazy(() => import('./pages/ProductCategory'));
const Customization = lazy(() => import('./pages/Customization'));
const Sourcing = lazy(() => import('./pages/Sourcing'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Quality = lazy(() => import('./pages/Quality'));
const Cases = lazy(() => import('./pages/Cases'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

export function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-navy focus:text-white focus:px-4 focus:py-2 focus:text-sm"
      >
        Skip to main content
      </a>
      <header>
        <Navbar />
      </header>
      <SEO />
      <Breadcrumb />
      <AnalyticsTracker />
      <main id="main-content" className="flex-1">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/category/:category" element={<ProductCategory />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/customization" element={<Customization />} />
            <Route path="/sourcing" element={<Sourcing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/quality" element={<Quality />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <aside aria-label="WhatsApp support">
        <WhatsAppButton />
      </aside>
      <ConsentBanner />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
