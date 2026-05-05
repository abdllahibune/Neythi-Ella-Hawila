/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HennaGallery from './components/HennaGallery';
import BeautyServices from './components/BeautyServices';
import Products from './components/Products';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { useSalonData } from './hooks/useSalonData';
import { Settings } from 'lucide-react';

export default function App() {
  const { services, products, gallery, loading } = useSalonData();
  const [showAdmin, setShowAdmin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-nude flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nude" dir="rtl">
      <Navbar />
      
      <main>
        <Hero />
        <HennaGallery images={gallery} />
        <BeautyServices services={services} />
        <Products products={products} />
        <Pricing services={services} />
      </main>

      <Footer />

      {/* Subtle Admin Toggle */}
      <button 
        onClick={() => setShowAdmin(!showAdmin)}
        className="fixed bottom-6 right-6 z-[60] bg-white/20 hover:bg-gold/20 p-2 rounded-full backdrop-blur-sm transition-all"
        title="Admin Panel"
      >
        <Settings className="w-5 h-5 text-gold/30 hover:text-gold transition-colors" />
      </button>

      {/* Admin Panel Overlay */}
      {showAdmin && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md overflow-y-auto pt-10 px-4 pb-20">
          <div className="relative max-w-6xl mx-auto">
            <button 
              onClick={() => setShowAdmin(false)}
              className="absolute -top-4 left-4 z-[110] bg-white text-gray-800 p-2 rounded-full shadow-xl hover:scale-110 transition-transform"
            >
              <Settings className="w-6 h-6" />
            </button>
            <AdminPanel 
              services={services} 
              products={products} 
              gallery={gallery} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
