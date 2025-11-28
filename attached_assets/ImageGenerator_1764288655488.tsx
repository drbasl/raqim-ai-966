import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Wand2, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageGenerator() {
  const [description, setDescription] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedRatio, setSelectedRatio] = useState('1:1');

  const maxLength = 500;
  const charCount = description.length;

  // أمثلة سريعة
  const quickExamples = [
    {
      title: '🏙️ مدينة مستقبلية',
      description: 'مدينة الرياض في عام 2050 بتصميم مستقبلي'
    },
    {
      title: '🌅 منظر طبيعي',
      description: 'غروب الشمس في صحراء الربع الخالي'
    },
    {
      title: '🕌 معماري',
      description: 'مسجد بتصميم إسلامي حديث'
    },
    {
      title: '🎨 فني',
      description: 'لوحة فنية تعبر عن التراث السعودي'
    }
  ];

  // قوالب الأنماط
  const styleTemplates = {
    realistic: {
      name: 'واقعي',
      suffix: 'photorealistic, 8k uhd, high quality, detailed, professional photography, cinematic lighting'
    },
    artistic: {
      name: 'فني',
      suffix: 'artistic, creative, vibrant colors, masterpiece, highly detailed, digital art'
    },
    cartoon: {
      name: 'كرتوني',
      suffix: 'cartoon style, animated, colorful, playful, illustration, digital art'
    },
    '3d': {
      name: '3D',
      suffix: '3d render, octane render, unreal engine, highly detailed, volumetric lighting'
    },
    painting: {
      name: 'لوحة',
      suffix: 'oil painting, canvas, artistic brush strokes, masterpiece, museum quality'
    }
  };

  // دالة توليد البرومبت المحسّن
  const generateEnhancedPrompt = (input: string, style: string, ratio: string) => {
    const styleConfig = styleTemplates[style as keyof typeof styleTemplates];
    
    // ترجمة بسيطة أو تحسين الوصف
    // في الإنتاج، يمكن استخدام API للترجمة أو LLM
    
    const basePrompt = `A detailed and stunning image of: ${input}`;
    
    const ratioText = ratio === '16:9' ? 'wide cinematic composition' :
                     ratio === '9:16' ? 'vertical portrait composition' :
                     'square balanced composition';
    
    const enhancedPrompt = `${basePrompt}, ${ratioText}, ${styleConfig.suffix}, best quality, highly detailed, professional, stunning, award winning`;
    
    return enhancedPrompt;
  };

  // دالة التوليد الرئيسية
  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('الرجاء إدخال وصف الصورة');
      return;
    }

    setIsGenerating(true);
    
    try {
      // محاكاة تأخير API (1.5 ثانية)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const prompt = generateEnhancedPrompt(description, selectedStyle, selectedRatio);
      setGeneratedPrompt(prompt);
      
      toast.success('تم إنشاء البرومبت بنجاح!');
    } catch (error) {
      toast.error('حدث خطأ في التوليد');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // دالة النسخ
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

  // دالة تطبيق مثال سريع
  const applyExample = (example: typeof quickExamples[0]) => {
    setDescription(example.description);
  };

  // دالة إعادة التعيين
  const handleReset = () => {
    setDescription('');
    setGeneratedPrompt('');
    setSelectedStyle('realistic');
    setSelectedRatio('1:1');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12 animate-fadeIn">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            مولد صور الذكاء الاصطناعي
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          حوّل أفكارك إلى صور احترافية بدقة متناهية! صف ما تريد، واحصل على برومبت محسّن جاهز للاستخدام.
        </p>
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Sparkles className="w-4 h-4 ml-2" />
            برومبتات احترافية
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Wand2 className="w-4 h-4 ml-2" />
            5 أنماط فنية
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <ImageIcon className="w-4 h-4 ml-2" />
            جودة عالية
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* القسم الرئيسي - الإدخال */}
        <div className="lg:col-span-2 space-y-6">
          {/* بطاقة الإدخال */}
          <Card className="shadow-xl border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-indigo-600" />
                صف الصورة التي تريدها
              </CardTitle>
              <CardDescription>
                اكتب وصفاً تفصيلياً للصورة بالعربية، وسنحوله إلى برومبت احترافي بالإنجليزية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, maxLength))}
                  placeholder="مثال: مشهد خيالي لمدينة الرياض في عام 2050، بناطحات سحاب مستقبلية متلألئة، مع طائرات طائرة في السماء، إضاءة غروب الشمس الذهبية..."
                  className="min-h-[200px] text-lg resize-none"
                  dir="rtl"
                />
                <div className="absolute bottom-3 left-3 text-sm text-muted-foreground">
                  {charCount}/{maxLength}
                </div>
              </div>

              {/* خيارات متقدمة */}
              <Tabs defaultValue="style" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="style">الأسلوب الفني</TabsTrigger>
                  <TabsTrigger value="ratio">نسبة الأبعاد</TabsTrigger>
                </TabsList>
                
                <TabsContent value="style" className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(styleTemplates).map(([key, style]) => (
                      <Button
                        key={key}
                        variant={selectedStyle === key ? "default" : "outline"}
                        onClick={() => setSelectedStyle(key)}
                        className="h-auto py-3"
                      >
                        {style.name}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="ratio" className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {['1:1', '16:9', '9:16'].map((ratio) => (
                      <Button
                        key={ratio}
                        variant={selectedRatio === ratio ? "default" : "outline"}
                        onClick={() => setSelectedRatio(ratio)}
                        className="h-auto py-3"
                      >
                        {ratio}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    1:1 = مربع • 16:9 = عريض • 9:16 = عمودي
                  </p>
                </TabsContent>
              </Tabs>

              {/* أزرار التحكم */}
              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !description.trim()}
                  className="flex-1 h-12 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 ml-2" />
                      توليد البرومبت
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="h-12"
                >
                  إعادة
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* بطاقة النتيجة */}
          {generatedPrompt && (
            <Card className="shadow-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 animate-slideUp">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-emerald-700">
                    <Check className="w-5 h-5" />
                    البرومبت المُحسّن
                  </CardTitle>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        تم النسخ
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        نسخ
                      </>
                    )}
                  </Button>
                </div>
                <CardDescription>
                  استخدم هذا البرومبت مع Midjourney أو DALL-E أو Stable Diffusion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4 border-2 border-emerald-200">
                  <p className="text-sm font-mono leading-relaxed" dir="ltr">
                    {generatedPrompt}
                  </p>
                </div>
                
                {/* نصائح الاستخدام */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 نصائح الاستخدام:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• انسخ البرومبت والصقه في Midjourney أو DALL-E</li>
                    <li>• يمكنك تعديل البرومبت حسب حاجتك</li>
                    <li>• جرّب أنماط وأبعاد مختلفة للنتائج الأفضل</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* القسم الجانبي - الأمثلة */}
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">⚡ أمثلة سريعة</CardTitle>
              <CardDescription>اضغط لتطبيق المثال</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickExamples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4 text-right"
                  onClick={() => applyExample(example)}
                >
                  <div className="flex flex-col items-start w-full">
                    <span className="font-semibold">{example.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {example.description}
                    </span>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* معلومات إضافية */}
          <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-lg">📚 دليل الاستخدام</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold mb-1">1. اكتب الوصف</h4>
                <p className="text-muted-foreground">صف الصورة بالتفصيل بالعربية</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">2. اختر الأسلوب</h4>
                <p className="text-muted-foreground">حدد النمط الفني المناسب</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">3. اختر الأبعاد</h4>
                <p className="text-muted-foreground">حدد نسبة أبعاد الصورة</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">4. ولّد وانسخ</h4>
                <p className="text-muted-foreground">احصل على البرومبت المحسّن</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
