import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileText, Sparkles, Download, FileDown, Printer } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import ReactMarkdown from "react-markdown";

type GenerationMethod = "text" | "title";
type QuestionType = "multiple_choice" | "short_answer" | "essay" | "true_false" | "fill_blank" | "mixed";

export default function WorksheetGenerator() {
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>("title");
  const [questionType, setQuestionType] = useState<QuestionType>("multiple_choice");
  const [questionCount, setQuestionCount] = useState<number>(7);
  const [language, setLanguage] = useState<string>("ar");
  const [gradeLevel, setGradeLevel] = useState<string>("elementary");
  const [subject, setSubject] = useState<string>("arabic");
  const [difficultyLevel, setDifficultyLevel] = useState<string>("medium");
  const [lessonTitle, setLessonTitle] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const [schoolName, setSchoolName] = useState<string>("");
  const [sourceText, setSourceText] = useState<string>("");

  const generateMutation = trpc.worksheets.generate.useMutation({
    onSuccess: (data) => {
      toast.success("تم توليد ورقة العمل بنجاح!");
    },
    onError: (error) => {
      toast.error("حدث خطأ في توليد ورقة العمل");
      console.error(error);
    },
  });

  const handleGenerate = () => {
    if (!lessonTitle.trim()) {
      toast.error("يرجى إدخال عنوان الدرس");
      return;
    }

    if (generationMethod === "text" && !sourceText.trim()) {
      toast.error("يرجى إدخال النص المصدر");
      return;
    }

    generateMutation.mutate({
      generationMethod,
      questionType,
      questionCount,
      language,
      gradeLevel,
      lessonTitle,
      teacherName: teacherName || undefined,
      schoolName: schoolName || undefined,
      sourceText: generationMethod === "text" ? sourceText : undefined,
    });
  };

  const worksheetRef = useRef<HTMLDivElement>(null);

  const getPlainText = (markdown: string) => {
    return markdown
      .replace(/#+\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  };

  const handleExportPDF = () => {
    if (!worksheetRef.current) return;
    const element = worksheetRef.current.cloneNode(true) as HTMLElement;
    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            * { margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; }
            h1 { font-size: 24px; margin: 15px 0; }
            h2 { font-size: 20px; margin: 12px 0; color: #0066cc; }
            h3 { font-size: 18px; margin: 10px 0; }
            p { font-size: 14px; line-height: 1.8; margin: 5px 0; }
            ul, ol { margin: 10px 20px; }
            li { margin: 5px 0; }
            table { border-collapse: collapse; width: 100%; margin: 10px 0; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: right; }
            th { background: #f0f0f0; }
            strong { font-weight: bold; }
            em { font-style: italic; }
          </style>
        </head>
        <body>${element.innerHTML}</body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonTitle || 'ورقة-عمل'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير HTML بنجاح! (فتح الملف في المتصفح واضغط Ctrl+P للطباعة كـ PDF)');
  };

  const handleExportWord = () => {
    if (!generateMutation.data) return;
    const content = getPlainText(generateMutation.data.content);
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonTitle || 'ورقة-عمل'}.docx`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير Word بنجاح!');
  };

  const handleExportMarkdown = () => {
    if (!generateMutation.data) return;
    const blob = new Blob([generateMutation.data.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonTitle || 'ورقة-عمل'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير Markdown بنجاح!');
  };

  const handleExportText = () => {
    if (!generateMutation.data) return;
    const content = getPlainText(generateMutation.data.content);
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lessonTitle || 'ورقة-عمل'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('تم تصدير نص عادي بنجاح!');
  };

  const handlePrint = () => {
    if (!worksheetRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('يرجى السماح بفتح النوافذ المنبثقة');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>${lessonTitle}</title>
          <style>
            body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; margin: 20px; }
            h1 { font-size: 24px; margin: 15px 0; }
            h2 { font-size: 20px; margin: 12px 0; color: #0066cc; }
            h3 { font-size: 18px; margin: 10px 0; }
            p { font-size: 14px; line-height: 1.8; }
            ul, ol { margin: 10px 20px; }
            li { margin: 5px 0; }
            strong { font-weight: bold; }
            code { background: #f0f0f0; padding: 2px 5px; border-radius: 3px; }
            table { border-collapse: collapse; width: 100%; margin: 10px 0; }
            th, td { border: 1px solid #999; padding: 8px; text-align: right; }
            th { background: #f0f0f0; font-weight: bold; }
          </style>
        </head>
        <body>
          ${worksheetRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
    toast.success('فتح نافذة الطباعة');
  };

  return (
    <Card className="p-6 bg-card/50 border-primary/20">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-bold neon-text flex items-center justify-center gap-2">
            <FileText className="w-5 h-5 md:w-6 md:h-6" />
            تفاصيل ورقة العمل
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            اختر طريقة التوليد المناسبة لإنشاء ورقة عمل مخصصة
          </p>
        </div>

        {/* Generation Method */}
        <div className="space-y-3">
          <Label className="text-base md:text-lg font-semibold">طريقة التوليد</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={generationMethod === "title" ? "default" : "outline"}
              onClick={() => setGenerationMethod("title")}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              إنشاء باستخدام عنوان الدرس
            </Button>
            <Button
              variant={generationMethod === "text" ? "default" : "outline"}
              onClick={() => setGenerationMethod("text")}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              باستخدام نص
            </Button>
          </div>
        </div>

        {/* Source Text (if method is text) */}
        {generationMethod === "text" && (
          <div className="space-y-2">
            <Label htmlFor="source-text" className="text-sm md:text-base">النص المصدر</Label>
            <Textarea
              id="source-text"
              placeholder="أدخل النص الذي تريد إنشاء أسئلة منه..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
        )}

        {/* Question Type */}
        <div className="space-y-3">
          <Label className="text-base md:text-lg font-semibold">
            نوع الأسئلة <span className="text-xs md:text-sm text-muted-foreground">(يمكن اختيار عدة أنواع)</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button
              variant={questionType === "multiple_choice" ? "default" : "outline"}
              onClick={() => setQuestionType("multiple_choice")}
              size="sm"
            >
              الاختيار من متعدد
            </Button>
            <Button
              variant={questionType === "short_answer" ? "default" : "outline"}
              onClick={() => setQuestionType("short_answer")}
              size="sm"
            >
              أسئلة قصيرة
            </Button>
            <Button
              variant={questionType === "essay" ? "default" : "outline"}
              onClick={() => setQuestionType("essay")}
              size="sm"
            >
              مقالي
            </Button>
            <Button
              variant={questionType === "true_false" ? "default" : "outline"}
              onClick={() => setQuestionType("true_false")}
              size="sm"
            >
              صح أم خطأ
            </Button>
            <Button
              variant={questionType === "fill_blank" ? "default" : "outline"}
              onClick={() => setQuestionType("fill_blank")}
              size="sm"
            >
              أكمل الفراغات
            </Button>
            <Button
              variant={questionType === "mixed" ? "default" : "outline"}
              onClick={() => setQuestionType("mixed")}
              size="sm"
              className="bg-primary/10"
            >
              أسئلة متنوعة
            </Button>
          </div>
        </div>

        {/* Question Count & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="question-count" className="text-sm md:text-base">عدد الأسئلة</Label>
            <Input
              id="question-count"
              type="number"
              min={1}
              max={30}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 7)}
              placeholder="7"
            />
            <p className="text-xs md:text-sm text-muted-foreground">الحد 30 سؤال</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm md:text-base">لغة الورقة</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">الإنجليزية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grade Level & Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="grade-level" className="text-sm md:text-base">المرحلة الدراسية</Label>
            <Select value={gradeLevel} onValueChange={setGradeLevel}>
              <SelectTrigger id="grade-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementary">ابتدائي</SelectItem>
                <SelectItem value="middle">متوسط</SelectItem>
                <SelectItem value="high">ثانوي</SelectItem>
                <SelectItem value="university">جامعي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm md:text-base">المادة</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arabic">لغة عربية</SelectItem>
                <SelectItem value="islamic">تربية إسلامية</SelectItem>
                <SelectItem value="math">رياضيات</SelectItem>
                <SelectItem value="science">علوم</SelectItem>
                <SelectItem value="english">لغة إنجليزية</SelectItem>
                <SelectItem value="social">اجتماعيات</SelectItem>
                <SelectItem value="computer">حاسب آلي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Difficulty Level & Lesson Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-sm md:text-base">مستوى الصعوبة</Label>
            <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
              <SelectTrigger id="difficulty">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">سهل</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="hard">صعب</SelectItem>
                <SelectItem value="advanced">للمتفوقين</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lesson-title" className="text-sm md:text-base">
              عنوان الدرس <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lesson-title"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="اكتب عنوان الدرس"
            />
          </div>
        </div>

        {/* Teacher Name & School Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="teacher-name" className="text-sm md:text-base">اسم المعلم/ة (اختياري)</Label>
            <Input
              id="teacher-name"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="اسم المعلم/ة"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school-name" className="text-sm md:text-base">اسم المدرسة (اختياري)</Label>
            <Input
              id="school-name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="اسم المدرسة"
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className="w-full h-12 text-lg"
          size="lg"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="ml-2 w-5 h-5 animate-spin" />
              جاري التوليد...
            </>
          ) : (
            <>
              <Sparkles className="ml-2 w-5 h-5" />
              توليد ورقة العمل
            </>
          )}
        </Button>

        {/* Generated Worksheet */}
        {generateMutation.data && (
          <div className="space-y-4 p-6 bg-background/50 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-lg md:text-xl font-semibold">ورقة العمل المولدة</h3>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
                  <Printer className="w-4 h-4" />
                  طباعة
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      تصدير
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleExportPDF} className="gap-2 cursor-pointer">
                      <FileDown className="w-4 h-4" />
                      PDF تصدير
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportWord} className="gap-2 cursor-pointer">
                      <FileDown className="w-4 h-4" />
                      Word تصدير
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportMarkdown} className="gap-2 cursor-pointer">
                      <FileDown className="w-4 h-4" />
                      Markdown تصدير
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportText} className="gap-2 cursor-pointer">
                      <FileDown className="w-4 h-4" />
                      تصدير نص عادي
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div ref={worksheetRef} dir="rtl" className="prose prose-sm max-w-none dark:prose-invert text-right space-y-4">
              <ReactMarkdown
                components={{
                  h1: (props) => <h1 className="text-2xl font-bold text-right mb-4 mt-4">{props.children}</h1>,
                  h2: (props) => <h2 className="text-xl font-bold text-right mb-3 mt-3 text-primary">{props.children}</h2>,
                  h3: (props) => <h3 className="text-lg font-bold text-right mb-2 mt-2 text-primary/80">{props.children}</h3>,
                  p: (props) => <p className="text-base text-right leading-8 mb-2">{props.children}</p>,
                  strong: (props) => <strong className="font-bold">{props.children}</strong>,
                  em: (props) => <em className="italic">{props.children}</em>,
                  ul: (props) => <ul className="list-disc list-inside text-right mb-3">{props.children}</ul>,
                  ol: (props) => <ol className="list-decimal list-inside text-right mb-3">{props.children}</ol>,
                  li: (props) => <li className="text-base mb-1 text-right">{props.children}</li>,
                  blockquote: (props) => <blockquote className="border-r-4 border-primary pr-4 text-right italic text-gray-600 dark:text-gray-400 my-3">{props.children}</blockquote>,
                  code: (props: any) => 
                    props.inline ? (
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">{props.children}</code>
                    ) : (
                      <code className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg block text-sm font-mono overflow-auto text-left mb-3">{props.children}</code>
                    ),
                  table: (props) => <table className="table-auto border-collapse border border-gray-300 dark:border-gray-700 w-full text-right mb-3">{props.children}</table>,
                  th: (props) => <th className="border border-gray-300 dark:border-gray-700 bg-primary/10 p-2 font-bold text-right">{props.children}</th>,
                  td: (props) => <td className="border border-gray-300 dark:border-gray-700 p-2 text-right">{props.children}</td>,
                  hr: () => <hr className="my-4 border-t-2 border-primary/30" />,
                }}
              >
                {generateMutation.data.content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
