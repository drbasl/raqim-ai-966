import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { TrendingUp, Heart, Eye, Copy, Star, Code, Briefcase, FileText, Users, Scale, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface PopularPromptsProps {
  onUsePrompt?: (prompt: string) => void;
}

// البرومبتات الشهيرة المحلية
const popularPromptsData = [
  {
    id: 1,
    title: "مراجعة الكود البرمجي",
    description: "راجع الكود البرمجي وحدد الأخطاء والثغرات الأمنية",
    prompt: "راجع هذا الكود البرمجي وحدد الأخطاء والثغرات الأمنية واقترح تحسينات للأداء والجودة",
    category: "مطورين",
    rating: 95,
    usageCount: 2840,
    likesCount: 856,
    icon: <Code className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "خطة عمل سعودية",
    description: "أعد خطة عمل احترافية لمشروع في السوق السعودي",
    prompt: "أعد خطة عمل احترافية لمشروع في السوق السعودي تشمل: دراسة السوق، التحليل المالي، استراتيجية التسويق",
    category: "مشاريع",
    rating: 92,
    usageCount: 2145,
    likesCount: 645,
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "استراتيجية تسويق رقمي",
    description: "صمم استراتيجية تسويق رقمي شاملة للسوق السعودي",
    prompt: "صمم استراتيجية تسويق رقمي شاملة للسوق السعودي تشمل: وسائل التواصل، المحتوى، الإعلانات المدفوعة",
    category: "تسويق",
    rating: 94,
    usageCount: 3250,
    likesCount: 976,
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    id: 4,
    title: "كتابة محتوى سعودي",
    description: "اكتب محتوى تسويقياً جذاباً بأسلوب سعودي احترافي",
    prompt: "اكتب محتوى تسويقياً جذاباً بأسلوب سعودي احترافي لـ [المنتج] يناسب منصة [اسم المنصة]",
    category: "محتوى",
    rating: 91,
    usageCount: 2560,
    likesCount: 734,
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: 5,
    title: "دراسة جدوى",
    description: "أعد دراسة جدوى مفصلة لمشروع في المملكة",
    prompt: "أعد دراسة جدوى مفصلة لمشروع في المملكة تتضمن التكاليف، الإيرادات المتوقعة، وتحليل المخاطر",
    category: "مشاريع",
    rating: 93,
    usageCount: 1890,
    likesCount: 567,
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    id: 6,
    title: "وصف وظيفي سعودي",
    description: "أنشئ وصفاً وظيفياً احترافياً يتوافق مع معايير سوق العمل السعودي",
    prompt: "أنشئ وصفاً وظيفياً احترافياً لوظيفة [المسمى] يتوافق مع معايير سوق العمل السعودي ونظام العمل",
    category: "موارد بشرية",
    rating: 90,
    usageCount: 1456,
    likesCount: 432,
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: 7,
    title: "صياغة عقد احترافي",
    description: "صُغ عقد احترافي يتوافق مع الأنظمة السعودية",
    prompt: "صُغ عقد [نوع العقد] احترافي يتوافق مع الأنظمة السعودية ويحمي حقوق جميع الأطراف",
    category: "قانوني",
    rating: 92,
    usageCount: 1678,
    likesCount: 502,
    icon: <Scale className="w-5 h-5" />,
  },
  {
    id: 8,
    title: "تحليل المنافسين",
    description: "قم بتحليل شامل للمنافسين في قطاع معين بالسوق السعودي",
    prompt: "قم بتحليل شامل للمنافسين في قطاع [اسم القطاع] بالسوق السعودي مع تحديد نقاط القوة والضعف",
    category: "تسويق",
    rating: 91,
    usageCount: 2100,
    likesCount: 623,
    icon: <BarChart3 className="w-5 h-5" />,
  },
];

const categories = ["الكل", "مطورين", "مشاريع", "تسويق", "محتوى", "موارد بشرية", "قانوني"];

export default function PopularPrompts({ onUsePrompt }: PopularPromptsProps) {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const { data: prompts, isLoading } = trpc.popularPrompts.list.useQuery({ limit: 8 });

  const useMutation = trpc.popularPrompts.use.useMutation();
  const likeMutation = trpc.popularPrompts.like.useMutation({
    onSuccess: () => {
      toast.success("شكراً لإعجابك!");
    },
  });

  const handleCopy = async (prompt: string) => {
    await navigator.clipboard.writeText(prompt);
    toast.success("تم نسخ البرومبت!");
  };

  const handleUse = (id: number, prompt: string) => {
    useMutation.mutate({ id });
    if (onUsePrompt) {
      onUsePrompt(prompt);
      // Scroll to generator
      const generator = document.getElementById("generator");
      generator?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLike = (id: number) => {
    likeMutation.mutate({ id });
  };

  // تصفية البرومبتات المحلية
  const filteredPopularData = activeCategory === "الكل" 
    ? popularPromptsData 
    : popularPromptsData.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* فلاتر التصنيفات */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* البرومبتات الشهيرة */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">البرومبتات الشائعة في المجتمع</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPopularData.map((item) => (
            <Card
              key={item.id}
              className="p-6 bg-card/50 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg group"
            >
              <div className="space-y-4">
                {/* Header مع Icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-primary">{item.icon}</div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">{(item.rating / 10).toFixed(1)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.usageCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    <span>{item.likesCount.toLocaleString()}</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    {item.category}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.prompt}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUse(item.id, item.prompt)}
                  >
                    <TrendingUp className="ml-2 w-4 h-4" />
                    استخدم الآن
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(item.prompt)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLike(item.id)}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* البرومبتات من قاعدة البيانات (إن وجدت) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse bg-card/50">
              <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </Card>
          ))}
        </div>
      ) : prompts && prompts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">برومبتات مميزة من المستخدمين</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prompts.map((prompt) => (
        <Card
          key={prompt.id}
          className="p-6 bg-card/50 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg group"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {prompt.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{(prompt.rating / 10).toFixed(1)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{prompt.usageCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                <span>{prompt.likesCount.toLocaleString()}</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                {prompt.category}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {prompt.prompt}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => handleUse(prompt.id, prompt.prompt)}
              >
                <TrendingUp className="ml-2 w-4 h-4" />
                استخدم الآن
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(prompt.prompt)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLike(prompt.id)}
                disabled={likeMutation.isPending}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
