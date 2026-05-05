import { Heart, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white py-12 px-4 border-t border-gold/10">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        <div className="serif text-3xl text-gold font-bold">
          نيثي الا حويلة
        </div>
        
        <div className="flex gap-6 text-gray-400">
          <a href="#" className="hover:text-gold transition-colors"><Instagram /></a>
          <a href="#" className="hover:text-gold transition-colors"><Facebook /></a>
        </div>

        <div className="text-gray-500 text-sm flex items-center gap-1">
          <span>صنع بكل</span>
          <Heart className="w-3 h-3 text-red-400 fill-current" />
          <span>لجمالك في موريتانيا</span>
        </div>
        
        <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-4">
          &copy; {new Date().getFullYear()} Neythi Ella Hawila. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
