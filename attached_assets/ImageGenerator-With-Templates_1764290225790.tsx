import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Wand2, Sparkles, Image as ImageIcon, Check, RotateCcw, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageGeneratorWithTemplates() {
  const [description, setDescription] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [promptQuality, setPromptQuality] = useState<{stars: number; message: string; color: string} | null>(null);

  const maxLength = 500;
  const charCount = description.length;

  // مكتبة القوالب الجاهزة - 25 قالب
  const imageTemplates = {
    innovation: [
      {
        id: 1,
        title: '🧠 التفكير الإبداعي',
        description: 'عقل بشري مضيء مع دوائر متشابكة تمثل الأفكار الإبداعية',
        prompt: 'A glowing human brain with interconnected circles representing creative ideas, futuristic background, neon blue and golden colors, digital art style, highly detailed neural pathways, innovation concept'
      },
      {
        id: 2,
        title: '💡 الأفكار الثورية',
        description: 'لمبة إضاءة ضخمة تنفجر منها أفكار ملونة وأشكال هندسية',
        prompt: 'A massive light bulb exploding with colorful ideas and geometric shapes, black background, dramatic lighting, vibrant colors, innovation and creativity concept, 3d render'
      },
      {
        id: 3,
        title: '🔬 تحليل المشاكل',
        description: 'شبكة معقدة من الخطوط والعقد تتحلل إلى عناصر بسيطة',
        prompt: 'A complex network of lines and nodes breaking down into simple elements, infographic style, professional blue and white colors, problem-solving visualization, clean design'
      },
      {
        id: 4,
        title: '🎯 التخطيط المستقبلي',
        description: 'خريطة طريق ثلاثية الأبعاد متوهجة تؤدي نحو المستقبل',
        prompt: 'A glowing 3d roadmap leading towards the future, inspiring sunset sky, strategic planning visualization, golden hour lighting, photorealistic'
      },
      {
        id: 5,
        title: '🚀 الابتكار التقني',
        description: 'صاروخ مستقبلي ينطلق عبر حلقات تقنية متوهجة',
        prompt: 'A futuristic rocket launching through glowing tech rings, neon cyan and orange colors, speed and innovation concept, digital art, highly detailed engine trails'
      }
    ],
    productivity: [
      {
        id: 6,
        title: '⚡ الإنتاجية الشخصية',
        description: 'شخص يعمل في مكتب منظم مثالي مع شاشات متعددة',
        prompt: 'A person working in a perfectly organized modern office, multiple screens, clean minimalist environment, natural lighting through large windows, productivity concept, photorealistic'
      },
      {
        id: 7,
        title: '📊 إدارة المشاريع',
        description: 'لوحة كانبان ثلاثية الأبعاد ضخمة مع بطاقات ملونة',
        prompt: 'A massive 3d kanban board with colorful organized cards, tech background, project management visualization, isometric view, professional color scheme'
      },
      {
        id: 8,
        title: '🧩 تنظيم الأولويات',
        description: 'مصفوفة آيزنهاور عملاقة مع مكعبات ملونة',
        prompt: 'A giant Eisenhower matrix with colorful cubes in each quadrant, modern infographic design, priority management concept, clean professional layout, 3d visualization'
      },
      {
        id: 9,
        title: '💻 نظام المعرفة',
        description: 'مكتبة رقمية ضخمة مع كتب وشاشات متوهجة',
        prompt: 'A massive digital library with glowing books and screens, cyberpunk aesthetic, knowledge management concept, neon blue and purple lighting, futuristic interior'
      },
      {
        id: 10,
        title: '⏰ إدارة الوقت',
        description: 'ساعة ضخمة محاطة بدوائر زمنية منظمة',
        prompt: 'A massive clock surrounded by organized time circles, cosmic background, golden and blue colors, time management visualization, 3d render'
      }
    ],
    marketing: [
      {
        id: 11,
        title: '📱 المحتوى الرقمي',
        description: 'هاتف ضخم يطلق محتوى ملون نحو جمهور متحمس',
        prompt: 'A massive smartphone launching colorful content towards an excited audience, vibrant gradient background, digital marketing concept, 3d render'
      },
      {
        id: 12,
        title: '🎨 الهوية البصرية',
        description: 'لوحة ألوان عملاقة مع شعارات وأيقونات متناسقة',
        prompt: 'A giant color palette with harmonious logos and icons, professional elegant design, brand identity concept, clean layout, modern aesthetic'
      },
      {
        id: 13,
        title: '📈 معدلات التحويل',
        description: 'قمع مبيعات ثلاثي الأبعاد مضيء مع عملاء يتدفقون',
        prompt: 'A glowing 3d sales funnel with customers flowing through it, green success colors, conversion optimization concept, isometric view'
      },
      {
        id: 14,
        title: '🚀 الحملة الإعلانية',
        description: 'صاروخ إعلاني ينطلق نحو النجوم مع بيانات متوهجة',
        prompt: 'An advertising rocket launching towards the stars with glowing data and numbers around it, campaign success concept, vibrant colors, digital marketing theme'
      },
      {
        id: 15,
        title: '🤝 العلامة الشخصية',
        description: 'شخصية قوية محاطة بدائرة من الإنجازات والشهادات',
        prompt: 'A powerful figure surrounded by a circle of achievements and badges, heroic lighting, personal branding concept, professional photography'
      }
    ],
    technical: [
      {
        id: 16,
        title: '💻 تطوير البرمجيات',
        description: 'أكواد برمجية ثلاثية الأبعاد متوهجة تطفو في الفضاء',
        prompt: 'Glowing 3d code floating in cyberspace, cyberpunk colors, software development concept, matrix-style aesthetic, neon green and blue'
      },
      {
        id: 17,
        title: '🏗️ الأنظمة المعقدة',
        description: 'مخطط هندسي ضخم لنظام تقني معقد',
        prompt: 'A massive engineering blueprint of a complex tech system, blueprint style, blue background, system architecture visualization'
      },
      {
        id: 18,
        title: '🔐 الأمن السيبراني',
        description: 'درع رقمي ضخم يحمي بيانات متوهجة',
        prompt: 'A massive digital shield protecting glowing data, blue and silver colors, futuristic style, cybersecurity concept, 3d render'
      },
      {
        id: 19,
        title: '🤖 الذكاء الاصطناعي',
        description: 'دماغ آلي شفاف مع شبكات عصبية مضيئة',
        prompt: 'A transparent robotic brain with glowing neural networks, digital background, neon colors, AI and machine learning concept'
      }
    ],
    personal: [
      {
        id: 20,
        title: '🎯 الحياة المثالية',
        description: 'شخص يقف أمام بوابة ضخمة تؤدي إلى عالم أحلامه',
        prompt: 'A person standing before a massive gateway leading to their glowing dream world, inspiring sunset, life design concept, photorealistic'
      },
      {
        id: 21,
        title: '💪 الحضور القيادي',
        description: 'قائد واثق على منصة مرتفعة محاط بهالة ذهبية',
        prompt: 'A confident leader on an elevated platform surrounded by golden aura, admiring crowd below, leadership presence concept, dramatic lighting'
      },
      {
        id: 22,
        title: '💰 الحرية المالية',
        description: 'شجرة ذهبية ضخمة تنمو من عملات معدنية',
        prompt: 'A massive golden tree growing from coins, clear blue sky background, financial freedom symbolism, photorealistic'
      },
      {
        id: 23,
        title: '🧘 الصحة الشاملة',
        description: 'شخص يتأمل في وسط دائرة متوازنة من العناصر',
        prompt: 'A person meditating in the center of a balanced circle of elements (body, mind, spirit), peaceful lighting, holistic health concept'
      }
    ],
    saudi: [
      {
        id: 24,
        title: '🕌 معماري سعودي',
        description: 'مسجد بتصميم إسلامي حديث يجمع بين التراث والمعاصرة',
        prompt: 'A modern mosque with Islamic design blending heritage and contemporary style, Riyadh skyline background, golden sunset lighting, architectural photography'
      },
      {
        id: 25,
        title: '🏙️ الرياض 2050',
        description: 'مدينة الرياض المستقبلية مع ناطحات سحاب خضراء',
        prompt: 'Futuristic Riyadh city in 2050 with green eco-friendly skyscrapers, flying cars, sustainable urban design, Saudi Vision 2030 concept, photorealistic'
      }
    ]
  };

  const categories = [
    { id: 'all', name: 'الكل', icon: '📚', count: 25 },
    { id: 'innovation', name: 'الابتكار', icon: '🧠', count: 5 },
    { id: 'productivity', name: 'الإنتاجية', icon: '⚡', count: 5 },
    { id: 'marketing', name: 'التسويق', icon: '📱', count: 5 },
    { id: 'technical', name: 'التقني', icon: '💻', count: 4 },
    { id: 'personal', name: 'الشخصي', icon: '🎯', count: 4 },
    { id: 'saudi', name: 'سعودي', icon: '🇸🇦', count: 2 }
  ];

  // دمج القوالب حسب الفئة
  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') {
      return Object.values(imageTemplates).flat();
    }
    return imageTemplates[selectedCategory as keyof typeof imageTemplates] || [];
  };

  // قاموس ترجمة
  const arabicToEnglishDict: Record<string, string> = {
    'الرياض': 'Riyadh', 'جدة': 'Jeddah', 'مكة': 'Mecca', 'المدينة': 'Medina',
    'مدينة': 'city', 'مستقبلي': 'futuristic', 'حديث': 'modern', 'جميل': 'beautiful',
    'صحراء': 'desert', 'بحر': 'sea', 'جبل': 'mountain', 'سماء': 'sky',
    'غروب': 'sunset', 'شروق': 'sunrise', 'ليل': 'night', 'نهار': 'day',
    'بتصميم': 'with design', 'معماري': 'architectural', 'فني': 'artistic',
    'عام': 'year', 'في': 'in', 'من': 'of', 'مع': 'with'
  };

  const translateArabicToEnglish = (text: string): string => {
    let translated = text;
    Object.entries(arabicToEnglishDict).forEach(([ar, en]) => {
      const regex = new RegExp(ar, 'gi');
      translated = translated.replace(regex, en);
    });
    return translated.replace(/[\u064B-\u065F]/g, '').trim();
  };

  const evaluateQuality = (desc: string) => {
    const length = desc.trim().length;
    if (length >= 100) return { stars: 5, message: 'برومبت ممتاز!', color: 'emerald' };
    if (length >= 50) return { stars: 4, message: 'برومبت جيد جداً', color: 'blue' };
    return { stars: 3, message: 'برومبت مقبول', color: 'orange' };
  };

  const styleTemplates = {
    realistic: { name: '📸 واقعي', suffix: 'photorealistic, 8k uhd, high quality, detailed, professional photography, cinematic lighting' },
    artistic: { name: '🎨 فني', suffix: 'artistic, creative, vibrant colors, masterpiece, highly detailed, digital art' },
    cartoon: { name: '🎭 كرتوني', suffix: 'cartoon style, animated, colorful, playful, illustration' },
    '3d': { name: '🎲 3D', suffix: '3d render, octane render, unreal engine, highly detailed, volumetric lighting' },
    painting: { name: '🖼️ لوحة', suffix: 'oil painting, canvas, artistic brush strokes, masterpiece' }
  };

  const generateEnhancedPrompt = (input: string, style: string, ratio: string) => {
    const styleConfig = styleTemplates[style as keyof typeof styleTemplates];
    const translatedInput = translateArabicToEnglish(input);
    const basePrompt = `A detailed and stunning image of ${translatedInput}`;
    const ratioText = ratio === '16:9' ? 'wide cinematic composition' :
                     ratio === '9:16' ? 'vertical portrait composition' :
                     'square balanced composition';
    return `${basePrompt}, ${ratioText}, ${styleConfig.suffix}, best quality, award winning`.replace(/\s+/g, ' ').trim();
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('الرجاء إدخال وصف الصورة');
      return;
    }
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const prompt = generateEnhancedPrompt(description, selectedStyle, selectedRatio);
      setGeneratedPrompt(prompt);
      setPromptQuality(evaluateQuality(description));
      toast.success('✅ تم إنشاء البرومبت بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast.success('تم نسخ البرومبت!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('فشل النسخ');
    }
  };

  const handleReset = () => {
    setDescription('');
    setGeneratedPrompt('');
    setSelectedStyle('realistic');
    setSelectedRatio('1:1');
    setPromptQuality(null);
    toast.info('تم إعادة التعيين');
  };

  const applyTemplate = (template: any) => {
    setDescription(template.description);
    toast.success(`تم تطبيق قالب: ${template.title}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            مولد صور الذكاء الاصطناعي
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          اختر من 25 قالب احترافي جاهز، أو صمم برومبتك الخاص!
        </p>
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <Badge variant="secondary" className="px-4 py-2"><Sparkles className="w-4 h-4 ml-2" />✨ 25 قالب جاهز</Badge>
          <Badge variant="secondary" className="px-4 py-2"><Wand2 className="w-4 h-4 ml-2" />🎨 6 فئات</Badge>
          <Badge variant="secondary" className="px-4 py-2"><ImageIcon className="w-4 h-4 ml-2" />⚡ جودة عالية</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* القسم الرئيسي */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-600" />
                صف الصورة أو اختر قالباً جاهزاً
              </CardTitle>
              <CardDescription>اكتب وصفاً بالعربية أو اختر من القوالب الجاهزة أدناه</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, maxLength))}
                  placeholder="مثال: مشهد خيالي لمدينة الرياض في 2050..."
                  className="min-h-[150px] text-lg resize-none"
                  dir="rtl"
                />
                <div className="absolute bottom-3 left-3 text-sm text-muted-foreground">
                  {charCount}/{maxLength}
                </div>
              </div>

              <Tabs defaultValue="style">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="style">الأسلوب</TabsTrigger>
                  <TabsTrigger value="ratio">الأبعاد</TabsTrigger>
                </TabsList>
                <TabsContent value="style" className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(styleTemplates).map(([key, style]) => (
                      <Button key={key} variant={selectedStyle === key ? "default" : "outline"} onClick={() => setSelectedStyle(key)} className="h-auto py-3 transition-all hover:scale-105">
                        {style.name}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="ratio" className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {[['1:1', '◻️ 1:1'], ['16:9', '▭ 16:9'], ['9:16', '▯ 9:16']].map(([ratio, label]) => (
                      <Button key={ratio} variant={selectedRatio === ratio ? "default" : "outline"} onClick={() => setSelectedRatio(ratio)} className="h-auto py-3 transition-all hover:scale-105">
                        {label}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3">
                <Button onClick={handleGenerate} disabled={isGenerating || !description.trim()} className="flex-1 h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600">
                  {isGenerating ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />🎨 جاري التوليد...</>) : (<><Sparkles className="w-5 h-5 ml-2" />توليد البرومبت</>)}
                </Button>
                <Button onClick={handleReset} variant="outline" className="h-12"><RotateCcw className="w-5 h-5" /></Button>
              </div>
            </CardContent>
          </Card>

          {generatedPrompt && (
            <Card className="shadow-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-emerald-700"><Check className="w-5 h-5" />البرومبت المُحسّن</CardTitle>
                    {promptQuality && (<div className={`mt-2 text-sm text-${promptQuality.color}-700`}>{'⭐'.repeat(promptQuality.stars)} {promptQuality.message}</div>)}
                  </div>
                  <Button onClick={handleCopy} variant="outline" size="sm">{copied ? (<><Check className="w-4 h-4" />تم</>) : (<><Copy className="w-4 h-4" />نسخ</>)}</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4 border-2 border-emerald-200">
                  <p className="text-sm font-mono leading-relaxed" dir="ltr">{generatedPrompt}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* القسم الجانبي - مكتبة القوالب */}
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5" />📚 مكتبة القوالب (25)</CardTitle>
              <CardDescription>اختر فئة ثم قالباً جاهزاً</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* الفئات */}
              <div className="grid grid-cols-2 gap-2">
                {categories.map(cat => (
                  <Button key={cat.id} variant={selectedCategory === cat.id ? "default" : "outline"} onClick={() => setSelectedCategory(cat.id)} className="h-auto py-2 text-sm">
                    {cat.icon} {cat.name} ({cat.count})
                  </Button>
                ))}
              </div>

              {/* القوالب */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {getFilteredTemplates().map(template => (
                  <Button key={template.id} variant="outline" className="w-full h-auto py-3 px-3 text-right justify-start" onClick={() => applyTemplate(template)}>
                    <div className="flex flex-col items-start w-full">
                      <span className="font-semibold text-sm">{template.title}</span>
                      <span className="text-xs text-muted-foreground line-clamp-2">{template.description}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
