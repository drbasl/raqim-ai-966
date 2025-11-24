import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface TourGuideProps {
  run: boolean;
  onFinish: () => void;
}

export function TourGuide({ run, onFinish }: TourGuideProps) {
  const [steps] = useState<Step[]>([
    {
      target: 'body',
      content: 'مرحباً بك في رقيم AI 966! سنأخذك في جولة سريعة لشرح كيفية استخدام الموقع 🎉',
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.hero-section',
      content: 'هذا هو قسم البطل الرئيسي. يعرض عنوان الموقع والميزات الأساسية',
      placement: 'bottom',
    },
    {
      target: '.cta-buttons',
      content: 'استخدم هذه الأزرار للبدء مجاناً أو معرفة المزيد عن الخدمة',
      placement: 'bottom',
    },
    {
      target: '.features-badges',
      content: 'نقدم نتائج احترافية، 100% سعودي، وسريع ودقيق ⚡',
      placement: 'top',
    },
    {
      target: '.ai-models',
      content: 'ندعم جميع نماذج الذكاء الاصطناعي الشهيرة: ChatGPT، Claude، Gemini، وHUMAIN 🤖',
      placement: 'top',
    },
    {
      target: '.prompt-generator',
      content: 'هنا يمكنك إنشاء برومبتات احترافية! اختر نوع المهمة، أدخل تفاصيلك، واحصل على برومبت محسّن 🎯',
      placement: 'top',
    },
    {
      target: '.quick-examples',
      content: 'جرّب الأمثلة السريعة لملء الحقول تلقائياً وتوفير الوقت',
      placement: 'bottom',
    },
    {
      target: '.template-library',
      content: 'استكشف مكتبة القوالب الجاهزة لتسريع عملية إنشاء البرومبتات 📚',
      placement: 'top',
    },
  ]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      disableScrolling={false}
      spotlightPadding={5}
      styles={{
        options: {
          primaryColor: 'oklch(70% 0.15 260)',
          textColor: 'oklch(20% 0.005 75)',
          backgroundColor: 'oklch(98% 0.005 75)',
          arrowColor: 'oklch(98% 0.005 75)',
          zIndex: 10000,
          width: typeof window !== 'undefined' && window.innerWidth < 640 ? 280 : 400,
        },
        tooltip: {
          borderRadius: 12,
          padding: typeof window !== 'undefined' && window.innerWidth < 640 ? 16 : 20,
          fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 14 : 16,
        },
        buttonNext: {
          backgroundColor: 'oklch(70% 0.15 260)',
          borderRadius: 8,
          padding: typeof window !== 'undefined' && window.innerWidth < 640 ? '8px 16px' : '10px 20px',
          fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 13 : 15,
        },
        buttonBack: {
          color: 'oklch(70% 0.15 260)',
          marginRight: 10,
          fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 13 : 15,
        },
        buttonSkip: {
          color: 'oklch(50% 0.010 75)',
          fontSize: typeof window !== 'undefined' && window.innerWidth < 640 ? 13 : 15,
        },
      }}
      locale={{
        back: 'السابق',
        close: 'إغلاق',
        last: 'إنهاء',
        next: 'التالي',
        skip: 'تخطي',
      }}
    />
  );
}
