import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function NanoBananaImageGenerator() {
  const [description, setDescription] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateMutation = trpc.llm.generatePrompt.useMutation({
    onSuccess: (data) => {
      setGeneratedPrompt(data.generatedPrompt);
      setIsGenerating(false);
      toast.success("✨ تم توليد برومبت احترافي!");
    },
    onError: () => {
      setIsGenerating(false);
      toast.error("❌ فشل التوليد، حاول مرة أخرى");
    },
  });

  const handleGenerate = () => {
    if (!description.trim() || description.length < 10) {
      toast.error("يرجى إدخال وصف مفصل (10 أحرف على الأقل)");
      return;
    }

    setIsGenerating(true);
    generateMutation.mutate({
      userInput: description,
      usageType: "article",
      options: {
        examples: true,
        keyPoints: true,
        complexity: "متقدم",
        engaging: true,
      },
      llmOptions: {
        priority: "quality",
      },
    });
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    toast.success("✅ تم نسخ البرومبت!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-yellow-50/50 to-white dark:from-slate-900 dark:to-slate-800 border border-yellow-200/50 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center text-5xl">🍌</div>
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-900 dark:text-yellow-50 mb-2">
            توليد أوامر صور نانو بانانا المجاني
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
            اكتب وصف صورتك ونحن نولد لك برومبت احترافي لاستخدامه في نانو بانانا
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              📝 صف الصورة التي تريدها
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              اكتب وصف تفصيلي للصورة التي تريد إنشاءها، ودعنا نولد لك برومبت احترافي يمكنك استخدامه مباشرة في نانو بانانا
            </p>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: منزل حديث مع حديقة جميلة وإضاءة ذهبية عند الغروب، أسلوب واقعي، صورة احترافية عالية الجودة"
              maxLength={500}
              className="resize-none text-sm md:text-base min-h-32 md:min-h-40 border-yellow-200/50 focus:border-yellow-500 dark:bg-slate-800 dark:text-white"
            />
            <div className="text-right text-xs text-slate-500 dark:text-slate-400 mt-1">
              {description.length}/500
            </div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!description.trim() || isGenerating || description.length < 10}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-400 disabled:to-gray-500 dark:from-yellow-600 dark:to-yellow-700 text-white font-bold py-3 md:py-4 text-base md:text-lg rounded-lg transition-all shadow-lg hover:shadow-xl mb-6"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 ml-2 inline animate-spin" />
              جاري التوليد...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 ml-2 inline" />
              توليد البرومبت
            </>
          )}
        </Button>

        <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-4 rounded-lg border border-yellow-200/30 dark:border-slate-700 mb-6">
          <p className="font-semibold mb-2">💡 نصائح للحصول على أفضل النتائج:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>اكتب وصف تفصيلي قدر الإمكان</li>
            <li>حدد الأسلوب (واقعي، فني، رسومي، كرتون، وغيره)</li>
            <li>اذكر الألوان والإضاءة المفضلة</li>
            <li>وضح المزاج والمشاعر المطلوبة</li>
          </ul>
        </div>

        {generatedPrompt && (
          <div className="space-y-4 p-4 md:p-6 bg-yellow-50/50 dark:bg-slate-900/50 border border-yellow-200/50 dark:border-yellow-900/50 rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-700 dark:text-slate-200">
                ✨ البرومبت المولد (جاهز للاستخدام)
              </h3>
              <button
                onClick={copyPrompt}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  copied
                    ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-yellow-50 dark:hover:bg-slate-700"
                }`}
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
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-yellow-200/30 dark:border-slate-700 max-h-60 overflow-y-auto">
              <p className="text-slate-700 dark:text-slate-200 text-xs md:text-sm leading-relaxed font-mono whitespace-pre-wrap">
                {generatedPrompt}
              </p>
            </div>

            <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700">
              <p className="font-semibold mb-2">🎨 كيفية الاستخدام:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>انسخ البرومبت أعلاه</li>
                <li>اذهب إلى <a href="https://www.nanobanana.ai" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:underline">nanobanana.ai</a></li>
                <li>الصق البرومبت في حقل الإدخال</li>
                <li>اضغط على "Generate" واستمتع بصورتك! 🖼️</li>
              </ol>
            </div>

            <Button
              onClick={() => {
                setGeneratedPrompt("");
                setDescription("");
              }}
              className="w-full bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-medium text-sm"
            >
              ✨ توليد برومبت جديد
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
