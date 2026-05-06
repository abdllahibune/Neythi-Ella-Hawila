/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HennaGallery from './components/HennaGallery';
import BeautyServices from './components/BeautyServices';
import Products from './components/Products';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import { useSalonData } from './hooks/useSalonData';

function LandingPage() {
  const { services, products, gallery, loading } = useSalonData();

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
