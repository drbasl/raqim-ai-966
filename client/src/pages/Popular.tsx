import DashboardLayout from "@/components/DashboardLayout";
import PopularPrompts from "@/components/PopularPrompts";
import { useLocation } from "wouter";

export default function Popular() {
  const [, setLocation] = useLocation();

  const handleUsePrompt = (prompt: string) => {
    // الانتقال للصفحة الرئيسية مع البرومبت
    setLocation("/");
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            البرومبتات الأكثر شعبية
          </h1>
          <p className="text-muted-foreground text-lg">
            البرومبتات الأعلى تقييماً واستخداماً من المجتمع
          </p>
        </div>
        <PopularPrompts onUsePrompt={handleUsePrompt} />
      </div>
    </DashboardLayout>
  );
}
