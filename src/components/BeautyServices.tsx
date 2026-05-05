import { motion } from 'motion/react';
import { MessageCircle, Sparkles, Scissors, Heart } from 'lucide-react';
import { Service, Category } from '../types';

const PHONE_NUMBER = '22247070086';

interface ServicesProps {
  services: Service[];
}

export default function BeautyServices({ services }: ServicesProps) {
  const beautyServices = services.filter(s => s.category !== Category.HENNA);
  
  // Default fallback if empty
  const displayServices = beautyServices.length > 0 ? beautyServices : [
    { id: '1', name: 'تجميل الوجه', description: 'تنظيف عميق وترطيب للبشرة', price: 1500, category: Category.BEAUTY, imageUrl: 'https://images.unsplash.com/photo-1570172619241-7b186a13d336?auto=format&fit=crop&q=80&w=800' },
    { id: '2', name: 'إزالة الشعر (حلاوة)', description: 'إزالة شعر الجسم بطريقة طبيعية وآمنة', price: 1000, category: Category.HAIR_REMOVAL, imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?auto=format&fit=crop&q=80&w=800' }
  ];

  const getWhatsappUrl = (serviceName: string) => {
    return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(`مرحباً نيثي الا حويلة، أريد حجز خدمة ${serviceName}`)}`;
  };

  return (
    <section id="beauty" className="py-20 px-4 bg-nude">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="serif text-4xl md:text-5xl text-gold mb-4">العناية والتجميل</h2>
          <div className="w-24 h-1 bg-dusty-rose mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {displayServices.map((service, idx) => (
              <div 
                key={service.id}
                className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow border border-gold/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-nude rounded-full flex items-center justify-center text-gold">
                    {idx === 0 ? <Sparkles /> : idx === 1 ? <Scissors /> : <Heart />}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                </div>
                <a 
                  href={getWhatsappUrl(service.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold text-white p-3 rounded-full hover:bg-gold-light transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200" 
                alt="Spa Treatment"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl max-w-[200px]">
              <p className="text-gold font-bold text-lg mb-1">نتائج فورية</p>
              <p className="text-gray-500 text-sm">نستخدم أفضل المنتجات الطبيعية والعالمية</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
