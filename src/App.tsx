/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HennaGallery from './components/HennaGallery';
import BeautyServices from './components/BeautyServices';
import Products from './components/Products';
import Pricing from './components/Pricing';
import Promotions from './components/Promotions';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import { useSalonData } from './hooks/useSalonData';

function LandingPage() {
  const { services, products, gallery, promotions, settings, loading } = useSalonData();

  useEffect(() => {
    // Increment visit counter
    const incrementVisits = async () => {
      const visitRef = doc(db, 'stats', 'visits');
      try {
        const snap = await getDoc(visitRef);
        if (!snap.exists()) {
          await setDoc(visitRef, { count: 1 });
        } else {
          await updateDoc(visitRef, { count: increment(1) });
        }
      } catch (e) {
        console.error('Failed to increment visits', e);
      }
    };
    
    // Only increment once per session in a real app, but here we do it on load
    incrementVisits();
  }, []);

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
        <Hero imageUrl={settings?.heroImageUrl} />
        <Promotions promotions={promotions} />
        <HennaGallery images={gallery} />
        <BeautyServices services={services} />
        <Products products={products} />
        <Pricing services={services} />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
