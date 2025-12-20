import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 60;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full bg-black text-white shadow-md fixed top-0 left-0 z-50 h-12">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <div>
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CityLyfe
            </span>
            <span className="ml-2 text-sm text-gray-300">LLC</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <button onClick={() => scrollTo('about')} className="hover:text-blue-400 transition">About</button>
          <button onClick={() => scrollTo('services')} className="hover:text-blue-400 transition">Services</button>
          <button onClick={() => scrollTo('projects')} className="hover:text-blue-400 transition">Projects</button>
          <Link href="/login" className="flex items-center space-x-1 hover:text-blue-400 transition">
            <FaUser size={14} />
            <span>Portal</span>
          </Link>
          <button onClick={() => scrollTo('contact')} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition">Get Quote</button>
        </nav>

        <div className="md:hidden relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          {isMenuOpen && (
            <div className="absolute top-10 right-0 bg-black text-white py-2 px-4 rounded shadow-lg z-50 space-y-2 text-sm min-w-48">
              <button onClick={() => scrollTo('about')} className="block w-full text-left hover:text-blue-400">About</button>
              <button onClick={() => scrollTo('services')} className="block w-full text-left hover:text-blue-400">Services</button>
              <button onClick={() => scrollTo('projects')} className="block w-full text-left hover:text-blue-400">Projects</button>
              <Link href="/login" className="block w-full text-left hover:text-blue-400 flex items-center space-x-2">
                <FaUser size={12} />
                <span>Portal</span>
              </Link>
              <button onClick={() => scrollTo('contact')} className="block w-full text-left hover:text-blue-400">Contact</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}