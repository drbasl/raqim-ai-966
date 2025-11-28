import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';

interface Props {
  reason?: string;
}

export default function WhyItWorksTooltip({ reason = 'هذا البرومبت يوفر سياقاً واضحاً للذكاء الاصطناعي، مما يساعده على فهم الدور المطلوب والنبرة والأسلوب المرغوب. هذا يؤدي إلى نتائج أكثر دقة وملائمة لاحتياجاتك.' }: Props) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative inline-block mt-3">
      <button 
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="flex items-center gap-2 text-xs text-amber-600 hover:text-amber-700 cursor-help font-semibold transition-colors hover:bg-amber-50 px-2 py-1 rounded"
      >
        <Lightbulb size={16} />
        ليش هذا البرومبت رهيب؟
      </button>
      
      {isHovering && (
        <div className="absolute z-50 w-72 p-3 mt-2 -right-2 text-sm text-white bg-gray-900 rounded-lg shadow-2xl opacity-100 transition-opacity duration-200">
          <p className="text-right leading-relaxed">{reason}</p>
          <div className="absolute -top-2 right-6 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}
