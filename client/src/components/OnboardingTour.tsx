import { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Sparkles, Pencil, Palette, Zap, Check } from 'lucide-react';

interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  target: string | null;
  position: 'bottom' | 'top' | 'center';
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
    title: "اكتب وصف الصورة",
    description: "صف الصورة اللي تبيها بالتفصيل",
    icon: <Pencil className="w-6 h-6 text-white" />,
    target: "prompt-input",
    position: "bottom"
  },
  {
    id: 2,
    title: "اختر النمط والجودة",
    description: "اختر النمط المناسب ومستوى الجودة",
    icon: <Palette className="w-6 h-6 text-white" />,
    target: "style-selector",
    position: "bottom"
  },
  {
    id: 3,
    title: "اضغط توليد",
    description: "والحين اضغط على زر 'ولّد الآن'",
    icon: <Zap className="w-6 h-6 text-white" />,
    target: "generate-button",
    position: "top"
  },
  {
    id: 4,
    title: "جاهز! 🎉",
    description: "سهلة صح؟ ابدأ الآن وجرّب",
    icon: <Check className="w-6 h-6 text-white" />,
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
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });

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
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + tooltipRect.height > window.innerHeight - 10) {
      top = window.innerHeight - tooltipRect.height - 10;
    }

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
      <div className="fixed inset-0 z-[9998] pointer-events-none">
        <svg className="w-full h-full">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {targetRect && (
                <rect
                  x={targetRect.left - 8}
                  y={targetRect.top - 8}
                  width={targetRect.width + 16}
                  height={targetRect.height + 16}
                  rx="12"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.7)"
            mask="url(#spotlight-mask)"
            className="transition-all duration-300"
          />
        </svg>
      </div>

      {/* Spotlight Border */}
      {targetRect && (
        <div
          className="fixed z-[9999] pointer-events-none transition-all duration-300"
          style={{
            top: `${targetRect.top - 8}px`,
            left: `${targetRect.left - 8}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
          }}
        >
          <div className="w-full h-full border-4 border-blue-500 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.6)] animate-pulse" />
        </div>
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`fixed z-[10000] transition-all duration-300 ${
          isCenter ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : ''
        }`}
        style={
          !isCenter
            ? {
                top: `${tooltipPosition.top}px`,
                left: `${tooltipPosition.left}px`,
              }
            : {}
        }
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-80 animate-slideUp">
          
          {/* Header */}
          <div className="p-4 pb-3 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              {currentStepData.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {currentStepData.title}
              </h3>
            </div>
            <button
              onClick={skipTour}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 pb-4">
            <p className="text-gray-600 dark:text-gray-300 text-base mb-4">
              {currentStepData.description}
            </p>

            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {TOUR_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-600'
                      : index < currentStep
                      ? 'w-2 bg-green-500'
                      : 'w-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Button */}
            <button
              onClick={handleNext}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {currentStep === TOUR_STEPS.length - 1 ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  فهمت، ابدأ
                </>
              ) : (
                <>
                  فهمت، التالي
                  <ArrowLeft className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Counter */}
            <p className="text-center mt-3 text-xs text-gray-400 dark:text-gray-500">
              {currentStep + 1} من {TOUR_STEPS.length}
            </p>
          </div>
        </div>

        {/* Arrow */}
        {targetRect && currentStepData.position === 'bottom' && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white dark:border-b-slate-800 drop-shadow-lg" />
        )}
        {targetRect && currentStepData.position === 'top' && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white dark:border-t-slate-800 drop-shadow-lg" />
        )}
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
      className="fixed bottom-6 left-6 p-2 bg-primary/20 hover:bg-primary/40 text-primary hover:text-primary-foreground rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-40 opacity-40 hover:opacity-100"
      title="شرح سريع"
    >
      <Sparkles className="w-4 h-4" />
    </button>
  );
}
