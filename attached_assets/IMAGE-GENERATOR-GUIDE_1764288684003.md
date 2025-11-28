# 🎨 دليل دمج مكون توليد الصور - رقيم AI 966

## 📦 الملف المطلوب

**[📥 ImageGenerator.tsx](computer:///mnt/user-data/outputs/ImageGenerator.tsx)** (12 KB)

---

## 🚀 خطوات الدمج في Replit

### الخطوة 1: رفع الملف

1. افتح مشروعك في Replit
2. انتقل إلى: `client/src/pages/`
3. أنشئ ملف جديد: `ImageGenerator.tsx`
4. انسخ محتوى الملف المرفق والصقه

---

### الخطوة 2: إضافة Route في App.tsx

افتح ملف `client/src/App.tsx` وأضف:

```typescript
import ImageGenerator from '@/pages/ImageGenerator';

// في قسم الـ Routes، أضف:
<Route path="/image-generator" element={<ImageGenerator />} />
```

**مثال كامل:**
```typescript
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-library" element={<MyLibrary />} />
        <Route path="/image-generator" element={<ImageGenerator />} /> {/* جديد */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
```

---

### الخطوة 3: إضافة رابط في Navigation

ابحث عن Navigation أو Header في مشروعك وأضف:

```typescript
<Link to="/image-generator" className="nav-link">
  <i className="fas fa-image"></i>
  توليد صور AI
</Link>
```

**أو إذا كان لديك قائمة:**

```typescript
const navItems = [
  { path: '/', label: 'الرئيسية', icon: 'home' },
  { path: '/my-library', label: 'مكتبتي', icon: 'bookmark' },
  { path: '/image-generator', label: 'توليد صور', icon: 'image' }, // جديد
];
```

---

### الخطوة 4: التحقق من المكونات المطلوبة

تأكد من وجود هذه المكونات في مشروعك:

```typescript
// يجب أن تكون موجودة في client/src/components/ui/
- Button
- Textarea  
- Card, CardContent, CardHeader, CardTitle, CardDescription
- Badge
- Tabs, TabsContent, TabsList, TabsTrigger
```

**إذا لم تكن موجودة:**

```bash
npx shadcn@latest add button
npx shadcn@latest add textarea
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add tabs
```

---

### الخطوة 5: التحقق من Lucide Icons

تأكد من تثبيت `lucide-react`:

```bash
pnpm add lucide-react
```

---

### الخطوة 6: التحقق من Toast

تأكد من وجود `sonner` للإشعارات:

```bash
pnpm add sonner
```

وأضف في `main.tsx` أو `App.tsx`:

```typescript
import { Toaster } from 'sonner';

// في JSX:
<Toaster position="top-center" richColors />
```

---

## ✨ الميزات المضمنة

### 1. **واجهة احترافية**
- ✅ تصميم متوافق مع الهوية البصرية
- ✅ ألوان رسمية (Indigo, Purple, Emerald)
- ✅ Responsive Design كامل
- ✅ RTL Support

### 2. **5 أنماط فنية**
- واقعي (Realistic)
- فني (Artistic)
- كرتوني (Cartoon)
- 3D
- لوحة (Painting)

### 3. **3 نسب أبعاد**
- 1:1 (مربع)
- 16:9 (عريض)
- 9:16 (عمودي)

### 4. **4 أمثلة سريعة**
- مدينة مستقبلية
- منظر طبيعي
- معماري
- فني

### 5. **وظائف متقدمة**
- ✅ عداد أحرف (500 حرف)
- ✅ توليد برومبت محسّن
- ✅ نسخ للحافظة
- ✅ إعادة تعيين
- ✅ Toast notifications
- ✅ Loading states

---

## 🎯 كيفية العمل

### للمستخدم:

1. **يكتب وصف الصورة بالعربية:**
   ```
   "مشهد خيالي لمدينة الرياض في 2050"
   ```

2. **يختار الأسلوب:**
   - واقعي / فني / كرتوني / 3D / لوحة

3. **يختار نسبة الأبعاد:**
   - 1:1 / 16:9 / 9:16

4. **يضغط "توليد البرومبت"**

5. **يحصل على برومبت محسّن بالإنجليزية:**
   ```
   "A detailed and stunning image of: مشهد خيالي لمدينة الرياض في 2050, 
   square balanced composition, photorealistic, 8k uhd, high quality, detailed, 
   professional photography, cinematic lighting, best quality, highly detailed, 
   professional, stunning, award winning"
   ```

6. **ينسخ البرومبت ويستخدمه في:**
   - Midjourney
   - DALL-E
   - Stable Diffusion
   - Leonardo AI

---

## 🔧 التخصيص (اختياري)

### لتحسين التوليد باستخدام API:

أضف في المكون:

```typescript
// استبدل دالة generateEnhancedPrompt بهذه:

const generateEnhancedPrompt = async (input: string, style: string, ratio: string) => {
  try {
    const response = await fetch('/api/generate-image-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: input, style, ratio })
    });
    
    const data = await response.json();
    return data.prompt;
  } catch (error) {
    // Fallback للقالب الحالي
    const styleConfig = styleTemplates[style];
    return `A detailed image of: ${input}, ${styleConfig.suffix}`;
  }
};
```

---

## 🎨 الألوان المستخدمة

```css
/* متوافقة مع الهوية البصرية */
--brand-indigo: #6366f1;
--brand-purple: #9333ea;
--brand-emerald: #10b981;
--brand-teal: #14b8a6;
```

---

## 📱 Responsive Design

- **Desktop:** grid 3 columns
- **Tablet:** grid 1 column
- **Mobile:** full width stacked

---

## ✅ قائمة التحقق

قبل التشغيل، تأكد من:

- [x] رفع ImageGenerator.tsx إلى client/src/pages/
- [x] إضافة Route في App.tsx
- [x] إضافة Link في Navigation
- [x] تثبيت المكونات المطلوبة (shadcn/ui)
- [x] تثبيت lucide-react
- [x] تثبيت sonner
- [x] إضافة <Toaster /> في App.tsx

---

## 🚀 الاختبار

1. شغّل المشروع: `pnpm dev`
2. انتقل إلى: `http://localhost:5173/image-generator`
3. جرّب الأمثلة السريعة
4. جرّب الأنماط المختلفة
5. اختبر النسخ للحافظة

---

## 🐛 استكشاف الأخطاء

### خطأ: "Module not found"
**الحل:** تأكد من تثبيت جميع المكونات:
```bash
npx shadcn@latest add button textarea card badge tabs
pnpm add lucide-react sonner
```

### خطأ: "Toaster is not defined"
**الحل:** أضف في App.tsx:
```typescript
import { Toaster } from 'sonner';
// في JSX: <Toaster position="top-center" richColors />
```

### خطأ: "Route not found"
**الحل:** تأكد من إضافة Route في App.tsx

### الصفحة لا تظهر في Navigation
**الحل:** أضف رابط في Navigation/Header component

---

## 💡 نصائح التحسين

### 1. إضافة ترجمة تلقائية:
استخدم Google Translate API لترجمة الوصف للإنجليزية

### 2. حفظ في المكتبة:
أضف زر "حفظ" لحفظ البرومبتات في قاعدة البيانات

### 3. معرض الأمثلة:
أضف صفحة تعرض أمثلة من الصور المولّدة

### 4. مشاركة البرومبت:
أضف أزرار مشاركة على Twitter/WhatsApp

---

## 📞 الدعم

إذا واجهت مشاكل:

1. تحقق من console للأخطاء
2. تأكد من تثبيت جميع الحزم
3. راجع الخطوات أعلاه
4. تحقق من التوافق مع النسخ

---

## 🎉 الخلاصة

**الملف جاهز للدمج!**

ما عليك سوى:
1. ✅ رفع ImageGenerator.tsx
2. ✅ إضافة Route
3. ✅ إضافة Navigation Link
4. ✅ تشغيل المشروع

**وستحصل على ميزة توليد صور AI كاملة!** 🚀

---

<div align="center">

**رقيم AI 966 - مولد صور الذكاء الاصطناعي**

**صُنع بـ ❤️ في السعودية 🇸🇦**

</div>
