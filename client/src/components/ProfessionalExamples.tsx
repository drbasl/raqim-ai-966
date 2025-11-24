import { useState } from 'react';
import { Copy, ChevronDown, Star, User } from 'lucide-react';

interface Example {
  id: number;
  title: string;
  expert: string;
  category: string;
  rating: number;
  description: string;
  prompt: string;
  style: string;
  quality: string;
}

const examples: Example[] = [
  {
    id: 1,
    title: "مقهى سعودي عصري فاخر",
    expert: "د. سارة التصميم",
    category: "تصميم داخلي",
    rating: 5,
    description: "خبيرة في التصميم الداخلي والديكور السعودي",
    prompt: "مقهى سعودي تقليدي بديكور عصري، جلسات أرضية فاخرة مع وسائد مخملية، إضاءة دافئة معلقة، نباتات خضراء طبيعية، جدران بألوان ترابية، لمسات خشبية، أجواء مريحة وأنيقة",
    style: "واقعي",
    quality: "عالية"
  },
  {
    id: 2,
    title: "شعار احترافي لشركة تقنية",
    expert: "م. خالد الجرافيك",
    category: "تصميم شعارات",
    rating: 5,
    description: "مختص في هوية العلامات التجارية",
    prompt: "شعار حديث لشركة تقنية سعودية، خطوط عربية أنيقة وعصرية، ألوان أزرق وذهبي متدرج، تصميم مينيمال بسيط، رمز تقني مجرد، خلفية شفافة، جودة عالية",
    style: "فني",
    quality: "عالية"
  },
  {
    id: 3,
    title: "كبسة سعودية احترافية",
    expert: "أ. منى الطعام",
    category: "تصوير طعام",
    rating: 4,
    description: "مصورة متخصصة في الطعام السعودي",
    prompt: "طبق كبسة سعودية فاخر، أرز ذهبي متناسق، لحم غنم طري، مكسرات محمصة، زبيب، تصوير احترافي من الأعلى، إضاءة طبيعية جانبية، خلفية خشبية داكنة، تفاصيل دقيقة، بخار خفيف",
    style: "واقعي",
    quality: "فائقة"
  },
  {
    id: 4,
    title: "صحراء عند الغروب",
    expert: "د. عمر المناظر",
    category: "مناظر طبيعية",
    rating: 5,
    description: "خبير في تصوير الطبيعة السعودية",
    prompt: "صحراء سعودية شاسعة عند الغروب، كثبان رملية ذهبية متموجة، جمال عربي أصيل في المقدمة، سماء برتقالية وردية متدرجة، غيوم خفيفة، ظلال طويلة، أجواء هادئة، تصوير سينمائي عالي الجودة",
    style: "واقعي",
    quality: "فائقة"
  },
  {
    id: 5,
    title: "فريق عمل سعودي احترافي",
    expert: "أ. ريم الأعمال",
    category: "تصوير مؤسسي",
    rating: 4,
    description: "مختصة في التصوير المؤسسي",
    prompt: "فريق عمل سعودي في اجتماع استراتيجي، مكتب عصري بإطلالة على الرياض، طاولة اجتماعات فخمة، شاشات عرض تفاعلية، تنوع في الفريق، ملابس رسمية أنيقة، إضاءة احترافية طبيعية، أجواء ديناميكية",
    style: "واقعي",
    quality: "عالية"
  },
  {
    id: 6,
    title: "خط عربي ثلاثي الأبعاد",
    expert: "د. عبدالله الخطاط",
    category: "فن الخط",
    rating: 5,
    description: "خبير في الخط العربي والتصميم الإسلامي",
    prompt: "خط عربي ثلاثي الأبعاد بخط الثلث الفاخر، آية قرآنية بتشكيل دقيق، ألوان ذهبية لامعة، خلفية إسلامية هندسية، تأثيرات ضوئية مشعة، ظلال عميقة، تفاصيل زخرفية دقيقة",
    style: "فني",
    quality: "فائقة"
  }
];

function ExampleCard({ example }: { example: Example }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyPrompt = () => {
    navigator.clipboard.writeText(example.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
      
      {/* العنوان والتقييم */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800">{example.title}</h3>
        <div className="flex gap-0.5">
          {[...Array(example.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>

      {/* معلومات الخبير */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
          <User className="w-4 h-4 text-purple-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-700">{example.expert}</p>
          <p className="text-xs text-gray-500">{example.description}</p>
        </div>
      </div>

      {/* الفئة */}
      <div className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full mb-3">
        {example.category}
      </div>

      {/* زر عرض التفاصيل */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-800 mb-3 transition-colors"
      >
        <span>عرض التفاصيل</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* البرومبت الكامل */}
      {isExpanded && (
        <div className="bg-gray-50 rounded-xl p-4 mb-3">
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {example.prompt}
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-1 bg-white text-xs text-gray-600 rounded-lg border border-gray-200">
              النمط: {example.style}
            </span>
            <span className="px-2 py-1 bg-white text-xs text-gray-600 rounded-lg border border-gray-200">
              الجودة: {example.quality}
            </span>
          </div>
        </div>
      )}

      {/* زر النسخ */}
      <button
        onClick={copyPrompt}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-medium transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        <Copy className="w-4 h-4" />
        {copied ? '✓ تم النسخ بنجاح' : 'نسخ البرومبت'}
      </button>
    </div>
  );
}

export default function ProfessionalExamples() {
  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* العنوان الرئيسي */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            أمثلة سريعة
          </h2>
          <p className="text-gray-600 text-lg">
            برومبتات احترافية جاهزة من خبراء متخصصين
          </p>
        </div>

        {/* شبكة الأمثلة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example) => (
            <ExampleCard key={example.id} example={example} />
          ))}
        </div>
      </div>
    </section>
  );
}
