import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, Check } from "lucide-react";

type StyleType = "realistic" | "artistic" | "anime";
type QualityType = "ultra" | "high" | "standard";

interface StyleButton {
  id: StyleType;
  label: string;
  icon: string;
}

interface QualityButton {
  id: QualityType;
  label: string;
  icon: string;
}

const styles: StyleButton[] = [
  { id: "realistic", label: "واقعي", icon: "📸" },
  { id: "artistic", label: "فني", icon: "🎨" },
  { id: "anime", label: "أنمي", icon: "🎭" },
];

const qualities: QualityButton[] = [
  { id: "ultra", label: "فائقة", icon: "⚡" },
  { id: "high", label: "عالية", icon: "✨" },
  { id: "standard", label: "قياسية", icon: "💫" },
];

const quickExamples = [
  "قطة بيضاء تلعب بالكرة",
  "منظر طبيعي جبلي",
  "وجه امرأة جميلة",
  "مدينة حديثة في الليل",
  "زهور في حديقة",
];

export default function ImagePromptGenerator() {
  const [description, setDescription] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<StyleType>("realistic");
  const [selectedQuality, setSelectedQuality] = useState<QualityType>("high");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    if (!description.trim()) return;

    setIsGenerating(true);

    // Simulate generation delay
    setTimeout(() => {
      const styleDescriptions: Record<StyleType, string> = {
        realistic:
          "photorealistic, high detail, professional photography, sharp focus",
        artistic: "artistic style, oil painting, creative, expressive brushstrokes",
        anime: "anime style, manga art, cel-shading, vibrant colors, expressive eyes",
      };

      const qualityDescriptions: Record<QualityType, string> = {
        ultra: "8K resolution, ultra high quality, masterpiece, ultra detailed",
        high: "4K resolution, high quality, professional, detailed",
        standard: "HD resolution, quality, detailed",
      };

      const prompt =
        `${description}, ${styleDescriptions[selectedStyle]}, ${qualityDescriptions[selectedQuality]}, best quality, well composed`.replace(
          /,\s*,/g,
          ","
        );

      setGeneratedPrompt(prompt);
      setIsGenerating(false);
    }, 800);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickExample = (example: string) => {
    setDescription(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Main Card */}
      <div className="bg-gradient-to-br from-emerald-50/50 to-white dark:from-slate-900 dark:to-slate-800 border border-emerald-200/50 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 dark:text-emerald-50 mb-2">
            برومبتات الصور
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base">
            ولّد برومبتات احترافية لأدوات الصور الذكية
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              صف الصورة التي تريدها
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: قطة بيضاء تلعب بالكرة في حديقة مشمسة"
              maxLength={300}
              className="resize-none text-sm md:text-base min-h-28 md:min-h-32 border-emerald-200/50 focus:border-emerald-500 dark:bg-slate-800 dark:text-white"
            />
            <div className="text-right text-xs text-slate-500 dark:text-slate-400 mt-1">
              {description.length}/300
            </div>
          </div>
        </div>

        {/* Style Selection */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
            النمط
          </p>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`py-2 px-3 md:py-3 md:px-4 rounded-lg font-medium text-xs md:text-sm transition-all ${
                  selectedStyle === style.id
                    ? "bg-emerald-600 dark:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <span className="text-lg md:text-xl">{style.icon}</span>
                <div>{style.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quality Selection */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
            الجودة
          </p>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {qualities.map((quality) => (
              <button
                key={quality.id}
                onClick={() => setSelectedQuality(quality.id)}
                className={`py-2 px-3 md:py-3 md:px-4 rounded-lg font-medium text-xs md:text-sm transition-all ${
                  selectedQuality === quality.id
                    ? "bg-emerald-600 dark:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <span className="text-lg md:text-xl">{quality.icon}</span>
                <div>{quality.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generatePrompt}
          disabled={!description.trim() || isGenerating}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 dark:from-emerald-700 dark:to-emerald-800 text-white font-bold py-3 md:py-4 text-base md:text-lg rounded-lg transition-all shadow-lg hover:shadow-xl mb-8"
        >
          <Sparkles className="w-5 h-5 ml-2 inline" />
          {isGenerating ? "جاري التوليد..." : "ولّد البرومبت"}
        </Button>

        {/* Output Section */}
        {generatedPrompt && (
          <div className="space-y-4 p-4 md:p-6 bg-emerald-50/50 dark:bg-slate-900/50 border border-emerald-200/50 dark:border-emerald-900/50 rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-700 dark:text-slate-200">
                البرومبت المولد
              </h3>
              <button
                onClick={copyPrompt}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  copied
                    ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    تم النسخ ✅
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    نسخ
                  </>
                )}
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-emerald-200/30 dark:border-slate-700">
              <p className="text-slate-700 dark:text-slate-200 text-xs md:text-sm leading-relaxed font-mono">
                {generatedPrompt}
              </p>
            </div>

            <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200/50 dark:border-slate-700">
              <p className="font-semibold mb-1">💡 كيفية الاستخدام:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>انسخ البرومبت أعلاه</li>
                <li>الصقه في Midjourney أو DALL-E أو Nano Banana Pro</li>
                <li>استمتع برسومات احترافية! 🎨</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Quick Examples */}
      <div className="mt-10">
        <h3 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-4 text-center">
          أمثلة سريعة
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3">
          {quickExamples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickExample(example)}
              className="p-3 md:p-4 bg-white dark:bg-slate-800 border border-emerald-200/50 dark:border-slate-700 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-600 hover:shadow-md transition-all text-xs md:text-sm text-slate-700 dark:text-slate-200 font-medium text-right"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
