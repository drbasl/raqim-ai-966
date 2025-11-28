import React, { useState } from 'react';
import { Copy, Image as ImageIcon, Check, ExternalLink, Palette, Banana } from 'lucide-react';

export default function ImagePromptBuilder() {
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState('Realistic, Photorealistic');
  const [lighting, setLighting] = useState('Cinematic Lighting');
  const [camera, setCamera] = useState('Wide Angle Shot');
  const [quality, setQuality] = useState('8k Resolution, Highly Detailed');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    // Gemini يفضل الوصف المباشر بدون أوامر تقنية معقدة مثل Midjourney
    // سنقوم بصياغة جملة وصفية قوية
    const basePrompt = subject.trim() || '[Insert Subject Here]';
    
    // تركيبة تناسب Gemini و DALL-E 3
    const refinedPrompt = `Create an image of ${basePrompt}. The style should be ${style}. Use ${lighting} and ${camera}. The image must be ${quality}.`;
    
    setGeneratedPrompt(refinedPrompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openPlatform = (url: string) => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-purple-50 my-12" id="image-prompt-builder">
      
      {/* الرأس */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
        <div className="text-right w-full">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-end gap-2">
            🎨 باني برومبت الصور
          </h2>
          <p className="text-gray-500 text-sm mt-1">حول خيالك إلى صور مذهلة باستخدام مصطلحات دقيقة</p>
        </div>
      </div>
      
      {/* نموذج المدخلات */}
      <div className="space-y-6">
        
        {/* خانة وصف الصورة */}
        <div className="text-right">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📸 وصف الصورة (ايش اللي ببالك؟)
          </label>
          <input 
            type="text" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="مثال: قطة رائد فضاء في المريخ، سيارة طائرة في الرياض 2050..."
            className="w-full p-4 bg-purple-50 border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-right placeholder-gray-400 transition-all"
          />
        </div>

        {/* شبكة الخيارات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* الستايل الفني */}
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium text-gray-600">الستايل الفني</label>
            <select 
              value={style}
              onChange={(e) => setStyle(e.target.value)} 
              className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-right cursor-pointer hover:border-purple-300 transition-colors"
            >
              <option value="Realistic, Photorealistic">واقعي جداً (Photorealistic)</option>
              <option value="Cinematic, Movie Scene">سينمائي (Cinematic)</option>
              <option value="3D Render, Unreal Engine 5">ثلاثي الأبعاد (3D Render)</option>
              <option value="Oil Painting, Classic Art">رسم زيتي (Oil Painting)</option>
              <option value="Anime Style, Studio Ghibli">أنمي (Anime)</option>
              <option value="Cyberpunk, Neon, Future">سايبر بانك (Cyberpunk)</option>
              <option value="Isometric, 3D Icon">أيقونة ثلاثية الأبعاد (Isometric)</option>
            </select>
          </div>

          {/* الإضاءة */}
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium text-gray-600">الإضاءة</label>
            <select 
              value={lighting}
              onChange={(e) => setLighting(e.target.value)} 
              className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-right cursor-pointer hover:border-purple-300 transition-colors"
            >
              <option value="Cinematic Lighting">إضاءة سينمائية</option>
              <option value="Natural Sunlight, Golden Hour">ضوء الشمس (ساعة ذهبية)</option>
              <option value="Neon Lights, Glowing">أضواء نيون ساطعة</option>
              <option value="Studio Lighting, Softbox">إضاءة استوديو ناعمة</option>
              <option value="Dark & Moody, Low Key">غامض ومظلم (Moody)</option>
              <option value="Volumetric Lighting, God Rays">أشعة الشمس (Volumetric)</option>
            </select>
          </div>

          {/* زاوية الكاميرا */}
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium text-gray-600">زاوية الكاميرا</label>
            <select 
              value={camera}
              onChange={(e) => setCamera(e.target.value)} 
              className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-right cursor-pointer hover:border-purple-300 transition-colors"
            >
              <option value="Wide Angle Shot">لقطة واسعة (Wide Angle)</option>
              <option value="Close-up, Macro Lens">لقطة قريبة جداً (Macro)</option>
              <option value="Drone View, Bird's Eye View">تصحير جوي (Drone View)</option>
              <option value="Eye Level Shot">مستوى العين (Eye Level)</option>
              <option value="Low Angle, Heroic View">زاوية منخفضة (Low Angle)</option>
              <option value="Fish-eye Lens">عدسة عين السمكة (Fish-eye)</option>
            </select>
          </div>

          {/* الدقة والجودة */}
          <div className="space-y-2 text-right">
            <label className="text-sm font-medium text-gray-600">الجودة والدقة</label>
            <select 
              value={quality}
              onChange={(e) => setQuality(e.target.value)} 
              className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-right cursor-pointer hover:border-purple-300 transition-colors"
            >
              <option value="8k Resolution, Highly Detailed">عالية جداً (8k Resolution)</option>
              <option value="4k, Professional Photography">احترافية (4k)</option>
              <option value="HDR, Sharp Focus">HDR وتركيز حاد</option>
              <option value="Black and White, Monochrome">أبيض وأسود فاخر</option>
            </select>
          </div>
        </div>

        {/* زر التوليد */}
        <button 
          onClick={generate} 
          className="w-full py-4 bg-gradient-to-l from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Palette size={20} />
          هندسة برومبت الصورة لـ Gemini Banana
        </button>
      </div>

      {/* منطقة النتائج */}
      {generatedPrompt && (
        <div className="mt-8 animate-fadeIn">
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            
            {/* شريط الأدوات */}
            <div className="bg-gray-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700">
              
              <div className="flex gap-2">
                {/* زر Gemini Banana المخصص */}
                <button 
                  onClick={() => openPlatform('https://gemini.google.com')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold rounded-md transition-colors shadow-sm"
                  title="نسخ وفتح Gemini Banana"
                >
                  <Banana size={16} className="text-black" />
                  Gemini Banana
                </button>

                <button 
                  onClick={() => openPlatform('https://discord.com/app')} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-md transition-colors"
                  title="نسخ وفتح Discord (Midjourney)"
                >
                  <ExternalLink size={14} />
                  Midjourney
                </button>
              </div>

              <button 
                onClick={copyToClipboard} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${copied ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                {copied ? <><Check size={14} /> تم النسخ</> : <><Copy size={14} /> نسخ النص</>}
              </button>
            </div>

            <div className="p-6 relative">
              <pre className="text-left text-gray-100 font-mono whitespace-pre-wrap leading-relaxed text-sm md:text-base dir-ltr">
                {generatedPrompt}
              </pre>
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-3">
            💡 نصيحة: تم تحسين البرومبت ليعمل بشكل ممتاز مع Gemini و DALL-E 3.
          </p>
        </div>
      )}
    </div>
  );
}
