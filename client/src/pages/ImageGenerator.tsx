import { useState } from 'react';
import { useLocation } from 'wouter';
import ImagePromptBuilder from '@/components/ImagePromptBuilder';
import { ArrowRight, ImageIcon } from 'lucide-react';

export default function ImageGenerator() {
  const [, navigate] = useLocation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity group"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              مولد صور الذكاء الاصطناعي
            </h1>
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              العودة للصفحة الرئيسية
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </button>
      </div>

      {/* Image Prompt Builder */}
      <div className="flex justify-center">
        <ImagePromptBuilder />
      </div>
    </div>
  );
}
