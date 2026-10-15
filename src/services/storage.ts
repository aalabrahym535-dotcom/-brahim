import { AdItem } from '../types';

// Asset paths from image generation
const HERO_IMAGE = '/src/assets/images/hero_hamam_bazar_1792045497460.jpg';
const TRACTOR_IMAGE = '/src/assets/images/tractor_agricultural_1792045498168.jpg';
const SOLAR_IMAGE = '/src/assets/images/solar_panels_farm_1792045498002.jpg';
const WASHING_IMAGE = '/src/assets/images/washing_machine_appl_1792045499079.jpg';
const SHEEP_IMAGE = '/src/assets/images/awassi_sheep_pasture_1792045498568.jpg';

export { HERO_IMAGE };

// Initial realistic seed listings for Hamam al-Turkman and surrounding area
export const INITIAL_ADS: AdItem[] = [
  {
    id: 'ad-101',
    user_id: 'user-02',
    title: 'غسالة اتوماتيك مستعملة بحالة ممتازة 8 كيلو',
    description: 'غسالة ال جي (LG) انفيرتر 8 كغ مستوردة، نظيفة جداً وشغالة على الطاقة والكهرباء بدون أي صوت أو عطل. سبب البيع التجديد لمقاس أكبر. المعاينة مباشرة في حمام التركمان الشمالي.',
    category: 'for_sale',
    subCategory: 'أجهزة منزلية',
    price: 3200000,
    isNegotiable: true,
    whatsapp: '963944123456',
    location: 'حمام التركمان الشمالي',
    images: [WASHING_IMAGE],
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    viewsCount: 142,
    isFeatured: true,
    contactName: 'أبو أحمد التركماني'
  },
  {
    id: 'ad-102',
    user_id: 'user-03',
    title: 'جرار زراعي كيس 340 قوة حصانية عالية جاهز للموسم',
    description: 'جرار زراعي كيس مع مقطورة حبات قمح، محرك ومحاور بحالة الوكالة، إطارات جديدة بنسبة 90%، جاهز مباشرة للحصاد وحراثة الأراضي الزراعية في ريف تل أبيض وحمام التركمان.',
    category: 'for_sale',
    subCategory: 'آليات ومعدات زراعية',
    price: 185000000,
    isNegotiable: true,
    whatsapp: '963988234567',
    location: 'حمام التركمان - السوق الزراعي',
    images: [TRACTOR_IMAGE],
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    viewsCount: 389,
    isFeatured: true,
    contactName: 'الحاج مصطفى'
  },
  {
    id: 'ad-103',
    user_id: 'user-03',
    title: 'منظومة طاقة شمسية كاملة لضخ مياه بئر ارتوازي 15 حصان',
    description: 'مجموعة ألواح شمسية مونو كريستال عالية الكفاءة مع قاعدة حديدية متحركة وإنفيرتر شمسي ومضخة غطاس 5 إنش. توفير كامل للمازوت والديزل لسقاية محاصيل القمح والقطن.',
    category: 'for_sale',
    subCategory: 'طاقة ومياه',
    price: 68000000,
    isNegotiable: false,
    whatsapp: '963933987654',
    location: 'ريف حمام التركمان - مشروع البليخ',
    images: [SOLAR_IMAGE],
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    viewsCount: 215,
    isFeatured: false,
    contactName: 'ورشة الفرات للطاقة البديلة'
  },
  {
    id: 'ad-104',
    user_id: 'user-02',
    title: 'مطلوب شراء بيك آب تويوتا هايلوكس موديل 2008 حتى 2015',
    description: 'مطلوب للشراء بشكل فوري وعاجل سيارة بيك آب هايلوكس دبل كبين أو غمارتين، خالية من القص والقصعات الكبيرة، دفع رباعي وشرط فحص المحرك. الدفع نقداً وفور الاتفاق.',
    category: 'to_buy',
    subCategory: 'سيارات ونقل',
    price: null,
    isNegotiable: true,
    whatsapp: '963955678901',
    location: 'حمام التركمان الجنوبي',
    images: [],
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    viewsCount: 94,
    isFeatured: false,
    contactName: 'أبو عمر'
  },
  {
    id: 'ad-105',
    user_id: 'user-02',
    title: 'قطيع أغنام عواس بلدية حوامل وأمهات صنف أول',
    description: 'للبيع 35 رأس غنم عواس محلي أصيل خالي من أي أمراض، مطعّم وجاهز للمراعي أو التربية المنزلية. الأوزان ممتازة والبيع جملة أو تفريد حسب الرغبة. تواصل واتساب لمعاينة الحظيرة.',
    category: 'for_sale',
    subCategory: 'مواشي وثروة حيوانية',
    price: 85000000,
    isNegotiable: true,
    whatsapp: '963944654321',
    location: 'حمام التركمان - أطراف البلدة',
    images: [SHEEP_IMAGE],
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    viewsCount: 460,
    isFeatured: true,
    contactName: 'أبو خالد الراعي'
  },
  {
    id: 'ad-106',
    user_id: 'user-03',
    title: 'خدمات حفر وصيانة الآبار الارتوازية وتنظيف الغطاسات',
    description: 'فريق مختص بحفر وتعميق آبار مياه الري والمنزل حتى عمق 250 متر بأحدث الحفارات الدوارة، مع تصوير الآبار بكاميرا دقيقة وتنزيل قمصان الحديد والبي في سي.',
    category: 'services',
    subCategory: 'حفر وصيانة آبار',
    price: null,
    isNegotiable: true,
    whatsapp: '963988776655',
    location: 'حمام التركمان وتل أبيض والقرى المحيطة',
    images: [],
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    viewsCount: 167,
    isFeatured: false,
    contactName: 'المعلم عبد الله الحفار'
  },
  {
    id: 'ad-107',
    user_id: 'user-02',
    title: 'مفقود: محفظة جلدية سوداء بداخلها بطاقة شخصية وأوراق رسمية',
    description: 'فُقدت بعد ظهر اليوم محفظة جيب سوداء بالقرب من المركز الصحي أو مفرق السوق الرئيسي باسم (محمد علي السليمان). يرجى ممن يعثر عليها التواصل وله مكافأة مالية وجزيل الشكر.',
    category: 'lost_found',
    subCategory: 'أوراق ومقتنيات مفقودة',
    price: null,
    isNegotiable: false,
    whatsapp: '963944332211',
    location: 'قرب المركز الصحي - السوق الرئيسي',
    images: [],
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    viewsCount: 312,
    isFeatured: true,
    contactName: 'محمد علي'
  }
];

const DB_NAME = 'bazar_hamam_db';
const DB_VERSION = 1;
const STORE_NAME = 'ads_store';
const FAVORITES_KEY = 'bazar_hamam_favorites';
const MY_ADS_KEY = 'bazar_hamam_my_ads';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function fetchAllAds(): Promise<AdItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const result = req.result as AdItem[];
        if (!result || result.length === 0) {
          // Initialize with seed listings
          seedInitialData().then((seeded) => resolve(seeded));
        } else {
          // Sort by creation date descending
          resolve(result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
      };
      req.onerror = () => {
        resolve(getFallbackAds());
      };
    });
  } catch (err) {
    console.warn('Falling back to local cache due to IndexedDB error:', err);
    return getFallbackAds();
  }
}

async function seedInitialData(): Promise<AdItem[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const ad of INITIAL_ADS) {
      store.put(ad);
    }
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(INITIAL_ADS);
      tx.onerror = () => resolve(INITIAL_ADS);
    });
  } catch {
    saveToFallbackAds(INITIAL_ADS);
    return INITIAL_ADS;
  }
}

export async function insertAd(ad: AdItem): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(ad);
      tx.oncomplete = () => {
        saveMyAdId(ad.id);
        resolve(true);
      };
      tx.onerror = () => {
        fallbackInsert(ad);
        saveMyAdId(ad.id);
        resolve(true);
      };
    });
  } catch {
    fallbackInsert(ad);
    saveMyAdId(ad.id);
    return true;
  }
}

export async function updateAd(id: string, updates: Partial<AdItem>): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const existing = getReq.result as AdItem | undefined;
        if (existing) {
          const updated = { ...existing, ...updates };
          store.put(updated);
        }
      };
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => {
        fallbackUpdate(id, updates);
        resolve(true);
      };
    });
  } catch {
    fallbackUpdate(id, updates);
    return true;
  }
}

function fallbackUpdate(id: string, updates: Partial<AdItem>) {
  const current = getFallbackAds();
  const next = current.map((a) => (a.id === id ? { ...a, ...updates } : a));
  saveToFallbackAds(next);
}

export async function deleteAd(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => {
        fallbackDelete(id);
        resolve(true);
      };
    });
  } catch {
    fallbackDelete(id);
    return true;
  }
}

export async function incrementViews(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const ad = getReq.result as AdItem | undefined;
      if (ad) {
        ad.viewsCount = (ad.viewsCount || 0) + 1;
        store.put(ad);
      }
    };
  } catch {
    // silently ignore view count failure
  }
}

// LocalStorage helpers for favorites & user's own ads
export function getFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteId(id: string): boolean {
  try {
    const favs = getFavoriteIds();
    const exists = favs.includes(id);
    const updated = exists ? favs.filter((f) => f !== id) : [...favs, id];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
}

export function getMyAdIds(): string[] {
  try {
    const raw = localStorage.getItem(MY_ADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMyAdId(id: string): void {
  try {
    const myAds = getMyAdIds();
    if (!myAds.includes(id)) {
      localStorage.setItem(MY_ADS_KEY, JSON.stringify([id, ...myAds]));
    }
  } catch {
    // ignore
  }
}

// Fallback in case IndexedDB is restricted in sandboxes
function getFallbackAds(): AdItem[] {
  try {
    const raw = localStorage.getItem('bazar_hamam_ads_backup');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return INITIAL_ADS;
}

function saveToFallbackAds(ads: AdItem[]) {
  try {
    localStorage.setItem('bazar_hamam_ads_backup', JSON.stringify(ads));
  } catch {
    // quota exceeded
  }
}

function fallbackInsert(ad: AdItem) {
  const current = getFallbackAds();
  saveToFallbackAds([ad, ...current]);
}

function fallbackDelete(id: string) {
  const current = getFallbackAds();
  saveToFallbackAds(current.filter((a) => a.id !== id));
}

// Utility: Clean phone number and generate WhatsApp link with polite prefilled Arabic text
export function generateWhatsAppLink(phone: string, title: string, price?: number | null): string {
  // Strip non-digit characters except leading +
  let cleanNumber = phone.replace(/[^0-9]/g, '');
  
  // Syrian phone normalization: e.g. 0944123456 -> 963944123456
  if (cleanNumber.startsWith('09') && cleanNumber.length === 10) {
    cleanNumber = '963' + cleanNumber.substring(1);
  } else if (cleanNumber.startsWith('963') || cleanNumber.startsWith('90')) {
    // Already good
  } else if (cleanNumber.startsWith('9') && cleanNumber.length === 9) {
    cleanNumber = '963' + cleanNumber;
  }

  const priceText = price ? `المعروض بسعر (${formatPrice(price)})` : 'المعروض على بازار حمام التركمان';
  const message = `السلام عليكم ورحمة الله وبركاته،\nتواصلت معك بخصوص إعلانك في "بازار حمام التركمان":\n*${title}*\n${priceText}.\nهل الإعلان ما زال متوفراً؟ وشكراً لك.`;
  
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

// Price formatter for Syrian Pounds (ل.س)
export function formatPrice(price?: number | null): string {
  if (price === undefined || price === null) {
    return 'على السوم / مجاني';
  }
  return `${new Intl.NumberFormat('ar-SY').format(price)} ل.س`;
}

// Relative time in Arabic (e.g., منذ ساعتين، منذ يوم)
export function formatRelativeTime(dateString: string): string {
  try {
    const now = Date.now();
    const past = new Date(dateString).getTime();
    const diffSec = Math.floor((now - past) / 1000);

    if (diffSec < 60) return 'الآن';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'أمس';
    if (diffDays < 30) return `منذ ${diffDays} يوم`;
    return new Date(dateString).toLocaleDateString('ar-SY', { month: 'short', day: 'numeric' });
  } catch {
    return 'مؤخراً';
  }
}
