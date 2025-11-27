import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Copy, RefreshCw, Loader2, Save, Share2, FileText, Code, Palette, TrendingUp, BookOpen, MessageSquare } from "lucide-react";
import { Twitter, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import ExportMenu from "./ExportMenu";
import ShareWebsiteButton from "./ShareWebsiteButton";
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

interface PromptGeneratorProps {
  initialPrompt?: string;
  initialUsageType?: "social" | "code" | "education" | "crypto" | "article" | "exam";
  initialOptions?: {
    humanTone: boolean;
    examples: boolean;
    keyPoints: boolean;
    complexity: "بسيط" | "متوسط" | "متقدم";
    engaging: boolean;
  };
}

export default function PromptGenerator({ 
  initialPrompt, 
  initialUsageType, 
  initialOptions 
}: PromptGeneratorProps = {}) {
  const { t } = useTranslation();
  const [basePrompt, setBasePrompt] = useState(initialPrompt || "");
  const [usageType, setUsageType] = useState<"social" | "code" | "education" | "crypto" | "article" | "exam">(initialUsageType || "social");
  const [options, setOptions] = useState(initialOptions || {
    humanTone: false,
    examples: false,
    keyPoints: false,
    complexity: "متوسط" as "بسيط" | "متوسط" | "متقدم",
    engaging: false,
  });
  const [isAnimating, setIsAnimating] = useState(false);

  // Update state when props change
  useEffect(() => {
    if (initialPrompt) setBasePrompt(initialPrompt);
    if (initialUsageType) setUsageType(initialUsageType);
    if (initialOptions) setOptions(initialOptions);
  }, [initialPrompt, initialUsageType, initialOptions]);

  const generateMutation = trpc.prompt.generate.useMutation({
    onSuccess: (data) => {
      toast.success("تم توليد البرومبت بنجاح!");
    },
    onError: (error) => {
      toast.error("حدث خطأ في توليد البرومبت");
      console.error(error);
    },
  });

  const handleGenerate = () => {
    if (!basePrompt.trim()) {
      toast.error("الرجاء كتابة البرومبت الأساسي");
      return;
    }
    if (!usageType) {
      toast.error("الرجاء اختيار نوع الاستخدام");
      return;
    }

    if (usageType) {
      generateMutation.mutate({
        basePrompt,
        usageType,
        options,
      });
    }
  };

  const handleCopy = async () => {
    if (generateMutation.data?.enhancedPrompt) {
      await navigator.clipboard.writeText(generateMutation.data.enhancedPrompt);
      toast.success("تم نسخ البرومبت!");
    }
  };

  const handleRegenerate = () => {
    if (basePrompt && usageType) {
      generateMutation.mutate({
        basePrompt,
        usageType,
        options,
      });
    }
  };

  const savePromptMutation = trpc.savedPrompts.create.useMutation({
    onSuccess: () => {
      toast.success("تم حفظ البرومبت في مكتبتك الشخصية!");
    },
    onError: () => {
      toast.error("حدث خطأ في حفظ البرومبت");
    },
  });

  const handleSave = () => {
    if (generateMutation.data?.enhancedPrompt) {
      const title = basePrompt.slice(0, 50) + (basePrompt.length > 50 ? "..." : "");
      savePromptMutation.mutate({
        title,
        basePrompt,
        enhancedPrompt: generateMutation.data.enhancedPrompt,
        usageType,
      });
    }
  };

  return (
    <Card className="p-6 md:p-8 neon-glow bg-card border-primary/30">
      <div className="space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold neon-text">
            ⚡ من فكرة بسيطة إلى برومبت احترافي
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            أخبرنا بما تريد، ودعنا نصنع لك البرومبت المثالي<br />
            اختر نوع المهمة، أضف تفاصيلك، واحصل على نتيجة احترافية خلال ثوانٍ ⚡
          </p>
        </div>

        {/* Quick Examples */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>جرّب الأمثلة السريعة:</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 quick-examples">
            {/* مقال تقني */}
            <button
              onClick={() => {
                setIsAnimating(true);
                setBasePrompt("اكتب مقالاً شاملاً عن الذكاء الاصطناعي في التعليم");
                setUsageType("article");
                toast.success("تم تعبئة المثال! ⚡");
                setTimeout(() => setIsAnimating(false), 400);
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <FileText className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="text-sm font-semibold">📝 مقال تقني</div>
                <div className="text-xs text-muted-foreground">كتابة محتوى</div>
              </div>
            </button>

            {/* كود برمجي */}
            <button
              onClick={() => {
                setBasePrompt("اكتب دالة Python لحساب الأعداد الأولية");
                setUsageType("code");
                toast.success("تم تعبئة المثال! ⚡");
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <Code className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="text-sm font-semibold">💻 كود برمجي</div>
                <div className="text-xs text-muted-foreground">برمجة</div>
              </div>
            </button>

            {/* تصميم شعار */}
            <button
              onClick={() => {
                setBasePrompt("اقترح 5 أفكار لشعار شركة تقنية");
                setUsageType("article");
                toast.success("تم تعبئة المثال! ⚡");
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <Palette className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="text-sm font-semibold">🎨 تصميم شعار</div>
                <div className="text-xs text-muted-foreground">تصميم</div>
              </div>
            </button>

            {/* تسويق */}
            <button
              onClick={() => {
                setBasePrompt("اكتب حملة تسويقية لمنتج تقني جديد");
                setUsageType("social");
                toast.success("تم تعبئة المثال! ⚡");
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <TrendingUp className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="text-sm font-semibold">📈 تسويق</div>
                <div className="text-xs text-muted-foreground">إعلانات</div>
              </div>
            </button>

            {/* تعليم */}
            <button
              onClick={() => {
                setBasePrompt("اشرح مفهوم البلوكتشين بطريقة مبسطة");
                setUsageType("education");
                toast.success("تم تعبئة المثال! ⚡");
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <BookOpen className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="text-sm font-semibold">📚 تعليم</div>
                <div className="text-xs text-muted-foreground">شرح مبسط</div>
              </div>
            </button>

            {/* سوشيال ميديا */}
            <button
              onClick={() => {
                setBasePrompt("اكتب 10 تغريدات جذابة عن الذكاء الاصطناعي");
                setUsageType("social");
                toast.success("تم تعبئة المثال! ⚡");
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <MessageSquare className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="text-sm font-semibold">📱 سوشيال ميديا</div>
                <div className="text-xs text-muted-foreground">تغريدات</div>
              </div>
            </button>
          </div>
        </div>

        {/* Base Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="base-prompt" className="text-base font-semibold">
            {t('generator.inputLabel')}
          </Label>
          <Textarea
            id="base-prompt"
            placeholder={t('generator.inputPlaceholder')}
            value={basePrompt}
            onChange={(e) => setBasePrompt(e.target.value)}
            className={`min-h-[120px] text-base resize-none bg-input border-primary/20 focus:border-primary/50 ${isAnimating ? 'animate-fill-pulse' : ''}`}
          />
        </div>

        {/* Usage Type */}
        <div className="space-y-2">
          <Label htmlFor="usage-type" className="text-base font-semibold">
            {t('generator.usageType')}
          </Label>
          <Select value={usageType} onValueChange={(value) => setUsageType(value as typeof usageType)}>
            <SelectTrigger id="usage-type" className="bg-input border-primary/20">
              <SelectValue placeholder={t('generator.usageType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="social">{t('usageTypes.social')}</SelectItem>
              <SelectItem value="code">{t('usageTypes.code')}</SelectItem>
              <SelectItem value="education">{t('usageTypes.education')}</SelectItem>
              <SelectItem value="crypto">{t('usageTypes.crypto')}</SelectItem>
              <SelectItem value="article">{t('usageTypes.article')}</SelectItem>
              <SelectItem value="exam">{t('usageTypes.exam')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">{t('generator.options')}</Label>
          
          <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-primary/10">
            <div className="flex items-center gap-3">
              <Checkbox
                id="human-tone"
                checked={options.humanTone}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, humanTone: checked as boolean })
                }
              />
              <Label htmlFor="human-tone" className="cursor-pointer font-normal">
                {t('generator.humanTone')}
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="examples"
                checked={options.examples}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, examples: checked as boolean })
                }
              />
              <Label htmlFor="examples" className="cursor-pointer font-normal">
                {t('generator.examples')}
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="key-points"
                checked={options.keyPoints}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, keyPoints: checked as boolean })
                }
              />
              <Label htmlFor="key-points" className="cursor-pointer font-normal">
                {t('generator.keyPoints')}
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="engaging"
                checked={options.engaging}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, engaging: checked as boolean })
                }
              />
              <Label htmlFor="engaging" className="cursor-pointer font-normal">
                {t('generator.engaging')}
              </Label>
            </div>

            {/* Complexity Level */}
            <div className="pt-2 space-y-2">
              <Label className="text-sm font-semibold">{t('generator.complexity')}</Label>
              <div className="flex gap-2">
                {(["بسيط", "متوسط", "متقدم"] as const).map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={options.complexity === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOptions({ ...options, complexity: level })}
                    className="flex-1"
                  >
                    {t(`complexity.${level === 'بسيط' ? 'simple' : level === 'متوسط' ? 'medium' : 'advanced'}`)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          size="lg"
          className="w-full text-lg py-6 neon-glow hover:shadow-lg hover:shadow-primary/50 transition-all"
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="ml-2 w-5 h-5 animate-spin" />
              {t('generator.generating')}
            </>
          ) : (
            <>
              <Sparkles className="ml-2 w-5 h-5" />
              {t('generator.generate')}
            </>
          )}
        </Button>

        {/* Result Box */}
        {generateMutation.data && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Label className="text-base font-semibold">{t('generator.result')}</Label>
            <div className="relative">
              <div className="bg-muted/50 p-4 rounded-lg border border-primary/30 min-h-[150px] max-h-[400px] overflow-y-auto">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {generateMutation.data.enhancedPrompt}
                </p>
              </div>
              
              <div className="space-y-2 mt-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                    onClick={handleCopy}
                  >
                    <Copy className="ml-2 w-4 h-4" />
                    نسخ
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                    onClick={handleSave}
                    disabled={savePromptMutation.isPending}
                  >
                    <Save className="ml-2 w-4 h-4" />
                    حفظ
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                    onClick={handleRegenerate}
                    disabled={generateMutation.isPending}
                  >
                    <RefreshCw className="ml-2 w-4 h-4" />
                    إعادة
                  </Button>

                  <ExportMenu
                    title={basePrompt.slice(0, 50) + (basePrompt.length > 50 ? "..." : "")}
                    basePrompt={basePrompt}
                    enhancedPrompt={generateMutation.data.enhancedPrompt}
                    variant="outline"
                    size="default"
                    className="border-primary/30 hover:bg-primary/10"
                  />
                </div>
                
                {/* Share Website Button */}
                <ShareWebsiteButton
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/30 hover:bg-primary/10"
                />
                
                {/* Share Prompt Button */}
                <ShareButtons 
                  promptId={1}
                  promptTitle={basePrompt.slice(0, 50)}
                  promptText={generateMutation.data.enhancedPrompt}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
