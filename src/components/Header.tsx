import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { FaBars, FaTimes, FaUser, FaChevronDown } from 'react-icons/fa';
import { products, productHref, isExternal } from '@/data/products';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const onHome = router.pathname === '/';

  // Close the products dropdown on outside click or Escape.
  useEffect(() => {
    if (!isProductsOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsProductsOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isProductsOpen]);

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsProductsOpen(false);
  };

  // The in-page sections only exist on the home page. From anywhere else,
  // fall back to a real navigation to /#section rather than silently doing
  // nothing, which is what the previous scroll-only version did.
  const goToSection = (id: string) => {
    closeAll();

    if (!onHome) {
      router.push(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 60;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full bg-black text-white shadow-md fixed top-0 left-0 z-50 h-12">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div>
          <Link href="/" className="flex items-center" onClick={closeAll}>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CityLyfe
            </span>
            <span className="ml-2 text-sm text-gray-300">LLC</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {/* Products dropdown. Renders from src/data/products.ts, so a fourth
              or fifth product extends the list rather than crowding the bar. */}
          <div className="relative" ref={productsRef}>
            <button
              onClick={() => setIsProductsOpen(!isProductsOpen)}
              className="flex items-center gap-1.5 hover:text-blue-400 transition"
              aria-expanded={isProductsOpen}
              aria-haspopup="true"
            >
              Products
              <FaChevronDown
                size={10}
                className={`transition-transform ${isProductsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isProductsOpen && (
              <div className="absolute left-0 top-8 bg-black border border-gray-800 rounded-lg shadow-xl py-2 w-72 max-h-[70vh] overflow-y-auto">
                {products.map((product) => {
                  const href = productHref(product);
                  const external = isExternal(product);
                  const className =
                    'block px-4 py-2.5 hover:bg-gray-900 transition';
                  const body = (
                    <>
                      <span className="block font-semibold">{product.name}</span>
                      <span className="block text-xs text-gray-400 mt-0.5">
                        {product.tagline}
                      </span>
                    </>
                  );

                  return external ? (
                    <a
                      key={product.id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                      onClick={closeAll}
                    >
                      {body}
                    </a>
                  ) : (
                    <Link
                      key={product.id}
                      href={href}
                      className={className}
                      onClick={closeAll}
                    >
                      {body}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <button onClick={() => goToSection('about')} className="hover:text-blue-400 transition">About</button>
          <button onClick={() => goToSection('services')} className="hover:text-blue-400 transition">Services</button>
          <button onClick={() => goToSection('projects')} className="hover:text-blue-400 transition">Client Work</button>
          <Link href="/login" className="flex items-center space-x-1 hover:text-blue-400 transition" onClick={closeAll}>
            <FaUser size={14} />
            <span>Portal</span>
          </Link>
          <button onClick={() => goToSection('contact')} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition">Get Quote</button>
        </nav>

        <div className="md:hidden relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none" aria-label="Toggle menu">
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          {isMenuOpen && (
            <div className="absolute top-10 right-0 bg-black text-white py-3 px-4 rounded shadow-lg z-50 space-y-2 text-sm min-w-56 max-h-[80vh] overflow-y-auto">
              <p className="text-xs uppercase tracking-wide text-gray-500">Products</p>
              {products.map((product) => {
                const href = productHref(product);
                return isExternal(product) ? (
                  <a
                    key={product.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block pl-2 hover:text-blue-400"
                    onClick={closeAll}
                  >
                    {product.name}
                  </a>
                ) : (
                  <Link key={product.id} href={href} className="block pl-2 hover:text-blue-400" onClick={closeAll}>
                    {product.name}
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-gray-800 space-y-2">
                <button onClick={() => goToSection('about')} className="block w-full text-left hover:text-blue-400">About</button>
                <button onClick={() => goToSection('services')} className="block w-full text-left hover:text-blue-400">Services</button>
                <button onClick={() => goToSection('projects')} className="block w-full text-left hover:text-blue-400">Client Work</button>
                <Link href="/login" className="w-full text-left hover:text-blue-400 flex items-center space-x-2" onClick={closeAll}>
                  <FaUser size={12} />
                  <span>Portal</span>
                </Link>
                <button onClick={() => goToSection('contact')} className="block w-full text-left hover:text-blue-400">Contact</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
