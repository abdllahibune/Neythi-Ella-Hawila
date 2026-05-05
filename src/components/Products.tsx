import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { Product } from '../types';

interface ProductsProps {
  products: Product[];
}

export default function Products({ products }: ProductsProps) {
  const displayProducts = products.length > 0 ? products : [
    { id: '1', name: 'زيوت طبيعية', imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9caab53?auto=format&fit=crop&q=80&w=800' },
    { id: '2', name: 'أصباغ عالمية', imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bf38f8f4d0?auto=format&fit=crop&q=80&w=800' },
    { id: '3', name: 'كريمات نضارة', imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800' }
  ];

  return (
    <section id="products" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="serif text-4xl md:text-5xl text-gold mb-4">الجودة والمنتجات</h2>
          <div className="w-24 h-1 bg-dusty-rose mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            سر تميزنا هو جودة ما نستخدمه. نوفر لك أفضل المنتجات العالمية المختارة بعناية لضمان سلامتك وجمالك.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product, idx) => (
            <motion.div 
              key={product.id + idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-nude/30 rounded-3xl p-6 text-center group"
            >
              <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="serif text-2xl text-gray-800 mb-2">{product.name}</h3>
              <div className="flex items-center justify-center gap-2 text-gold">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">منتج أصلي 100%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
