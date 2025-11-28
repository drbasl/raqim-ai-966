import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Palette, Banana, Briefcase, Layout, Maximize } from 'lucide-react';

export default function ImagePromptBuilder() {
  const [isBrandingMode, setIsBrandingMode] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('Square (1:1)');
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [lighting, setLighting] = useState('Cinematic Lighting');
  const [camera, setCamera] = useState('Wide Angle Shot');
  const [quality, setQuality] = useState('8k Resolution');
  const [brandName, setBrandName] = useState('');
  const [brandStyle, setBrandStyle] = useState('Modern & Minimalist in Arabic');
  const [brandColors, setBrandColors] = useState('Blue & White Trustworthy Theme');
  const [brandLayout, setBrandLayout] = useState('9-Panel Grid Layout');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (isBrandingMode) {
      const name = brandName.trim() || '[Brand Name]';
      const refinedPrompt = `Create a complete professional branding kit presentation for "${name}". Style and Language: ${brandStyle}. Color Palette: ${brandColors}. Layout Presentation: ${brandLayout}. Aspect Ratio: ${aspectRatio}. Include logo variations, color palette with hex codes, typography hierarchy, business cards, letterhead, and social media mockups.`.trim().replace(/\s+/g, ' ');
      setGeneratedPrompt(refinedPrompt);
    } else {
      const baseSubject = subject.trim() || '[Insert Subject]';
      const refinedPrompt = `A breathtaking ${style} masterpiece featuring ${baseSubject}. The scene is illuminated by ${lighting} to create dramatic atmosphere, captured with ${camera} for perfect perspective. Colors and Tone: Vivid and rich colors. Overall quality is ${quality}, with intricate details, hyper-realistic textures. Aspect Ratio: ${aspectRatio}. trending on artstation.`.trim().replace(/\s+/g, ' ');
      setGeneratedPrompt(refinedPrompt);
    }
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
      <div className="mb-8 border-b border-gray-100 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setIsBrandingMode(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${!isBrandingMode ? 'bg-white shadow-sm text-purple-700' : 'text-gray-600'}`}
            >
              <Palette size={18} /> صور فنية
            </button>
            <button
              onClick={() => setIsBrandingMode(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${isBrandingMode ? 'bg-white shadow-sm text-purple-700' : 'text-gray-600'}`}
            >
              <Briefcase size={18} /> هوية بصرية
            </button>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800">🍌 هندسة برومبت الصورة</h2>
            <p className="text-gray-500 text-sm mt-1">{isBrandingMode ? 'صمم ملف هوية بصرية وألوان' : 'صور فنية مذهلة'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-end">
          <div className="w-full md:w-1/2 text-right">
            <label className="text-sm font-medium text-gray-600 flex items-center justify-end gap-1 mb-2">
              <Maximize size={14} /> أبعاد الصورة
            </label>
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-right">
              <option value="Square (1:1)">مربع 1:1</option>
              <option value="Portrait (9:16)">طولي 9:16</option>
              <option value="Landscape (16:9)">عريض 16:9</option>
              <option value="Ultra Wide (21:9)">سينمائي 21:9</option>
            </select>
          </div>
        </div>

        {!isBrandingMode ? (
          <>
            <div className="text-right">
              <label className="block text-sm font-semibold text-gray-700 mb-2">📸 وصف الصورة</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="قطة رائد فضاء في المريخ..."
                className="w-full p-4 bg-purple-50 border border-purple-100 rounded-xl text-right"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 text-right">
                <label className="text-sm font-medium text-gray-600">الستايل</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-right">
                  <option value="Photorealistic">واقعي</option>
                  <option value="Cinematic">سينمائي</option>
                  <option value="3D Render">3D</option>
                  <option value="Anime Style">أنمي</option>
                  <option value="Cyberpunk">سايبر بانك</option>
                  <option value="Oil Painting">زيتي</option>
                </select>
              </div>
              <div className="space-y-2 text-right">
                <label className="text-sm font-medium text-gray-600">الإضاءة</label>
                <select value={lighting} onChange={(e) => setLighting(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-right">
                  <option value="Cinematic Lighting">سينمائية</option>
                  <option value="Golden Hour">ذهبية</option>
                  <option value="Neon Lights">نيون</option>
                  <option value="Studio Softbox">ناعمة</option>
                </select>
              </div>
              <div className="space-y-2 text-right">
                <label className="text-sm font-medium text-gray-600">الكاميرا</label>
                <select value={camera} onChange={(e) => setCamera(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-right">
                  <option value="Wide Angle Shot">عريضة</option>
                  <option value="Macro Lens">قريبة</option>
                  <option value="Drone View">جوية</option>
                  <option value="Eye Level Shot">عين السمكة</option>
                </select>
              </div>
              <div className="space-y-2 text-right">
                <label className="text-sm font-medium text-gray-600">الجودة</label>
                <select value={quality} onChange={(e) => setQuality(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-right">
                  <option value="8k Resolution">8k</option>
                  <option value="4k Photography">4k</option>
                  <option value="HDR">HDR</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-right">
              <label className="block text-sm font-semibold text-gray-700 mb-2">🏷️ اسم البراند</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="kinza, رقيم..."
                className="w-full p-4 bg-blue-50 border border-blue-100 rounded-xl text-right"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 text-right">
                <label className="text-sm font-medium text-gray-600 flex items-center justify-end gap-1">
                  <Palette size={16} /> الألوان
                </label>
                <select value={brandColors} onChange={(e) => setBrandColors(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-right">
                  <option value="Blue & White Trustworthy Theme">أزرق وأبيض</option>
                  <option value="Black & Gold Luxury Theme">أسود وذهبي</option>
                  <option value="Green & Earthy Organic Theme">أخضر وترابي</option>
                  <option value="Vibrant Neon & Purple Tech">نيون وبنفسجي</option>
                  <option value="Pastel Pink & Soft Colors">باستيل ووردي</option>
                  <option value="Red & White Energetic">أحمر وأبيض</option>
                  <option value="Minimalist Black & White">أسود وأبيض</option>
                </select>
              </div>

              <div className="space-y-2 text-right">
                <label className="text-sm font-medium text-gray-600 flex items-center justify-end gap-1">
                  <Layout size={16} /> العرض
                </label>
                <select value={brandLayout} onChange={(e) => setBrandLayout(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-right">
                  <option value="9-Panel Grid Layout">شبكة 9</option>
                  <option value="Brand Book Style Pages">كتيب</option>
                  <option value="Flat Lay Desk items">مسطح</option>
                  <option value="3D Isometric Brand Assets">أيزومتري</option>
                  <option value="Packaging Design Focus">تغليف</option>
                  <option value="Billboard and Outdoor Ads">لوحات</option>
                </select>
              </div>

              <div className="space-y-2 text-right md:col-span-2">
                <label className="text-sm font-medium text-gray-600 flex items-center justify-end gap-1">
                  <Briefcase size={16} /> الستايل
                </label>
                <select value={brandStyle} onChange={(e) => setBrandStyle(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg text-right">
                  <option value="Modern & Minimalist in Arabic">عصري بسيط</option>
                  <option value="Luxury & Elegant in Arabic">فاخر أنيق</option>
                  <option value="Traditional Saudi Pattern">تراثي</option>
                  <option value="Bold & Colorful Tech Startup">جريء ملون</option>
                  <option value="Eco-friendly & Organic">طبيعي</option>
                  <option value="Industrial & Raw">صناعي</option>
                </select>
              </div>
            </div>
          </>
        )}

        <button
          onClick={generate}
          className={`w-full py-4 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 ${isBrandingMode ? 'bg-gradient-to-l from-blue-600 to-cyan-600' : 'bg-gradient-to-l from-purple-600 to-pink-600'}`}
        >
          {isBrandingMode ? <Briefcase size={20} /> : <Palette size={20} />}
          {isBrandingMode ? 'هندسة برومبت الهوية' : 'هندسة برومبت الصورة'}
        </button>
      </div>

      {generatedPrompt && (
        <div className="mt-8 animate-fadeIn">
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            <div className="bg-gray-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700">
              <div className="flex gap-2">
                <button
                  onClick={() => openPlatform('https://gemini.google.com')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-black text-xs font-bold rounded-md"
                >
                  <Banana size={16} /> Gemini
                </button>
                <button
                  onClick={() => openPlatform('https://discord.com')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md"
                >
                  <ExternalLink size={14} /> Midjourney
                </button>
              </div>
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${copied ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                {copied ? <><Check size={14} /> تم</> : <><Copy size={14} /> نسخ</>}
              </button>
            </div>
            <div className="p-6">
              <pre dir="ltr" className="text-left text-gray-100 font-mono text-sm whitespace-pre-wrap">
                {generatedPrompt}
              </pre>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">💡 برومبت محسّن لـ Gemini و DALL-E</p>
        </div>
      )}
    </div>
  );
}
