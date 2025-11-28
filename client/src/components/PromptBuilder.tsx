import React, { useState } from 'react';
import { Copy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function PromptBuilder() {
  const [role, setRole] = useState('خبير تسويق رقمي');
  const [task, setTask] = useState('كتابة تغريدة فيرال');
  const [tone, setTone] = useState('إبداعي وجذاب');
  const [dialect, setDialect] = useState('سعودية (بيضاء)');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const roles = ['خبير تسويق رقمي', 'مبرمج محترف', 'مستشار قانوني سعودي', 'كاتب محتوى إبداعي', 'أخصائي موارد بشرية'];
  const tasks = ['كتابة تغريدة فيرال', 'تلخيص مستند معقد', 'كتابة إيميل رسمي', 'تحليل بيانات', 'اقتراح أفكار فيديو'];
  const tones = ['إبداعي وجذاب', 'رسمي ومهني', 'فكاهي وخفيف', 'حماسي وتحفيزي'];
  const dialects = ['سعودية (بيضاء)', 'سعودية (نجدية عامية)', 'فصحى مبسطة', 'خليجية عامة'];

  const generate = () => {
    const prompt = `تصرف كـ ${role}. قم بـ ${task} بأسلوب ${tone}. اللهجة المطلوبة: ${dialect}. تأكد أن المحتوى مناسب للسوق السعودي والخليجي.`;
    setGeneratedPrompt(prompt);
    toast.success('✨ تم إنشاء البرومبت!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success('تم نسخ البرومبت!');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-lg border-2 border-indigo-100 my-8">
      <h2 className="text-3xl font-bold mb-6 text-right text-indigo-900 flex items-center justify-end gap-3">
        <span>🛠️ ابني البرومبت الخاص بك</span>
        <Sparkles className="w-8 h-8 text-indigo-600" />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-indigo-900">الدور (مين اللي يتكلم؟)</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 bg-white rounded-lg border-2 border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-right shadow-sm hover:border-indigo-300 transition">
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-indigo-900">المهمة (وش المطلوب؟)</label>
          <select value={task} onChange={(e) => setTask(e.target.value)} className="w-full p-3 bg-white rounded-lg border-2 border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-right shadow-sm hover:border-indigo-300 transition">
            {tasks.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-indigo-900">النبرة (الأسلوب)</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-3 bg-white rounded-lg border-2 border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-right shadow-sm hover:border-indigo-300 transition">
            {tones.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-indigo-900">اللهجة</label>
          <select value={dialect} onChange={(e) => setDialect(e.target.value)} className="w-full p-3 bg-white rounded-lg border-2 border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-right shadow-sm hover:border-indigo-300 transition">
            {dialects.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <button onClick={generate} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-6 flex items-center justify-center gap-2 text-lg">
        <Sparkles className="w-5 h-5" />
        ✨ إنشاء البرومبت
      </button>

      {generatedPrompt && (
        <div className="bg-white p-5 rounded-xl border-2 border-emerald-200 relative shadow-md">
          <p className="text-gray-800 leading-relaxed text-right pr-10">{generatedPrompt}</p>
          <button onClick={copyToClipboard} className="absolute top-4 left-4 text-indigo-500 hover:text-indigo-700 transition-colors p-2 hover:bg-indigo-50 rounded-lg">
            <Copy size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
