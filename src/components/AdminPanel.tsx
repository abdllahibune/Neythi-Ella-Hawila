import React, { useState, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { Service, Product, GalleryImage, Category, GalleryCategory, Promotion, AppSettings, OperationType } from '../types';
import { 
  Plus, 
  Trash2, 
  LayoutGrid, 
  Tag, 
  Image as ImageIcon, 
  Settings, 
  Upload, 
  Users,
  Edit2,
  Percent,
  Globe
} from 'lucide-react';

interface AdminPanelProps {
  services: Service[];
  products: Product[];
  gallery: GalleryImage[];
  promotions?: Promotion[];
  settings?: AppSettings | null;
  stats?: { visits: number };
}

// Cloudinary Config
const CLOUDINARY_CLOUD_NAME = 'dy5qfryut';
const CLOUDINARY_UPLOAD_PRESET = 'neythi_uploads';

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('فشل رفع الصورة إلى السحابة');
  }

  const data = await response.json();
  return data.secure_url;
};

export default function AdminPanel({ services, products, gallery, promotions = [], settings, stats }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'products' | 'gallery' | 'promotions' | 'settings'>('services');

  return (
    <div className="bg-white min-h-screen p-4 md:p-8 rounded-t-[3rem] shadow-2xl mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-nude p-3 rounded-2xl">
              <Settings className="text-gold" />
            </div>
            <h1 className="serif text-4xl text-gray-800">إدارة المحتوى</h1>
          </div>

          {/* Visitors Counter Card */}
          <div className="bg-gold/5 border border-gold/10 p-6 rounded-[2rem] flex items-center gap-4 shadow-sm">
            <div className="bg-gold p-3 rounded-xl text-white">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">إجمالي الزوار</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.visits || 0}</p>
            </div>
          </div>
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
          <TabButton 
            active={activeTab === 'promotions'} 
            onClick={() => setActiveTab('promotions')}
            icon={<Percent />}
            label="العروض والخصومات"
          />
          <TabButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
            icon={<Globe />}
            label="إعدادات الموقع"
          />
        </div>

        {/* Content */}
        <div className="space-y-12">
          {activeTab === 'services' && <ServiceManager services={services} />}
          {activeTab === 'products' && <ProductManager products={products} />}
          {activeTab === 'gallery' && <GalleryManager gallery={gallery} />}
          {activeTab === 'promotions' && <PromotionManager promotions={promotions} />}
          {activeTab === 'settings' && <SettingsManager settings={settings} />}
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

// Image Upload Input Component
function ImageUploadField({ onUpload, currentImageUrl }: { onUpload: (url: string) => void, currentImageUrl?: string }) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        const url = await uploadToCloudinary(file);
        onUpload(url);
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء رفع الصورة');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input 
          type="text"
          placeholder="رابط الصورة أو ارفع من هنا"
          value={currentImageUrl || ''}
          onChange={(e) => onUpload(e.target.value)}
          className="flex-1 bg-white p-3 rounded-xl border border-gold/20 outline-none"
        />
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-nude p-3 rounded-xl border border-gold/20 hover:bg-gold/10 transition-colors text-gold"
          title="رفع صورة"
        >
          {loading ? <div className="animate-spin w-5 h-5 border-2 border-gold border-t-transparent rounded-full" /> : <Upload className="w-5 h-5" />}
        </button>
      </div>
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}

// Managers
// Managers
function SettingsManager({ settings }: { settings?: AppSettings | null }) {
  const [heroImageUrl, setHeroImageUrl] = useState(settings?.heroImageUrl || '');
  const [saving, setSaving] = useState(false);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const settingsRef = doc(db, 'settings', 'hero');
      await updateDoc(settingsRef, { heroImageUrl });
      alert('تم حفظ الإعدادات بنجاح');
    } catch (err) {
      // If doc doesn't exist, try setting it
      try {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'settings', 'hero'), { heroImageUrl });
        alert('تم حفظ الإعدادات بنجاح');
      } catch (innerErr) {
        handleFirestoreError(innerErr, OperationType.WRITE, 'settings/hero');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
        <h3 className="serif text-2xl text-gray-800 mb-6 flex items-center gap-2">
          <ImageIcon className="text-gold" />
          صورة الواجهة الرئيسية (Hero)
        </h3>
        
        <div className="space-y-4">
          <ImageUploadField 
            onUpload={setHeroImageUrl} 
            currentImageUrl={heroImageUrl} 
          />
          
          {heroImageUrl && (
            <div className="relative group">
              <img 
                src={heroImageUrl} 
                className="w-full h-48 object-cover rounded-2xl border border-gold/20" 
                alt="Preview" 
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors rounded-2xl"></div>
            </div>
          )}

          <button 
            onClick={saveSettings}
            disabled={saving}
            className="w-full bg-gold text-white py-4 rounded-xl font-bold hover:bg-gold-light transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PromotionManager({ promotions }: { promotions: Promotion[] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const addOrUpdate = async () => {
    if (!title || !discount) return;
    try {
      if (editingId) {
        await updateDoc(doc(db, 'promotions', editingId), { 
          title, description, discount, expiryDate 
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'promotions'), { 
          title, description, discount, expiryDate 
        });
      }
      resetForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'promotions');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDiscount('');
    setExpiryDate('');
    setEditingId(null);
  };

  const startEdit = (p: Promotion) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setDiscount(p.discount);
    setExpiryDate(p.expiryDate);
  };

  const remove = async (id: string) => {
    if (!confirm('حذف هذا العرض؟')) return;
    try {
      await deleteDoc(doc(db, 'promotions', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'promotions');
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-nude/30 rounded-3xl border border-gold/10">
        <div className="space-y-4">
          <input 
            placeholder="عنوان العرض (مثال: خصم العيد)" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white p-3 rounded-xl border border-gold/20 outline-none"
          />
          <textarea 
            placeholder="وصف العرض" 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-white p-3 rounded-xl border border-gold/20 outline-none h-24"
          />
        </div>
        <div className="space-y-4">
          <input 
            placeholder="نسبة الخصم (مثال: 20%)" 
            value={discount} 
            onChange={e => setDiscount(e.target.value)}
            className="w-full bg-white p-3 rounded-xl border border-gold/20 outline-none"
          />
          <div className="space-y-1">
            <label className="text-xs text-gray-500 mr-2">تاريخ الانتهاء</label>
            <input 
              type="date" 
              value={expiryDate} 
              onChange={e => setExpiryDate(e.target.value)}
              className="w-full bg-white p-3 rounded-xl border border-gold/20 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={addOrUpdate}
              className="flex-1 bg-gold text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light"
            >
              <Plus />
              {editingId ? 'تحديث العرض' : 'إضافة عرض جديد'}
            </button>
            {editingId && (
              <button onClick={resetForm} className="bg-gray-200 text-gray-600 px-6 rounded-xl">
                إلغاء
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 bg-gold text-white px-4 py-1 rounded-bl-2xl font-bold">
              {p.discount}
            </div>
            <h3 className="serif text-xl text-gray-800 mb-2 mt-4">{p.title}</h3>
            <p className="text-gray-500 text-sm mb-4">{p.description}</p>
            {p.expiryDate && (
              <p className="text-xs text-red-400">ينتهي في: {p.expiryDate}</p>
            )}
            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => startEdit(p)}
                className="flex-1 bg-nude text-gold py-2 rounded-xl text-sm font-bold hover:bg-gold hover:text-white transition-colors"
              >
                تعديل
              </button>
              <button 
                onClick={() => remove(p.id)}
                className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceManager({ services }: { services: Service[] }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>(Category.HENNA);
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const addOrUpdate = async () => {
    if (!name || !price) return;
    try {
      if (editingId) {
        await updateDoc(doc(db, 'services', editingId), {
          name,
          price: Number(price),
          category,
          imageUrl
        });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'services'), {
          name,
          price: Number(price),
          category,
          imageUrl,
          order: services.length,
          createdAt: new Date().toISOString()
        });
      }
      resetForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'services');
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategory(Category.HENNA);
    setImageUrl('');
    setEditingId(null);
  };

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setName(s.name);
    setPrice(s.price.toString());
    setCategory(s.category);
    setImageUrl(s.imageUrl || '');
  };

  const remove = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'services');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-nude/30 rounded-3xl border border-gold/10">
        <div className="space-y-4">
          <input 
            placeholder="اسم الخدمة" 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="w-full bg-white p-3 rounded-xl border border-gold/20 outline-none"
          />
          <input 
            placeholder="السعر (MRU)" 
            type="number" 
            value={price} 
            onChange={e => setPrice(e.target.value)}
            className="w-full bg-white p-3 rounded-xl border border-gold/20 outline-none"
          />
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value as Category)}
            className="w-full bg-white p-3 rounded-xl border border-gold/20 outline-none"
          >
            <option value={Category.HENNA}>حناء</option>
            <option value={Category.BEAUTY}>تجميل</option>
            <option value={Category.HAIR_REMOVAL}>إزالة شعر</option>
          </select>
        </div>
        <div className="space-y-4">
          <ImageUploadField onUpload={setImageUrl} currentImageUrl={imageUrl} />
          {imageUrl && (
            <img src={imageUrl} className="h-24 w-auto rounded-xl object-cover border border-gold/20" alt="Preview" />
          )}
          <div className="flex gap-2 pt-2">
            <button 
              onClick={addOrUpdate}
              className="flex-1 bg-gold text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light transition-all shadow-md active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>{editingId ? 'تحديث الخدمة' : 'إضافة خدمة جديدة'}</span>
            </button>
            {editingId && (
              <button 
                onClick={resetForm}
                className="bg-gray-200 text-gray-600 px-6 rounded-xl"
              >
                إلغاء
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {services.map(s => (
          <div key={s.id} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2rem] hover:ring-2 hover:ring-gold/20 transition-all group">
            <div className="flex items-center gap-4">
              {s.imageUrl && <img src={s.imageUrl} className="w-16 h-16 rounded-2xl object-cover border border-gold/10" />}
              <div>
                <p className="font-bold text-gray-800 text-lg">{s.name}</p>
                <div className="flex items-center gap-2 text-gold">
                  <span className="text-sm bg-nude px-2 py-0.5 rounded-full font-medium">
                    {s.price} MRU
                  </span>
                  <span className="text-xs text-gray-400 capitalize">{s.category.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => startEdit(s)} 
                className="p-3 text-gold hover:bg-nude rounded-full transition-colors"
                title="تعديل"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => remove(s.id)} 
                className="p-3 text-red-400 hover:bg-red-50 rounded-full transition-colors"
                title="حذف"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductManager({ products }: { products: Product[] }) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const addOrUpdate = async () => {
    if (!name || !imageUrl) return;
    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), { name, imageUrl });
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'products'), { name, imageUrl });
      }
      resetForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'products');
    }
  };

  const resetForm = () => {
    setName('');
    setImageUrl('');
    setEditingId(null);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setImageUrl(p.imageUrl);
  };

  const remove = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'products');
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-nude/30 rounded-3xl border border-gold/10">
        <input 
          placeholder="اسم المنتج" 
          value={name} 
          onChange={e => setName(e.target.value)}
          className="bg-white p-3 rounded-xl border border-gold/20 outline-none"
        />
        <div className="flex flex-col gap-2">
          <ImageUploadField onUpload={setImageUrl} currentImageUrl={imageUrl} />
          <div className="flex gap-2">
            <button 
              onClick={addOrUpdate}
              className="flex-1 bg-gold text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light"
            >
              <Plus />
              {editingId ? 'تحديث المنتج' : 'إضافة منتج'}
            </button>
            {editingId && (
              <button 
                onClick={resetForm}
                className="bg-gray-200 text-gray-600 px-6 rounded-xl"
              >
                إلغاء
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(p => (
          <div key={p.id} className="relative group rounded-[2.5rem] overflow-hidden shadow-md bg-white p-2">
            <img src={p.imageUrl} alt={p.name} className="aspect-square object-cover rounded-[2.2rem]" />
            <div className="p-4 text-center">
              <p className="font-medium text-gray-800">{p.name}</p>
            </div>
            <div className="absolute inset-0 bg-gold/40 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
              <button 
                onClick={() => startEdit(p)}
                className="bg-white text-gold w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => remove(p.id)} 
                className="bg-red-500 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryManager({ gallery }: { gallery: GalleryImage[] }) {
  const [imageUrl, setImageUrl] = useState('');

  const add = async () => {
    if (!imageUrl) return;
    try {
      await addDoc(collection(db, 'gallery'), { 
        imageUrl, 
        createdAt: new Date().toISOString(),
        category: GalleryCategory.MODERN
      });
      setImageUrl('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'gallery');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('حذف هذه الصورة من المعرض؟')) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'gallery');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 p-6 bg-nude/30 rounded-3xl border border-gold/10">
        <div className="flex-1">
          <ImageUploadField onUpload={setImageUrl} currentImageUrl={imageUrl} />
        </div>
        <button 
          onClick={add}
          className="bg-gold text-white px-10 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gold-light"
        >
          <Plus />
          إضافة للمعرض
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {gallery.map(g => (
          <div key={g.id} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm">
            <img src={g.imageUrl} alt="Gallery" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
              <button onClick={() => remove(g.id)} className="bg-white text-red-500 p-3 rounded-full hover:scale-110 transition-transform"><Trash2 className="w-6 h-6" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
