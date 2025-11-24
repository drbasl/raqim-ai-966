import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, Target, Zap, Palette, Download } from 'lucide-react';

interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight: string | null;
  position: 'center' | 'bottom' | 'top';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    title: "مرحباً بك في رقيم AI 966 🎉",
    description: "منصتك الذكية لتوليد برومبتات احترافية - دعنا نأخذك في جولة سريعة",
    icon: <Sparkles className="w-8 h-8 text-white" />,
    highlight: null,
    position: "center"
  },
  {
    id: 2,
    title: "مولد البرومبتات الذكي ✍️",
    description: "اكتب وصفك أو فكرتك بالتفصيل - سنساعدك في تحويلها إلى برومبت احترافي",
    icon: <Target className="w-8 h-8 text-white" />,
    highlight: "#generator",
    position: "bottom"
  },
  {
    id: 3,
    title: "اختر النمط المناسب 🎨",
    description: "واقعي للصور الطبيعية، فني للتصاميم الإبداعية، أو أنمي للرسومات المتحركة",
    icon: <Palette className="w-8 h-8 text-white" />,
    highlight: null,
    position: "bottom"
  },
  {
    id: 4,
    title: "حدد مستوى الجودة ⚡",
    description: "عالية للمشاريع المهمة، فائقة للطباعة والاستخدام التجاري",
    icon: <Zap className="w-8 h-8 text-white" />,
    highlight: null,
    position: "bottom"
  },
  {
    id: 5,
    title: "استخدم الأمثلة الاحترافية 💡",
    description: "أمثلة جاهزة من خبراء متخصصين - انسخ البرومبت مباشرة وابدأ",
    icon: <Target className="w-8 h-8 text-white" />,
    highlight: "#professional-examples",
    position: "top"
  },
  {
    id: 6,
    title: "حمّل وشارك نتائجك 📥",
    description: "بعد التوليد، يمكنك تحميل الصور أو مشاركتها مباشرة",
    icon: <Download className="w-8 h-8 text-white" />,
    highlight: null,
    position: "top"
  },
  {
    id: 7,
    title: "هل أنت جاهز؟ 🎯",
    description: "ممتاز! الآن أنت تعرف كل شيء - ابدأ بإنشاء برومبتك الأول",
    icon: <Sparkles className="w-8 h-8 text-white" />,
    highlight: null,
    position: "center"
  }
];

export default function OnboardingTourModal({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('raqim-tour-completed');
    if (!hasSeenTour) {
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const currentStepData = TOUR_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    setIsVisible(false);
    localStorage.setItem('raqim-tour-completed', 'true');
    onComplete?.();
  };

  const completeTour = () => {
    setIsVisible(false);
    localStorage.setItem('raqim-tour-completed', 'true');
    onComplete?.();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] animate-fadeIn" />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-lg w-full animate-slideUp">
          
          {/* Header */}
          <div className="relative p-6 pb-4">
            <button
              onClick={skipTour}
              className="absolute left-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                {currentStepData.icon}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
              {currentStepData.description}
            </p>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-gradient-to-r from-primary to-purple-600'
                      : index < currentStep
                      ? 'w-2 bg-green-500'
                      : 'w-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                  السابق
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    ابدأ الآن
                  </>
                ) : (
                  <>
                    التالي
                    <ArrowLeft className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Skip Button */}
            {currentStep < TOUR_STEPS.length - 1 && (
              <button
                onClick={skipTour}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                تخطي الجولة
              </button>
            )}

            {/* Step Counter */}
            <p className="mt-4 text-xs text-gray-400">
              الخطوة {currentStep + 1} من {TOUR_STEPS.length}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function RestartTourButton() {
  const restartTour = () => {
    localStorage.removeItem('raqim-tour-completed');
    window.location.reload();
  };

  return (
    <button
      onClick={restartTour}
      className="fixed bottom-6 left-6 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 z-50"
    >
      <Sparkles className="w-4 h-4" />
      ابدأ الجولة التعريفية
    </button>
  );
}
