import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const ONBOARDING_KEY = "raqim-onboarding-completed";

export function useOnboardingTour() {
  useEffect(() => {
    // تحقق إذا كان المستخدم أكمل الجولة من قبل
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    
    if (!hasCompletedOnboarding) {
      // انتظر قليلاً لتحميل الصفحة بالكامل
      const timer = setTimeout(() => {
        startTour();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      nextBtnText: "التالي",
      prevBtnText: "السابق",
      doneBtnText: "إنهاء",
      progressText: "{{current}} من {{total}}",
      onDestroyStarted: () => {
        // حفظ أن المستخدم أكمل الجولة
        localStorage.setItem(ONBOARDING_KEY, "true");
        driverObj.destroy();
      },
      steps: [
        {
          element: "#hero",
          popover: {
            title: "مرحباً بك في رقيم AI 966! 👋",
            description: "منصة ذكية لتوليد وتحليل البرومبتات بالذكاء الاصطناعي. دعنا نأخذك في جولة سريعة!",
            side: "bottom",
            align: "center",
          },
        },
        {
          element: "#generator",
          popover: {
            title: "مولد البرومبتات الذكي 🤖",
            description: "أنشئ برومبتات احترافية بسهولة! اختر النوع، أضف التفاصيل، واحصل على برومبت محسّن جاهز للاستخدام.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#templates",
          popover: {
            title: "مكتبة القوالب الجاهزة 📚",
            description: "اختر من 21 قالباً جاهزاً متخصصاً في التسويق الرقمي والتعليم. استخدم الفلاتر للعثور على القالب المناسب!",
            side: "top",
            align: "center",
          },
        },
        {
          element: "#analyzer",
          popover: {
            title: "محلل البرومبتات 🔍",
            description: "حلل أي برومبت لفهم نقاط قوته وضعفه واحصل على اقتراحات لتحسينه.",
            side: "top",
            align: "center",
          },
        },
        {
          element: "a[href='/worksheets']",
          popover: {
            title: "مولد أوراق العمل 📝",
            description: "أنشئ أوراق عمل تعليمية احترافية بأسئلة متنوعة لجميع المراحل الدراسية.",
            side: "bottom",
            align: "start",
          },
        },
        {
          popover: {
            title: "هل أنت جاهز؟ 🚀",
            description: "الآن يمكنك البدء باستخدام رقيم AI 966! يمكنك إعادة الجولة في أي وقت من القائمة.",
          },
        },
      ],
    });

    driverObj.drive();
  };

  return { startTour };
}

export function resetOnboarding() {
  localStorage.removeItem(ONBOARDING_KEY);
}
