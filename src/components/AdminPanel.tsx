import { useState } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { Service, Product, GalleryImage, Category, GalleryCategory, OperationType } from '../types';
import { Plus, Trash2, LogOut, LayoutGrid, Tag, Image as ImageIcon, Settings } from 'lucide-react';

const ADMIN_EMAIL = 'abdllahibune@gmail.com';

interface AdminPanelProps {
  services: Service[];
  products: Product[];
  gallery: GalleryImage[];
}

export default function AdminPanel({ services, products, gallery }: AdminPanelProps) {
  const [user, setUser] = useState(auth.currentUser);
  const [activeTab, setActiveTab] = useState<'services' | 'products' | 'gallery'>('services');

  // Auth logic
  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        alert('غير مسموح لك بالدخول');
      } else {
        setUser(result.user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="serif text-3xl text-gold mb-8">لوحة التحكم</h2>
        <button 
          onClick={login}
          className="bg-gold text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-gold-light"
        >
          تسجيل الدخول (Google)
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-4 md:p-8 rounded-t-[3rem] shadow-2xl mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-nude p-3 rounded-2xl">
              <Settings className="text-gold" />
            </div>
            <h1 className="serif text-4xl text-gray-800">إدارة المحتوى</h1>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>خروج</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <TabButton 
            active={activeTab === 'services'} 
            onClick={() => setActiveTab('services')}
            icon={<Tag />}
            label="الخدمات والأسعار"
          />
          <TabButton 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')}
            icon={<LayoutGrid />}
            label="المنتجات"
          />
          <TabButton 
            active={activeTab === 'gallery'} 
            onClick={() => setActiveTab('gallery')}
            icon={<ImageIcon />}
            label="معرض الأعمال"
          />
        </div>

        {/* Content */}
        <div className="space-y-12">
          {activeTab === 'services' && (
            <ServiceManager services={services} />
          )}
          {activeTab === 'products' && (
            <ProductManager products={products} />
          )}
          {activeTab === 'gallery' && (
            <GalleryManager gallery={gallery} />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all whitespace-nowrap ${
        active 
        ? 'bg-gold text-white shadow-lg' 
        : 'bg-nude text-gray-500 hover:bg-gold/10'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

// Managers
function ServiceManager({ services }: { services: Service[] }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>(Category.HENNA);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addOrUpdate = async () => {
    if (!name || !price) return;
    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), {
          name,
          price: Number(price),
          category
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'services'), {
          name,
          price: Number(price),
          category,
          order: services.length,
          createdAt: new Date().toISOString()
        });
      }
      setName('');
      setPrice('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'services');
    }
  };

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setName(s.name);
    setPrice(s.price.toString());
    setCategory(s.category);
  };

  const remove = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'services');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-nude/30 rounded-3xl">
        <input 
          placeholder="اسم الخدمة" 
          value={name} 
          onChange={e => setName(e.target.value)}
          className="bg-white p-3 rounded-xl border border-gold/20 outline-none"
        />
        <input 
          placeholder="السعر (MRU)" 
          type="number" 
          value={price} 
          onChange={e => setPrice(e.target.value)}
          className="bg-white p-3 rounded-xl border border-gold/20 outline-none"
        />
        <select 
          value={category} 
          onChange={e => setCategory(e.target.value as Category)}
          className="bg-white p-3 rounded-xl border border-gold/20 outline-none"
        >
          <option value={Category.HENNA}>حناء</option>
          <option value={Category.BEAUTY}>تجميل</option>
          <option value={Category.HAIR_REMOVAL}>إزالة شعر</option>
        </select>
        <div className="flex gap-2">
          <button 
            onClick={addOrUpdate}
            className="flex-1 bg-gold text-white rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light"
          >
            <Plus />
            {editingId ? 'تحديث' : 'إضافة'}
          </button>
          {editingId && (
            <button 
              onClick={() => { setEditingId(null); setName(''); setPrice(''); }}
              className="bg-gray-200 text-gray-600 px-4 rounded-xl"
            >
              إلغاء
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {services.map(s => (
          <div key={s.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50">
            <div>
              <p className="font-bold text-gray-800">{s.name}</p>
              <p className="text-sm text-gold">{s.price} MRU</p>
            </div>
            <div className="flex gap-4">
               <button onClick={() => startEdit(s)} className="text-blue-400 hover:text-blue-600">تعديل</button>
               <button onClick={() => remove(s.id)} className="text-red-400 hover:text-red-600"><Trash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductManager({ products }: { products: Product[] }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const addOrUpdate = async () => {
    if (!name || !url) return;
    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), { name, imageUrl: url });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'products'), { name, imageUrl: url });
      }
      setName('');
      setUrl('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'products');
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setUrl(p.imageUrl);
  };

  const remove = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'products');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-nude/30 rounded-3xl">
        <input 
          placeholder="اسم المنتج" 
          value={name} 
          onChange={e => setName(e.target.value)}
          className="bg-white p-3 rounded-xl border border-gold/20 outline-none"
        />
        <input 
          placeholder="رابط الصورة" 
          value={url} 
          onChange={e => setUrl(e.target.value)}
          className="bg-white p-3 rounded-xl border border-gold/20 outline-none"
        />
        <div className="flex gap-2">
          <button 
            onClick={addOrUpdate}
            className="flex-1 bg-gold text-white rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light"
          >
            <Plus />
            {editingId ? 'تحديث' : 'إضافة'}
          </button>
          {editingId && (
            <button 
              onClick={() => { setEditingId(null); setName(''); setUrl(''); }}
              className="bg-gray-200 text-gray-600 px-4 rounded-xl"
            >
              إلغاء
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => (
          <div key={p.id} className="relative group rounded-2xl overflow-hidden shadow-sm">
            <img src={p.imageUrl} alt={p.name} className="aspect-square object-cover" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => startEdit(p)}
                className="bg-white text-gold px-4 py-2 rounded-full text-sm font-bold"
              >
                تعديل
              </button>
              <button onClick={() => remove(p.id)} className="bg-red-500 text-white p-2 rounded-full"><Trash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryManager({ gallery }: { gallery: GalleryImage[] }) {
  const [url, setUrl] = useState('');

  const add = async () => {
    if (!url) return;
    try {
      await addDoc(collection(db, 'gallery'), { 
        imageUrl: url, 
        createdAt: new Date().toISOString(),
        category: GalleryCategory.MODERN
      });
      setUrl('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'gallery');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 p-6 bg-nude/30 rounded-3xl">
        <input 
          placeholder="رابط صورة العمل الفني" 
          value={url} 
          onChange={e => setUrl(e.target.value)}
          className="flex-1 bg-white p-3 rounded-xl border border-gold/20 outline-none"
        />
        <button 
          onClick={add}
          className="bg-gold text-white px-8 rounded-xl flex items-center gap-2 hover:bg-gold-light"
        >
          <Plus />
          إضافة
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map(g => (
          <div key={g.id} className="relative group rounded-2xl overflow-hidden shadow-sm">
            <img src={g.imageUrl} alt="Gallery" className="aspect-square object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => remove(g.id)} className="bg-red-500 text-white p-2 rounded-full"><Trash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
