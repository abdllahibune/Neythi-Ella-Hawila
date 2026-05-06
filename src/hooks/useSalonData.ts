import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { Service, Product, GalleryImage, Category, Promotion, AppSettings, OperationType } from '../types';

export function useSalonData() {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [stats, setStats] = useState({ visits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubServices = onSnapshot(
      query(collection(db, 'services'), orderBy('order', 'asc')),
      (snapshot) => {
        setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
        setLoading(false);
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'services')
    );

    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'products')
    );

    const unsubGallery = onSnapshot(
      query(collection(db, 'gallery'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setGallery(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage)));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'gallery')
    );

    const unsubPromos = onSnapshot(
      collection(db, 'promotions'),
      (snapshot) => {
        setPromotions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Promotion)));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'promotions')
    );

    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'hero'),
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings(snapshot.data() as AppSettings);
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'settings/hero')
    );

    const unsubStats = onSnapshot(
      doc(db, 'stats', 'visits'),
      (snapshot) => {
        if (snapshot.exists()) {
          setStats({ visits: snapshot.data().count || 0 });
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'stats/visits')
    );

    return () => {
      unsubServices();
      unsubProducts();
      unsubGallery();
      unsubPromos();
      unsubSettings();
      unsubStats();
    };
  }, []);

  return { services, products, gallery, promotions, settings, stats, loading };
}
