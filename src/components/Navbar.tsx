import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'الرئيسية', href: '#' },
    { name: 'فن الحناء', href: '#henna' },
    { name: 'العناية', href: '#beauty' },
    { name: 'المنتجات', href: '#products' },
    { name: 'الأسعار', href: '#pricing' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <a href="#" className="serif text-2xl text-gold font-bold">
          نيثي الا حويلة
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-gray-600 hover:text-gold transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gold"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gold/10 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg text-gray-700 hover:text-gold"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
