import React, { useState } from 'react';
import AdminPanel from '../components/AdminPanel';
import { useSalonData } from '../hooks/useSalonData';
import { Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const { services, products, gallery, loading } = useSalonData();
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthorized(true);
      setError('');
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nude flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-nude flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md relative overflow-hidden">
          <button 
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 text-gray-400 hover:text-gold transition-colors flex items-center gap-1 text-sm"
          >
            <span>رجوع للموقع</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center mb-8 mt-4">
            <div className="bg-gold/10 p-4 rounded-full mb-4">
              <Lock className="text-gold w-8 h-8" />
            </div>
            <h1 className="serif text-3xl text-gray-800">دخول الإدارة</h1>
            <p className="text-gray-500 mt-2">يرجى إدخال كلمة المرور للمتابعة</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full bg-nude/50 p-4 rounded-2xl border border-gold/20 outline-none focus:border-gold transition-colors text-center text-lg"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-gold text-white p-4 rounded-2xl font-bold text-lg hover:bg-gold-light transition-all shadow-md active:scale-95"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nude" dir="rtl">
      <div className="max-w-7xl mx-auto pt-6 px-4">
         <button 
            onClick={() => navigate('/')}
            className="text-gold hover:text-gold-light transition-colors flex items-center gap-2 font-medium mb-4"
          >
            <ArrowRight className="w-5 h-5" />
            <span>العودة للموقع الرئيسي</span>
          </button>
      </div>
      <AdminPanel services={services} products={products} gallery={gallery} />
    </div>
  );
}
