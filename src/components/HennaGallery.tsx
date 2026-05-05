import { motion } from 'motion/react';
import { GalleryImage } from '../types';

interface GalleryProps {
  images: GalleryImage[];
}

export default function HennaGallery({ images }: GalleryProps) {
  // If no images, show some placeholders
  const displayImages = images.length > 0 ? images : Array(6).fill({
    id: 'placeholder',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bf38f8f4d0?auto=format&fit=crop&q=80&w=800'
  });

  return (
    <section id="henna" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="serif text-4xl md:text-5xl text-gold mb-4">فن الحناء</h2>
          <div className="w-24 h-1 bg-dusty-rose mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-lg mx-auto">
            نتميز بتقديم أحدث تصاميم الحناء الموريتانية والسودانية، بدقة متناهية وإتقان.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {displayImages.map((image, idx) => (
            <motion.div 
              key={image.id + idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="aspect-square relative group overflow-hidden rounded-2xl shadow-md"
            >
              <img 
                src={image.imageUrl} 
                alt="Henna Design"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="p-4 bg-white/90 rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <span className="text-gold font-medium">عرض التفاصيل</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
