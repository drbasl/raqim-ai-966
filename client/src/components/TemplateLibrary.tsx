import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileCode, 
  MessageSquare, 
  GraduationCap, 
  TrendingUp, 
  FileText, 
  ClipboardCheck,
  Target,
  BarChart3,
  Users,
  Calendar,
  Search,
  Megaphone,
  Mail,
  Video,
  Lightbulb,
  Rocket,
  Layers,
  Flame,
  Copy
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import TemplateRating from "./TemplateRating";

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  usageType: "social" | "code" | "education" | "crypto" | "article" | "exam";
  basePrompt: string;
  isPopular?: boolean;
  options: {
    humanTone: boolean;
    examples: boolean;
    keyPoints: boolean;
    complexity: "بسيط" | "متوسط" | "متقدم";
    engaging: boolean;
  };
}

const templates: Template[] = [
  {
    id: "student-explanation",
    title: "شرح دروس للطلاب",
    description: "قالب لشرح المفاهيم التعليمية بطريقة مبسطة وواضحة",
    icon: <GraduationCap className="w-6 h-6" />,
    usageType: "education",
    basePrompt: "اشرح مفهوم الجاذبية للطلاب في المرحلة المتوسطة بطريقة سهلة ومبسطة",
    isPopular: true,
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "بسيط",
      engaging: true,
    },
  },
  {
    id: "code-generator",
    title: "كتابة كود برمجي",
    description: "قالب لطلب كتابة أكواد برمجية موثقة واحترافية",
    icon: <FileCode className="w-6 h-6" />,
    usageType: "code",
    basePrompt: "اكتب دالة بلغة Python لحساب الأعداد الأولية حتى رقم معين مع التوثيق الكامل",
    options: {
      humanTone: false,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  {
    id: "social-post",
    title: "منشورات سوشيال ميديا",
    description: "قالب لكتابة منشورات جذابة ومؤثرة على وسائل التواصل",
    icon: <MessageSquare className="w-6 h-6" />,
    usageType: "social",
    basePrompt: "اكتب منشور تحفيزي عن أهمية التعلم المستمر وتطوير الذات",
    isPopular: true,
    options: {
      humanTone: true,
      examples: false,
      keyPoints: false,
      complexity: "بسيط",
      engaging: true,
    },
  },
  {
    id: "article-writer",
    title: "مقالات شاملة",
    description: "قالب لكتابة مقالات طويلة ومفصلة بأسلوب احترافي",
    icon: <FileText className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "اكتب مقال شامل عن تأثير الذكاء الاصطناعي على سوق العمل في المستقبل",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  {
    id: "exam-questions",
    title: "أسئلة امتحانات",
    description: "قالب لإعداد أسئلة امتحانات ومراجعات تعليمية",
    icon: <ClipboardCheck className="w-6 h-6" />,
    usageType: "exam",
    basePrompt: "أعد 10 أسئلة اختيار من متعدد عن الثورة الصناعية للمرحلة الثانوية",
    options: {
      humanTone: false,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: false,
    },
  },
  // قوالب تعليمية - التسويق الرقمي
  {
    id: "marketing-plan",
    title: "خطة تسويقية متكاملة",
    description: "قالب لإعداد خطة تسويق رقمي شاملة للمشاريع الطلابية أو الشركات الناشئة السعودية",
    icon: <Target className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "أعد خطة تسويقية رقمية متكاملة لمشروع [الوصف] في السوق السعودي تتضمن الأهداف، الجمهور، القنوات، والميزانية",
    isPopular: true,
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  {
    id: "campaign-analysis",
    title: "تحليل حملة إعلانية",
    description: "قالب لتحليل حملات إعلانية سعودية ناجحة على سناب شات، تويتر، وإنستقرام",
    icon: <BarChart3 className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "حلل حملة [اسم العلامة التجارية] على [المنصة] من حيث الأهداف، الرسالة، الجمهور، والنتائج مع تقييم النجاح",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: false,
    },
  },
  {
    id: "case-study",
    title: "دراسة حالة تسويقية",
    description: "قالب لكتابة دراسات حالة تسويقية لعلامات تجارية سعودية مشهورة",
    icon: <FileText className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "اكتب دراسة حالة تسويقية مفصلة عن [العلامة التجارية] تتضمن التحديات، الاستراتيجية، والنتائج مع الدروس المستفادة",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  {
    id: "content-calendar",
    title: "تقويم محتوى سعودي",
    description: "قالب لإنشاء تقويم محتوى يراعي المناسبات السعودية",
    icon: <Calendar className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "أنشئ تقويم محتوى لـ [العلامة التجارية] لمدة شهر يتضمن مناسبات سعودية (رمضان، اليوم الوطني، موسم الرياض)",
    isPopular: true,
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: true,
    },
  },
  {
    id: "audience-analysis",
    title: "تحليل الجمهور المستهدف",
    description: "قالب لدراسة وتحليل شخصيات العملاء في السوق السعودي",
    icon: <Users className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "أنشئ تحليل مفصل للجمهور المستهدف لـ [المنتج/الخدمة] في السعودية يتضمن الديمغرافيا، السلوك، والاحتياجات",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  {
    id: "seo-strategy",
    title: "استراتيجية SEO للمحتوى العربي",
    description: "قالب لتحسين المحتوى لمحركات البحث باللغة العربية",
    icon: <Search className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "أعد استراتيجية SEO لمحتوى [الموضوع] بالعربية تتضمن الكلمات المفتاحية السعودية، العناوين، والروابط الداخلية",
    options: {
      humanTone: false,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  // قوالب عملية وتطبيقية
  {
    id: "seasonal-campaign",
    title: "حملة سوشيال ميديا موسمية",
    description: "قالب لتصميم حملة تسويقية لموسم معين",
    icon: <Megaphone className="w-6 h-6" />,
    usageType: "social",
    basePrompt: "صمم حملة سوشيال ميديا لـ [الموسم] تتضمن الأهداف، الرسائل، المنصات، والمحتوى المقترح",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: true,
    },
  },
  {
    id: "competitor-analysis",
    title: "تقرير تحليل المنافسين",
    description: "قالب لتحليل استراتيجيات المنافسين الرقمية",
    icon: <BarChart3 className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "أعد تقرير تحليل منافسين لـ [العلامة التجارية] يتضمن المنصات، المحتوى، الأسعار، ونقاط القوة والضعف",
    options: {
      humanTone: false,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  {
    id: "ad-copy",
    title: "نصوص إعلانية إبداعية",
    description: "قالب لكتابة نصوص إعلانية جذابة لمنصات مختلفة",
    icon: <MessageSquare className="w-6 h-6" />,
    usageType: "social",
    basePrompt: "اكتب 5 نصوص إعلانية لـ [المنتج/الخدمة] على [المنصة] بأسلوب جذاب ومقنع",
    isPopular: true,
    options: {
      humanTone: true,
      examples: true,
      keyPoints: false,
      complexity: "متوسط",
      engaging: true,
    },
  },
  {
    id: "influencer-strategy",
    title: "استراتيجية التسويق بالمؤثرين",
    description: "قالب لتخطيط حملات مع المؤثرين السعوديين",
    icon: <Users className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "أعد استراتيجية تسويق بالمؤثرين لـ [المنتج] تتضمن اختيار المؤثرين، المحتوى، وقياس ROI",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  {
    id: "email-marketing",
    title: "إيميلات تسويقية احترافية",
    description: "قالب لكتابة رسائل بريدية تسويقية فعالة",
    icon: <Mail className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "اكتب إيميل تسويقي لـ [الهدف] بالعربية يتضمن عنوان جذاب، محتوى مقنع، وCTA واضح",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: true,
    },
  },
  {
    id: "performance-report",
    title: "تحليل أداء الحملات",
    description: "قالب لإعداد تقارير تحليلية شاملة باستخدام KPIs",
    icon: <BarChart3 className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "أعد تقرير أداء لحملة [الاسم] يتضمن KPIs رئيسية (CTR, CPA, ROI)، النتائج، والتوصيات",
    options: {
      humanTone: false,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  // قوالب إبداعية
  {
    id: "reels-ideas",
    title: "أفكار ريلز وفيديوهات قصيرة",
    description: "قالب لتوليد أفكار محتوى فيديو إبداعي",
    icon: <Video className="w-6 h-6" />,
    usageType: "social",
    basePrompt: "ولد 10 أفكار ريلز إبداعية لـ [العلامة التجارية] على إنستقرام/تيك توك مع سيناريو مختصر",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: false,
      complexity: "بسيط",
      engaging: true,
    },
  },
  {
    id: "interactive-content",
    title: "استراتيجية المحتوى التفاعلي",
    description: "قالب لإنشاء استطلاعات، كويزات، ومسابقات تفاعلية",
    icon: <Lightbulb className="w-6 h-6" />,
    usageType: "social",
    basePrompt: "صمم محتوى تفاعلي [استطلاع/كويز/مسابقة] عن [الموضوع] يتضمن الأسئلة، الخيارات، والجوائز",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: true,
    },
  },
  {
    id: "product-launch",
    title: "خطة إطلاق منتج",
    description: "قالب لتخطيط وتنفيذ حملة إطلاق منتج جديد",
    icon: <Rocket className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "أعد خطة إطلاق متكاملة لـ [المنتج] في السوق السعودي تتضمن مراحل الإطلاق، الرسائل، والقنوات",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  {
    id: "marketing-exam",
    title: "أسئلة امتحانات ومراجعات",
    description: "قالب لإنشاء أسئلة اختبارات في مجال التسويق الرقمي",
    icon: <ClipboardCheck className="w-6 h-6" />,
    usageType: "exam",
    basePrompt: "أعد 15 سؤال اختيار من متعدد عن [الموضوع] في التسويق الرقمي للمعلمين مع الإجابات الصحيحة",
    options: {
      humanTone: false,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: false,
    },
  },
  // قوالب خاصة بالسوق السعودي والعربي
  {
    id: "customer-service",
    title: "محتوى خدمة العملاء",
    description: "قالب لكتابة رسائل دعم واحترافية تحل مشاكل العملاء",
    icon: <MessageSquare className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "اكتب رسالة دعم احترافية بالعربية لعميل يشتكي من [المشكلة] في [المنتج/الخدمة] بأسلوب ودي وحل فعال",
    isPopular: true,
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: true,
    },
  },
  {
    id: "hr-content",
    title: "محتوى الموارد البشرية",
    description: "قالب لكتابة محتوى التوظيف والتطوير الوظيفي",
    icon: <Users className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "أعد إعلان توظيف احترافي لوظيفة [المسمى الوظيفي] في شركة سعودية يتضمن المتطلبات والمسؤوليات والراتب المتوقع",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: true,
    },
  },
  {
    id: "professional-email",
    title: "رسائل بريدية رسمية",
    description: "قالب لكتابة رسائل بريدية احترافية وسعودية",
    icon: <Mail className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "اكتب رسالة بريدية رسمية بالعربية من [المرسل] إلى [المستقبل] بخصوص [الموضوع] مع الحفاظ على الأدب والاحترافية",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: false,
    },
  },
  {
    id: "news-content",
    title: "أخبار وتقارير صحفية",
    description: "قالب لكتابة أخبار وتقارير محترفة بأسلوب صحفي",
    icon: <FileText className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "اكتب خبراً صحفياً احترافياً عن [الحدث] يتضمن من، ماذا، متى، أين، لماذا، كيف مع الحفاظ على الحيادية",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  {
    id: "saudi-tourism",
    title: "محتوى السياحة السعودية",
    description: "قالب لكتابة محتوى ترويجي للمقاصد السياحية السعودية",
    icon: <Rocket className="w-6 h-6" />,
    usageType: "social",
    basePrompt: "اكتب محتوى ترويجي جذاب عن [المقصد السياحي السعودي] يوضح الجاذبية والأنشطة والأفضل للزيارة",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "بسيط",
      engaging: true,
    },
  },
  {
    id: "brand-story",
    title: "قصة وهوية العلامة التجارية",
    description: "قالب لكتابة قصة العلامة التجارية بطريقة عاطفية وملهمة",
    icon: <Lightbulb className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "اكتب قصة ملهمة لـ [العلامة التجارية] السعودية تتضمن البداية، التحديات، والحلم مع ربط عاطفي قوي",
    isPopular: true,
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: true,
    },
  },
  {
    id: "saudi-events",
    title: "محتوى المناسبات السعودية",
    description: "قالب خاص بكتابة محتوى للمناسبات السعودية (رمضان، اليوم الوطني، إلخ)",
    icon: <Calendar className="w-6 h-6" />,
    usageType: "social",
    basePrompt: "أنشئ حملة محتوى لـ [المناسبة السعودية] (رمضان/اليوم الوطني/التأسيس) تتضمن 5 منشورات مختلفة بأسلوب احترافي",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: true,
    },
  },
  {
    id: "vision-2030",
    title: "محتوى رؤية السعودية 2030",
    description: "قالب لكتابة محتوى يرتبط بأهداف رؤية 2030",
    icon: <TrendingUp className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "اكتب محتوى تسويقي يربط [المنتج/الخدمة] بأهداف رؤية السعودية 2030 والتنمية المستدامة",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: true,
    },
  },
];

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
  compact?: boolean;
}

type TemplateCategory = "الكل" | "تعليمي" | "عملي" | "إبداعي" | "عام" | "الشائعة";

const categoryMap: Record<string, TemplateCategory> = {
  "student-explanation": "عام",
  "code-writing": "عام",
  "social-media": "عام",
  "article-writing": "عام",
  "exam-questions": "عام",
  "marketing-plan": "تعليمي",
  "campaign-analysis": "تعليمي",
  "case-study": "تعليمي",
  "content-calendar": "تعليمي",
  "audience-analysis": "تعليمي",
  "seo-strategy": "تعليمي",
  "seasonal-campaign": "عملي",
  "competitor-analysis": "عملي",
  "ad-copy": "عملي",
  "influencer-strategy": "عملي",
  "email-marketing": "عملي",
  "performance-report": "عملي",
  "reels-ideas": "إبداعي",
  "interactive-content": "إبداعي",
  "product-launch": "إبداعي",
  "marketing-exam": "إبداعي",
  "customer-service": "عملي",
  "hr-content": "عملي",
  "professional-email": "عملي",
  "news-content": "تعليمي",
  "saudi-tourism": "إبداعي",
  "brand-story": "إبداعي",
  "saudi-events": "إبداعي",
  "vision-2030": "تعليمي",
};

const popularTemplateIds = [
  "student-explanation",
  "social-post",
  "marketing-plan",
  "content-calendar",
  "ad-copy",
  "customer-service",
  "brand-story",
];

export default function TemplateLibrary({ onSelectTemplate, compact = false }: TemplateLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("الكل");

  const handleCopyTemplate = (template: Template, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(template.basePrompt).then(() => {
      toast.success(`✅ تم نسخ القالب "${template.title}"`);
    }).catch(() => {
      toast.error("❌ فشل نسخ القالب");
    });
  };

  const filteredTemplates = activeCategory === "الكل" 
    ? templates 
    : activeCategory === "الشائعة"
    ? templates.filter(t => popularTemplateIds.includes(t.id))
    : templates.filter(t => categoryMap[t.id] === activeCategory);

  const categories: { id: TemplateCategory; label: string; count: number; icon?: React.ReactNode }[] = [
    { id: "الشائعة", label: "🔥 الشائعة", count: templates.filter(t => popularTemplateIds.includes(t.id)).length, icon: <Flame className="w-4 h-4 text-orange-500" /> },
    { id: "الكل", label: "الكل", count: templates.length },
    { id: "تعليمي", label: "تعليمي", count: templates.filter(t => categoryMap[t.id] === "تعليمي").length },
    { id: "عملي", label: "عملي", count: templates.filter(t => categoryMap[t.id] === "عملي").length },
    { id: "إبداعي", label: "إبداعي", count: templates.filter(t => categoryMap[t.id] === "إبداعي").length },
    { id: "عام", label: "عام", count: templates.filter(t => categoryMap[t.id] === "عام").length },
  ];

  const content = (
    <>
      {/* فلاتر التصنيف */}
      <div className={`flex flex-wrap justify-center gap-2 ${compact ? 'mb-6' : 'mb-12'}`}>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={`gap-2 ${category.id === "الشائعة" ? "border-orange-500/50 hover:bg-orange-500/10" : ""}`}
            >
              {category.id === "الكل" && <Layers className="w-4 h-4" />}
              {category.id === "الشائعة" && <Flame className="w-4 h-4 text-orange-500" />}
              {category.label}
              <span className="text-xs opacity-70">({category.count})</span>
            </Button>
          ))}
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={`p-6 bg-card/50 transition-all hover:shadow-lg cursor-pointer group relative ${
              popularTemplateIds.includes(template.id)
                ? "border-orange-500/30 hover:border-orange-500/60 hover:shadow-orange-500/10"
                : "border-primary/20 hover:border-primary/40 hover:shadow-primary/10"
            }`}
            onClick={() => onSelectTemplate(template)}
          >
            {popularTemplateIds.includes(template.id) && (
              <div className="absolute top-3 right-3 bg-orange-500/20 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3" /> شائع
              </div>
            )}
          
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/30 transition-colors">
                {template.icon}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {template.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template);
                  }}
                >
                  استخدم الآن
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleCopyTemplate(template, e)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              {/* نظام التقييم وعداد الاستخدام */}
              <div onClick={(e) => e.stopPropagation()}>
                <TemplateRating
                  templateId={template.id}
                  templateTitle={template.title}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );

  if (compact) {
    return content;
  }

  return (
    <section id="templates" className="py-16 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold neon-text">
            مكتبة القوالب الجاهزة
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اختر من مجموعة متنوعة من القوالب الجاهزة لتسريع عملية إنشاء البرومبتات
          </p>
        </div>
        {content}
      </div>
    </section>
  );
}

export { templates };
export type { Template };
