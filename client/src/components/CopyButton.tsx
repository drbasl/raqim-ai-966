import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = "نسخ البرومبت", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("تم نسخ البرومبت بنجاح! ✅");
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("فشل النسخ، حاول مرة أخرى");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2 bg-[#006C35] text-white rounded-lg hover:bg-[#005a2d] transition-colors ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          تم النسخ ✓
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          {label}
        </>
      )}
    </button>
  );
}
