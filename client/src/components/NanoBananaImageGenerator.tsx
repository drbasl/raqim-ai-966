import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function NanoBananaImageGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateMutation = trpc.llm.generatePrompt.useMutation({
    onSuccess: (data) => {
      setGeneratedPrompt(data.generatedPrompt);
      setIsGenerating(false);
      toast.success("✨ تم توليد البرومبت بنجاح!");
    },
    onError: () => {
      setIsGenerating(false);
      toast.error("❌ فشل التوليد، حاول مرة أخرى");
    },
  });

  const handleGenerate = () => {
    if (!title.trim() || !description.trim() || description.length < 10) {
      toast.error("يرجى ملء الحقول بشكل صحيح");
      return;
    }

    setIsGenerating(true);
    const fullInput = `الموضوع: ${title}\n\nالوصف: ${description}`;
    
    generateMutation.mutate({
      userInput: fullInput,
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
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {!generatedPrompt ? (
        <div className="bg-gradient-to-br from-yellow-50/50 to-white dark:from-slate-900 dark:to-slate-800 border border-yellow-200/50 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center text-5xl">🍌</div>
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-900 dark:text-yellow-50 mb-2">
              توليد أوامر صور نانو بانانا
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
              اكتب موضوع وصف صورتك ونحن نولد لك برومبت احترافي
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                الموضوع
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: صورة للسعودية 2050"
                maxLength={100}
                className="border-yellow-200/50 focus:border-yellow-500 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                وصف الصورة
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب وصفاً تفصيلياً للصورة المطلوبة..."
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
            disabled={!title.trim() || !description.trim() || isGenerating || description.length < 10}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 md:py-4 text-base md:text-lg rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 ml-2 inline animate-spin" />
                جاري التوليد...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 ml-2 inline" />
                توليد أمر الصورة
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-200">
              الأمر المولد
            </h2>
            <button
              onClick={copyPrompt}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                copied
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
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

          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto mb-6">
            <p className="text-slate-700 dark:text-slate-200 text-xs md:text-sm leading-relaxed font-mono whitespace-pre-wrap">
              {generatedPrompt}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(generatedPrompt);
                window.open("https://www.nanobanana.ai", "_blank");
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 text-sm"
            >
              🔗 انسخ واذهب إلى نانو بانانا
            </Button>
            <Button
              onClick={() => {
                setGeneratedPrompt("");
                setTitle("");
                setDescription("");
              }}
              className="w-full bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold py-2 text-sm"
            >
              ✨ توليد برومبت جديد
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
