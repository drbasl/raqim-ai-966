import React from 'react';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  promptText: string;
}

export default function AIPlatformLinks({ promptText }: Props) {
  const openLink = (url: string) => {
    navigator.clipboard.writeText(promptText);
    toast.success('تم نسخ البرومبت!');
    setTimeout(() => {
      window.open(url, '_blank');
    }, 300);
  };

  return (
    <div className="flex gap-3 mt-4 justify-end flex-wrap">
      <button 
        onClick={() => openLink('https://chatgpt.com')}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 rounded-lg transition-all shadow-sm hover:shadow-md border border-gray-300 transform hover:scale-105"
      >
        فتح في ChatGPT
        <ExternalLink size={14} />
      </button>

      <button 
        onClick={() => openLink('https://gemini.google.com')}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all shadow-sm hover:shadow-md border border-blue-300 transform hover:scale-105"
      >
        فتح في Gemini
        <ExternalLink size={14} />
      </button>
    </div>
  );
}
