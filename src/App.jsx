import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import SEO from './components/SEO';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Customization from './pages/Customization';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Quality from './pages/Quality';
import Cases from './pages/Cases';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <SEO />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/customization" element={<Customization />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/quality" element={<Quality />} />
            <Route path="/cases" element={<Cases />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
}
