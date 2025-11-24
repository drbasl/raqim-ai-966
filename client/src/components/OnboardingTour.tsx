import { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, Target, Download, Layers } from 'lucide-react';

interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  target: string | null;
  position: 'bottom' | 'top' | 'left' | 'right' | 'center';
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TooltipPosition {
  top: number;
  left: number;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    title: "مرحباً بك في رقيم AI 966 🎉",
    description: "منصتك الذكية لتوليد برومبتات احترافية - دعنا نأخذك في جولة سريعة",
    icon: <Sparkles className="w-6 h-6 text-white" />,
    target: null,
    position: "center"
  },
  {
    id: 2,
    title: "مولد البرومبتات الذكي ✍️",
    description: "اكتب وصفك أو فكرتك بالتفصيل - سنساعدك في تحويلها إلى برومبت احترافي",
    icon: <Target className="w-6 h-6 text-white" />,
    target: "generator",
    position: "bottom"
  },
  {
    id: 3,
    title: "استخدم الأمثلة الاحترافية 💡",
    description: "أمثلة جاهزة من خبراء متخصصين - انسخ البرومبت مباشرة وابدأ",
    icon: <Layers className="w-6 h-6 text-white" />,
    target: "professional-examples",
    position: "top"
  },
  {
    id: 4,
    title: "حمّل وشارك نتائجك 📥",
    description: "احفظ برومبتاتك وشاركها مع الآخرين بسهولة",
    icon: <Download className="w-6 h-6 text-white" />,
    target: null,
    position: "center"
  },
  {
    id: 5,
    title: "هل أنت جاهز؟ 🎯",
    description: "ممتاز! الآن أنت تعرف كل شيء - ابدأ بإنشاء برومبتك الأول",
    icon: <Sparkles className="w-6 h-6 text-white" />,
    target: null,
    position: "center"
  }
];

export default function OnboardingTour({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('raqim-tour-completed');
    if (!hasSeenTour) {
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const currentStepData = TOUR_STEPS[currentStep];
    
    if (currentStepData.target) {
      const element = document.getElementById(currentStepData.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          setTargetRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          });
          calculateTooltipPosition(rect, currentStepData.position);
        }, 300);
      }
    } else {
      setTargetRect(null);
    }
  }, [currentStep, isVisible]);

  const calculateTooltipPosition = (rect: DOMRect, position: string) => {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 20;
    let top = 0, left = 0;

    switch (position) {
      case 'bottom':
        top = rect.bottom + padding;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'top':
        top = rect.top - tooltipRect.height - padding;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      default:
        top = window.innerHeight / 2 - tooltipRect.height / 2;
        left = window.innerWidth / 2 - tooltipRect.width / 2;
    }

    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) left = window.innerWidth - tooltipRect.width - 10;
    if (top < 10) top = 10;
    if (top + tooltipRect.height > window.innerHeight - 10) top = window.innerHeight - tooltipRect.height - 10;

    setTooltipPosition({ top, left });
  };

  const currentStepData = TOUR_STEPS[currentStep];
  const isCenter = !currentStepData.target;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
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
      <div className="fixed inset-0 z-[9998] pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {targetRect && (
                <rect x={targetRect.left - 8} y={targetRect.top - 8} width={targetRect.width + 16} height={targetRect.height + 16} rx="12" fill="black" />
              )}
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(0, 0, 0, 0.7)" mask="url(#spotlight-mask)" className="transition-all duration-300" />
        </svg>
      </div>

      {targetRect && (
        <div className="fixed z-[9999] pointer-events-none transition-all duration-300" style={{ top: `${targetRect.top - 8}px`, left: `${targetRect.left - 8}px`, width: `${targetRect.width + 16}px`, height: `${targetRect.height + 16}px` }}>
          <div className="w-full h-full border-4 border-primary rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.6)] animate-pulse" />
        </div>
      )}

      <div ref={tooltipRef} className={`fixed z-[10000] transition-all duration-300 ${isCenter ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''}`} style={!isCenter ? { top: `${tooltipPosition.top}px`, left: `${tooltipPosition.left}px` } : {}}>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-[90vw] sm:w-96 animate-slideUp">
          <div className="relative p-5 pb-3">
            <button onClick={skipTour} className="absolute left-3 top-3 p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <div className="flex items-center gap-3 pr-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                {currentStepData.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex-1 text-right">{currentStepData.title}</h3>
            </div>
          </div>

          <div className="px-5 pb-5">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{currentStepData.description}</p>

            <div className="flex items-center justify-center gap-1.5 mb-4">
              {TOUR_STEPS.map((_, index) => (
                <div key={index} className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep ? 'w-6 bg-gradient-to-r from-primary to-purple-600' : index < currentStep ? 'w-1.5 bg-green-500' : 'w-1.5 bg-gray-300 dark:bg-gray-600'}`} />
              ))}
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button onClick={handlePrev} className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  السابق
                </button>
              )}
              <button onClick={handleNext} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm">
                {currentStep === TOUR_STEPS.length - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    ابدأ الآن
                  </>
                ) : (
                  <>
                    التالي
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mt-3">
              {currentStep < TOUR_STEPS.length - 1 && (
                <button onClick={skipTour} className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
                  تخطي الجولة
                </button>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500 mr-auto">
                {currentStep + 1} من {TOUR_STEPS.length}
              </span>
            </div>
          </div>

          {targetRect && currentStepData.position === 'bottom' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white dark:border-b-slate-800 drop-shadow-lg" />
          )}
          {targetRect && currentStepData.position === 'top' && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white dark:border-t-slate-800 drop-shadow-lg" />
          )}
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
    <button onClick={restartTour} className="fixed bottom-6 left-6 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center gap-2 text-sm font-medium transition-all hover:scale-105 z-50">
      <Sparkles className="w-4 h-4" />
      ابدأ الجولة التعريفية
    </button>
  );
}
