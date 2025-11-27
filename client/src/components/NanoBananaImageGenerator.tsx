import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NanoBananaImageGenerator() {
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error("يرجى إدخال وصف الصورة");
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/trpc/images.generateNanoBanana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          json: { prompt: description }
        }),
      });

      if (!response.ok) {
        throw new Error('فشل التوليد');
      }

      const data = await response.json();
      if (data.result?.data?.json?.imageUrl) {
        toast.success("تم توليد الصورة بنجاح! ✨");
      }
    } catch (error) {
      toast.error(`خطأ: ${error instanceof Error ? error.message : "فشل توليد الصورة"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    toast.success("تم نسخ الوصف بنجاح! ✅");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Main Card */}
      <div className="bg-gradient-to-br from-yellow-50/50 to-white dark:from-slate-900 dark:to-slate-800 border border-yellow-200/50 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50' y='60' font-size='40' text-anchor='middle'%3E🍌%3C/text%3E%3C/svg%3E" alt="Nano Banana" className="w-16 h-16" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-900 dark:text-yellow-50 mb-2">
            توليد أوامر صور نانو بانانا المجاني
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
            ولّد صوراً احترافية مجاناً باستخدام تقنية الذكاء الاصطناعي المتقدمة
          </p>
        </div>

        {/* Description Section */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              صف الصورة التي تريدها
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              هل تريد في تحويل أفكارك إلى صور؟ فقط أخبرنا بما تريد، وسيتم توليد الصورة تلقائياً بجودة عالية.
            </p>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: منزل حديث مع حديقة جميلة وإضاءة ذهبية عند الغروب"
              maxLength={500}
              className="resize-none text-sm md:text-base min-h-32 md:min-h-40 border-yellow-200/50 focus:border-yellow-500 dark:bg-slate-800 dark:text-white"
            />
            <div className="text-right text-xs text-slate-500 dark:text-slate-400 mt-1">
              {description.length}/500
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!description.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 dark:from-yellow-600 dark:to-yellow-700 text-white font-bold py-3 md:py-4 text-base md:text-lg rounded-lg transition-all shadow-lg hover:shadow-xl mb-6"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 ml-2 inline animate-spin" />
              جاري التوليد...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 ml-2 inline" />
              توليد الصورة
            </>
          )}
        </Button>

        {/* Info Box */}
        <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-lg border border-yellow-200/30 dark:border-slate-700 mb-6">
          <p className="font-semibold mb-2">💡 نصائح للحصول على أفضل النتائج:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>استخدم وصف تفصيلي قدر الإمكان</li>
            <li>حدد الأسلوب (واقعي، فني، رسومي، وغيره)</li>
            <li>اذكر الألوان والإضاءة المفضلة</li>
            <li>تجنب الكلمات المسيئة أو المخالفة للآداب</li>
          </ul>
        </div>

        <div className="text-xs md:text-sm text-yellow-700 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200/50 dark:border-yellow-700 text-center">
          <p>✨ الخدمة قريباً! سيتمكن المستخدمون من توليد الصور مباشرة.</p>
        </div>
      </div>
    </div>
  );
}
