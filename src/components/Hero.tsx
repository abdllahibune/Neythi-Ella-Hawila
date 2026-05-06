import { motion } from 'motion/react';
import { Phone, MessageCircle } from 'lucide-react';

const PHONE_NUMBER = '22247070086';

interface HeroProps {
  imageUrl?: string;
}

export default function Hero({ imageUrl }: HeroProps) {
  const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent('مرحباً نيثي الا حويلة، أريد حجز موعد...')}`;
  const defaultImage = "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1920";

  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={imageUrl || defaultImage} 
          alt="Salon Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-nude via-transparent to-black/20"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 tracking-tight drop-shadow-2xl"
        >
          نيثي الا حويلة
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg"
        >
          نقدم لك أجمل تصاميم الحناء وفنون التجميل بأيدي خبيرة، لتتألقي في كل مناسباتك.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gold hover:bg-gold-light text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg group"
          >
            <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="font-medium">احجزي موعدك الآن</span>
          </a>
          <a 
            href={`tel:${PHONE_NUMBER}`}
            className="bg-white border-2 border-gold text-gold hover:bg-gold hover:text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md"
          >
            <Phone className="w-5 h-5" />
            <span className="font-medium">اتصال سريع</span>
          </a>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold opacity-50"
      >
        <div className="w-px h-12 bg-gold mx-auto"></div>
      </motion.div>
    </section>
  );
}
