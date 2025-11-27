import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function NanoBananaImageGenerator() {
  const handleComingSoon = () => {
    toast.info("🔄 هذه الميزة قريباً جداً! تابعنا للتحديثات");
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
            ولّد صوراً احترافية مجاناً باستخدام تقنية الذكاء الاصطناعي المتقدمة
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              صف الصورة التي تريدها
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              هل تريد في تحويل أفكارك إلى صور؟ فقط أخبرنا بما تريد، وسيتم توليد الصورة تلقائياً بجودة عالية.
            </p>
            <Textarea
              placeholder="مثال: منزل حديث مع حديقة جميلة وإضاءة ذهبية عند الغروب"
              maxLength={500}
              className="resize-none text-sm md:text-base min-h-32 md:min-h-40 border-yellow-200/50 focus:border-yellow-500 dark:bg-slate-800 dark:text-white"
              disabled
            />
            <div className="text-right text-xs text-slate-500 dark:text-slate-400 mt-1">
              0/500
            </div>
          </div>
        </div>

        <Button
          onClick={handleComingSoon}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 dark:from-yellow-600 dark:to-yellow-700 text-white font-bold py-3 md:py-4 text-base md:text-lg rounded-lg transition-all shadow-lg hover:shadow-xl mb-6"
        >
          <Sparkles className="w-5 h-5 ml-2 inline" />
          توليد الصورة
        </Button>

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
