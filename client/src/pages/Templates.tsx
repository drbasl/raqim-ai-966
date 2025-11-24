import DashboardLayout from "@/components/DashboardLayout";
import TemplateLibrary from "@/components/TemplateLibrary";
import { useLocation } from "wouter";

export default function Templates() {
  const [, setLocation] = useLocation();

  const handleTemplateSelect = (template: any) => {
    // الانتقال للصفحة الرئيسية مع القالب المختار
    setLocation("/");
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <TemplateLibrary onSelectTemplate={handleTemplateSelect} />
      </div>
    </DashboardLayout>
  );
}
