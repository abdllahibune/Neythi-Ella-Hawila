import { motion } from 'motion/react';
import { MessageCircle, Tag } from 'lucide-react';
import { Service } from '../types';

const PHONE_NUMBER = '22247070086';

interface PricingProps {
  services: Service[];
}

export default function Pricing({ services }: PricingProps) {
  // Fallback data if empty
  const displayServices = services.length > 0 ? services : [
    { id: '1', name: 'حناء عروس - ملكي', price: 5000, discountPrice: 4500, category: 'henna' },
    { id: '2', name: 'حناء بسيط - يدين', price: 1500, category: 'henna' },
    { id: '3', name: 'تجميل وجه كامل', price: 2000, discountPrice: 1800, category: 'beauty' },
    { id: '4', name: 'إزالة شعر (حلاوة) كاملة', price: 3000, category: 'hair_removal' }
  ];

  const getWhatsappUrl = (serviceName: string) => {
    return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(`مرحباً نيثي الا حويلة، أريد حجز خدمة ${serviceName}`)}`;
  };

  return (
    <section id="pricing" className="py-20 px-4 bg-nude">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="serif text-4xl md:text-5xl text-gold mb-4">الأسعار والعروض</h2>
          <div className="w-24 h-1 bg-dusty-rose mx-auto"></div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gold/10">
          <div className="bg-gold p-8 text-white text-center">
            <h3 className="serif text-2xl font-medium">قائمة الخدمات</h3>
            <p className="opacity-80 text-sm mt-1">الأسعار معلنة بالعملة الموريتانية (MRU)</p>
          </div>
          
          <div className="p-6 md:p-10 divide-y divide-gray-100">
            {displayServices.map((service, idx) => (
              <motion.div 
                key={service.id + idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-medium text-gray-800">{service.name}</h4>
                    {service.discountPrice && (
                      <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        عرض خاص
                      </span>
                    )}
                  </div>
                  {service.category && (
                    <p className="text-gray-400 text-sm mt-1">
                      {service.category === 'henna' ? 'نقوش الحناء' : 'تجميل وعناية'}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-left font-mono">
                    {service.discountPrice ? (
                      <div className="flex flex-col">
                        <span className="text-gray-400 line-through text-sm">{service.price} MRU</span>
                        <span className="text-gold font-bold text-xl">{service.discountPrice} MRU</span>
                      </div>
                    ) : (
                      <span className="text-gold font-bold text-xl">{service.price} MRU</span>
                    )}
                  </div>
                  
                  <a 
                    href={getWhatsappUrl(service.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gold/10 text-gold hover:bg-gold hover:text-white p-3 rounded-full transition-all group"
                  >
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <Tag className="w-4 h-4" />
              <span>الأسعار قابلة للتغيير حسب كثافة النقش أو نوع الخدمة</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
