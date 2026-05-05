import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { Service, Product, GalleryImage, Category, OperationType } from '../types';

export function useSalonData() {
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
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

    return () => {
      unsubServices();
      unsubProducts();
      unsubGallery();
    };
  }, []);

  return { services, products, gallery, loading };
}
