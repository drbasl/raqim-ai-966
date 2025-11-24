import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Moon, Sun, Menu, Wand2, LayoutGrid, Target, ArrowLeft, Library, FileText, BookOpen, Users, TrendingUp, ClipboardList, ImageIcon } from "lucide-react";
import PromptGenerator from "@/components/PromptGenerator";
import TemplateLibrary, { Template } from "@/components/TemplateLibrary";
import SpecializedTemplates from "@/components/SpecializedTemplates";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import { useTheme } from "@/contexts/ThemeContext";
import { useOnboardingTour } from "@/components/OnboardingTour";
import { trpc } from "@/lib/trpc";
import LanguageToggle from "@/components/LanguageToggle";
import { useTranslation } from 'react-i18next';
import MobileBottomNav from "@/components/MobileBottomNav";

export default function Home() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generatorKey, setGeneratorKey] = useState(0);
  const [activeTab, setActiveTab] = useState("generator");

  // تفعيل الجولة التعريفية
  useOnboardingTour();

  const scrollToGenerator = () => {
    const element = document.getElementById('generator');
    element?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab("generator");
  };

  // Increment usage mutation
  const incrementUsageMutation = trpc.templates.incrementUsage.useMutation();

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setActiveTab("generator");
    scrollToGenerator();
    // Increment usage count
    incrementUsageMutation.mutate({ templateId: template.id });
  };

  const handleSpecializedTemplateSelect = (template: { title: string; basePrompt: string; usageType: "social" | "code" | "education" | "crypto" | "article" | "exam" }) => {
    // Convert specialized template to regular template format
    const convertedTemplate: Template = {
      id: template.title.toLowerCase().replace(/\s+/g, '-'),
      title: template.title,
      description: template.basePrompt,
      icon: <Sparkles className="w-6 h-6" />,
      basePrompt: template.basePrompt,
      usageType: template.usageType,
      options: {
        humanTone: false,
        examples: false,
        keyPoints: false,
        complexity: "متوسط" as const,
        engaging: false,
      }
    };
    setSelectedTemplate(convertedTemplate);
    setGeneratorKey(prev => prev + 1);
    setActiveTab("generator");
    scrollToGenerator();
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img src="/raqim-logo-animated.svg" alt="raqim logo" style={{ width: 40, height: 40, marginInlineEnd: 8, verticalAlign: 'middle' }} />
              <span className="font-bold text-primary hidden sm:inline" style={{ fontSize: '1.15rem', verticalAlign: 'middle' }}>رقيم AI 966</span>
            </div>

            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <a href="#generator" className="text-sm hover:text-primary transition-colors">
                {t('nav.generator')}
              </a>
              <a href="/worksheets" className="text-sm hover:text-primary transition-colors">
                {t('nav.worksheets')}
              </a>

              {/* Language Toggle */}
              <LanguageToggle />

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-primary/10 rounded-lg transition-all duration-300 group"
                aria-label="تبديل الوضع"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-primary group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="w-5 h-5 text-primary group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <a href="#generator" className="text-base hover:text-primary transition-colors py-2">
                      {t('nav.generator')}
                    </a>
                    <a href="/worksheets" className="text-base hover:text-primary transition-colors py-2">
                      {t('nav.worksheets')}
                    </a>
                    <div className="border-t border-border my-2" />
                    <div className="py-2">
                      <LanguageToggle />
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2 text-base hover:text-primary transition-colors py-2"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="w-5 h-5" />
                          الوضع الفاتح
                        </>
                      ) : (
                        <>
                          <Moon className="w-5 h-5" />
                          الوضع الداكن
                        </>
                      )}
                    </button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - Simplified */}
      <section className="hero-new hero-section">
        <div className="decorative-shape shape-1"></div>
        <div className="decorative-shape shape-2"></div>

        <div className="hero-content-new">
          {/* شعار الهوية البصرية الجديد */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
            <img src="/raqim-logo-animated.svg" alt="raqim logo" style={{ maxWidth: 220, width: '100%', height: 'auto', marginBottom: '0.5rem' }} />
            <div className="logo-text" style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#0099FF', marginTop: '0.5rem' }}>رقيم AI 966</div>
            <div className="version" style={{ fontSize: '0.9rem', color: '#888' }}>v1.0 الإصدار</div>
          </div>

          {/* العنوان الرئيسي */}
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.1rem)', fontWeight: 800, lineHeight: 1.2, textAlign: 'center', marginBottom: '0.5rem' }}>
            حوّل أفكارك إلى <span className="highlight">برومبتات احترافية</span>
          </h1>

          {/* الوصف المختصر */}
          <p className="description-new text-sm md:text-base">
            أداة ذكية تساعدك على إنشاء برومبتات فعّالة لـ ChatGPT و Claude و Gemini وغيرها
          </p>

          {/* إحصائية سريعة */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 my-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-2xl font-bold text-primary">+10K</span>
              <span>برومبت تم إنشاؤه</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-border"></div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-2xl font-bold text-primary">100%</span>
              <span>مجاني</span>
            </div>
          </div>

          {/* زر CTA واحد قوي */}
          <div className="cta-buttons">
            <button onClick={scrollToGenerator} className="btn-new btn-primary-new text-sm sm:text-lg px-4 sm:px-8 py-2 sm:py-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>ابدأ الآن مجاناً</span>
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* شارات المزايا */}
          <div className="features-preview features-badges mt-4 sm:mt-8 gap-2 sm:gap-3">
            <div className="feature-badge text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
              <span className="icon text-base sm:text-lg">🎯</span>
              <span>نتائج احترافية</span>
            </div>
            <div className="feature-badge text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
              <span className="icon text-base sm:text-lg">🇸🇦</span>
              <span>100% سعودي</span>
            </div>
            <div className="feature-badge text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
              <span className="icon text-base sm:text-lg">⚡</span>
              <span>سريع ودقيق</span>
            </div>
          </div>
          {/* أدوات الذكاء الاصطناعي */}
          <div className="ai-tools-bar" style={{ marginTop: 'clamp(1rem, 5vw, 2.5rem)', marginBottom: '1.5rem' }}>
            <div style={{ textAlign: 'center', color: '#a8a8a8', fontSize: 'clamp(0.875rem, 3vw, 1.1rem)', marginBottom: '0.7rem', fontWeight: 500 }}>
              صمم برومبتات احترافية لأدوات الذكاء الاصطناعي
            </div>
            <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 1.2rem)', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'HUMAIN', icon: '🤖' },
                { label: 'Claude', icon: '🧠' },
                { label: 'Gemini', icon: '✨' },
                { label: 'ChatGPT', icon: '💬' }
              ].map(({ label, icon }) => (
                <div
                  key={label}
                  style={{
                    background: 'var(--ai-btn-bg, #fff)',
                    borderRadius: '12px',
                    boxShadow: '0 1px 6px #0001',
                    padding: 'clamp(0.4rem, 2vw, 0.7rem) clamp(0.8rem, 3vw, 1.5rem)',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: 'clamp(0.75rem, 2.5vw, 1.1rem)',
                    border: '1px solid #eee',
                    minWidth: 'clamp(80px, 20vw, 120px)',
                    justifyContent: 'center',
                    color: 'var(--ai-btn-color, #222)',
                    transition: 'background 0.2s, color 0.2s',
                    gap: '0.5rem',
                  }}
                  className="ai-tool-btn"
                >
                  <span style={{ fontSize: 'clamp(1rem, 3vw, 1.3rem)', marginInlineEnd: '0.3rem' }}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section id="quick-access" className="py-8 md:py-12 bg-gradient-to-b from-background to-muted/30">
        <div className="container px-3 md:px-4">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
              🚀 استكشف أدواتنا المميزة
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              مجموعة من الأدوات الاحترافية لتعزيز إنتاجيتك
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {/* البرومبتات الاحترافية */}
            <a
              href="/professional-prompts"
              className="group p-3 md:p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-center"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Library className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-xs md:text-sm mb-1 line-clamp-1">البرومبتات الاحترافية</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground">25 برومبت</p>
            </a>

            {/* مولد أوراق العمل */}
            <a
              href="/worksheets"
              className="group p-3 md:p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-center"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-xs md:text-sm mb-1 line-clamp-1">مولد أوراق العمل</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground">أوراق تعليمية</p>
            </a>

            {/* قوالب أوراق العمل */}
            <a
              href="/worksheet-templates"
              className="group p-3 md:p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-center"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClipboardList className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-xs md:text-sm mb-1 line-clamp-1">قوالب أوراق العمل</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground">30+ قالب</p>
            </a>

            {/* محلل البرومبتات */}
            <a
              href="/analyzer"
              className="group p-3 md:p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-center"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-xs md:text-sm mb-1 line-clamp-1">محلل البرومبتات</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground">حلل وحسّن</p>
            </a>

            {/* مكتبة القوالب */}
            <a
              href="/templates"
              className="group p-3 md:p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-center"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
              </div>
              <h3 className="font-semibold text-xs md:text-sm mb-1 line-clamp-1">مكتبة القوالب</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground">قوالب متنوعة</p>
            </a>

            {/* البرومبتات الشعبية */}
            <a
              href="/popular"
              className="group p-3 md:p-4 rounded-xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-center"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-rose-500" />
              </div>
              <h3 className="font-semibold text-xs md:text-sm mb-1 line-clamp-1">البرومبتات الشعبية</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground">الأكثر استخداماً</p>
            </a>
          </div>
        </div>
      </section>

      {/* Image Prompt Generator Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  توليد أوامر الصور المجاني
                </h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">
                حول أفكارك إلى أوامر صور احترافية للذكاء الاصطناعي
              </p>
            </div>

            {/* Image Generator Card */}
            <div className="bg-card border border-border/50 rounded-xl p-4 sm:p-6 md:p-8">
              {/* Description */}
              <p className="text-muted-foreground text-xs sm:text-sm mb-4 leading-relaxed">
                هل تريغب في تحويل أفكارك إلى وصف دقيق ومفصل لصورة مذهلة؟ بقوة AI، نحتك القوة الكاملة لاستخلال إمكانيات توليد الصور.
              </p>

              {/* Input Area */}
              <div className="space-y-3">
                <Textarea
                  placeholder="صف الصورة التي تريد إنشاؤها..."
                  className="resize-none text-xs sm:text-sm min-h-32 sm:min-h-40"
                  maxLength={500}
                />
                <div className="text-right text-xs text-muted-foreground">
                  <span id="char-count">0</span>/500
                </div>
              </div>

              {/* Generate Button */}
              <Button className="w-full mt-4 gap-2 h-9 sm:h-10 text-xs sm:text-sm">
                <ImageIcon className="w-4 h-4" />
                توليد أمر الصورة
              </Button>

              {/* Info */}
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-3 text-center">
                ✨ تحسين الصورة بتقنيات الذكاء الاصطناعي
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                🇸🇦 من المملكة... للعالم العربي
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-primary mb-2 sm:mb-3">
                نحول أفكارك إلى برومبتات احترافية
              </p>
            </div>

            {/* Main Content */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base md:text-lg leading-relaxed">
              {/* Intro */}
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">رقيم AI 966</span> هي منصة سعودية متخصصة في هندسة البرومبتات والذكاء الاصطناعي.
              </p>

              {/* Story */}
              <div className="bg-card border border-primary/10 rounded-lg p-4 sm:p-5 md:p-6">
                <p className="text-muted-foreground">
                  ولدت الفكرة من تحدٍ بسيط: كيف نجعل التعامل مع الذكاء الاصطناعي سهلاً، احترافياً، وفعالاً لكل مستخدم عربي؟
                </p>
              </div>

              {/* What We Do */}
              <div>
                <p className="font-semibold text-foreground mb-3">اليوم، نخدم آلاف المستخدمين في:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2 items-start">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>إنشاء برومبتات احترافية خلال ثوانٍ</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>تحليل وتحسين جودة البرومبتات</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>الوصول لمكتبة قوالب جاهزة ومتجددة</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>التعلم من أوراق العمل التعليمية</span>
                  </li>
                </ul>
              </div>

              {/* Mission */}
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 sm:p-5 md:p-6 border border-primary/20">
                <p className="text-foreground font-semibold mb-2">رقيم 966 ليست مجرد أداة...</p>
                <p className="text-muted-foreground">
                  إنها شريكك في رحلتك مع الذكاء الاصطناعي.
                </p>
              </div>

              {/* Vision & Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-card border border-border/50 rounded-lg p-4">
                  <p className="font-semibold text-foreground text-center">🎯 رؤيتنا</p>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center mt-2">
                    أن نكون المرجع العربي الأول في هندسة البرومبتات
                  </p>
                </div>
                <div className="bg-card border border-border/50 rounded-lg p-4">
                  <p className="font-semibold text-foreground text-center">💚 مبدأنا</p>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center mt-2">
                    مجاني 100% وسيبقى كذلك
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generator Section with Tabs */}
      <section id="generator" className="py-16 bg-card/30 prompt-generator">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                أنشئ برومبتك المثالي
              </h2>
              <p className="text-muted-foreground text-lg">
                اختر الطريقة المناسبة لك: اكتب من الصفر أو استخدم قالباً جاهزاً
              </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1">
                <TabsTrigger value="generator" className="flex items-center gap-2 py-3">
                  <Wand2 className="w-4 h-4" />
                  <span className="hidden sm:inline">مولد مخصص</span>
                  <span className="sm:hidden">مخصص</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2 py-3">
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">قوالب جاهزة</span>
                  <span className="sm:hidden">قوالب</span>
                </TabsTrigger>
                <TabsTrigger value="specialized" className="flex items-center gap-2 py-3">
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">قوالب متخصصة</span>
                  <span className="sm:hidden">متخصصة</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generator" className="mt-0">
                <PromptGenerator
                  key={generatorKey}
                  initialPrompt={selectedTemplate?.basePrompt}
                  initialUsageType={selectedTemplate?.usageType}
                  initialOptions={selectedTemplate?.options}
                />
              </TabsContent>

              <TabsContent value="templates" className="mt-0">
                <TemplateLibrary onSelectTemplate={handleTemplateSelect} compact />
              </TabsContent>

              <TabsContent value="specialized" className="mt-0">
                <SpecializedTemplates onSelectTemplate={handleSpecializedTemplateSelect} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Social Proof Section - Combined */}
      <section id="social-proof" className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              موثوق من آلاف المستخدمين
            </h2>
            <p className="text-muted-foreground text-lg">
              انضم إلى مجتمع رقيم AI واستفد من تجارب الآخرين
            </p>
          </div>

          {/* Testimonials */}
          <Testimonials />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16">
        <div className="container max-w-4xl">
          <FAQ />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-muted/20">
        <div className="container">
        <MobileBottomNav />
          <div className="text-center space-y-6">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2">
              <img src="/raqim-logo-animated.svg" alt="raqim logo" style={{ width: 48, height: 48, marginInlineEnd: 8 }} />
              <span className="font-bold text-primary" style={{ fontSize: '1.2rem' }}>رقيم AI 966</span>
            </div>

            {/* Quick Links */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <a href="/analyzer" className="hover:text-primary transition-colors">محلل البرومبتات</a>
              <span>•</span>
              <a href="/worksheets" className="hover:text-primary transition-colors">أوراق العمل</a>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
                onClick={() => window.open('https://t.me/dr_basl', '_blank')}
              >
                <Send className="w-4 h-4" />
                تيليجرام
              </Button>
              <Button
                variant="default"
                size="sm"
                className="gap-2"
                onClick={() => window.open('https://x.com/hzbr_al?s=21', '_blank')}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                تويتر
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>رقيم AI 966 © 2025 | الذكاء الاصطناعي السعودي</p>
              <p className="mt-1 text-xs text-primary/70">RaqimAI 966 – v1.0</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
