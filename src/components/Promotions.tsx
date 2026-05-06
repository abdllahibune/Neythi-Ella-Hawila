import { motion } from 'motion/react';
import { Promotion } from '../types';
import { Percent, Clock } from 'lucide-react';

interface PromotionsProps {
  promotions: Promotion[];
}

export default function Promotions({ promotions }: PromotionsProps) {
  if (promotions.length === 0) return null;

  // Filter out truly expired promotions if needed, but here we just show what's in DB
  // In a real app we might compare with new Date().toISOString()

  return (
    <section id="promotions" className="py-24 bg-gold/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full mb-4"
          >
            <Percent className="w-4 h-4" />
            <span className="text-sm font-bold tracking-widest uppercase">عروض حصرية</span>
          </motion.div>
          <h2 className="serif text-5xl text-gray-800">أحدث العروض والخصومات</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[3rem] border border-gold/10 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-6xl font-bold text-gold mb-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  {promo.discount}
                </div>
                <h3 className="serif text-2xl text-gray-800 mb-3">{promo.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{promo.description}</p>
                
                {promo.expiryDate && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-50 w-fit px-3 py-1 rounded-full text-xs font-bold">
                    <Clock className="w-3 h-3" />
                    <span>ينتهي في: {promo.expiryDate}</span>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <button className="w-full bg-gold text-white py-3 rounded-2xl font-bold hover:bg-gold-light transition-colors">
                  احصلي على العرض
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
