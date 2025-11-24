import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calculator,
  FlaskConical,
  Languages,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface WorksheetTemplate {
  id: string;
  title: string;
  grade: string;
  questionType: string;
  questionCount: number;
  prompt: string;
}

const arabicTemplates: WorksheetTemplate[] = [
  {
    id: "ar-1",
    title: "القراءة والفهم",
    grade: "الصف الثالث الابتدائي",
    questionType: "اختيار من متعدد",
    questionCount: 7,
    prompt: `أنشئ ورقة عمل تعليمية احترافية بالمواصفات التالية:

📚 المعلومات الأساسية:
- المادة: اللغة العربية
- الموضوع: القراءة والفهم
- الصف: الثالث الابتدائي
- الفصل الدراسي: الأول

📖 النص القرائي:
اكتب نص قصة قصيرة بعنوان "النملة والحمامة" (150-200 كلمة) مناسبة لطلاب الصف الثالث، تحتوي على قيمة أخلاقية واضحة.

✅ الأسئلة (7 أسئلة اختيار من متعدد):
- السؤال 1: أسئلة الفهم العام
- السؤال 2-3: أسئلة التفاصيل
- السؤال 4-5: أسئلة الاستنتاج
- السؤال 6: سؤال المفردات
- السؤال 7: سؤال القيمة الأخلاقية

✅ متطلبات إضافية:
- 4 خيارات لكل سؤال
- خيار واحد صحيح فقط
- لغة بسيطة مناسبة للعمر`
  },
  {
    id: "ar-2",
    title: "الإملاء - الهمزة المتوسطة",
    grade: "الصف الخامس الابتدائي",
    questionType: "إملاء الفراغات",
    questionCount: 10,
    prompt: `أنشئ ورقة عمل إملاء احترافية بالمواصفات التالية:

📚 المعلومات الأساسية:
- المادة: اللغة العربية (الإملاء)
- الموضوع: الهمزة المتوسطة على الياء
- الصف: الخامس الابتدائي

📖 القسم الأول: شرح مختصر للقاعدة (3-4 أسطر)

✅ القسم الثاني: التطبيق (10 أسئلة)
- النوع الأول (5 جمل): جمل ناقصة تحتوي على كلمات بهمزة متوسطة
- النوع الثاني (5 كلمات): كلمات بها أخطاء إملائية للتصحيح

🎯 القسم الثالث: الإثراء
- سؤالان إضافيان للتحدي (اختياري)`
  },
  {
    id: "ar-3",
    title: "النحو - الفاعل وأنواعه",
    grade: "الصف الأول المتوسط",
    questionType: "أسئلة متنوعة",
    questionCount: 8,
    prompt: `أنشئ ورقة عمل نحو شاملة بالمواصفات التالية:

📚 المعلومات الأساسية:
- المادة: اللغة العربية (النحو)
- الموضوع: الفاعل وأنواعه
- الصف: الأول المتوسط

📖 القسم الأول: تذكير بالقاعدة (ملخص مبسط)

✅ القسم الثاني: الأسئلة (8 أسئلة متنوعة)
- السؤال 1-2: استخرج الفاعل من الجمل التالية
- السؤال 3-4: حدد نوع الفاعل (اسم ظاهر، ضمير مستتر، ضمير متصل)
- السؤال 5-6: أعرب الفاعل إعراباً كاملاً
- السؤال 7: ضع خطاً تحت الفاعل وحدد علامة رفعه
- السؤال 8: كوّن جملاً فيها فاعل بأنواع مختلفة`
  },
  {
    id: "ar-4",
    title: "البلاغة - التشبيه وأركانه",
    grade: "الصف الثاني الثانوي",
    questionType: "مقالي",
    questionCount: 5,
    prompt: `أنشئ ورقة عمل بلاغة متقدمة بالمواصفات التالية:

📚 المعلومات الأساسية:
- المادة: اللغة العربية (البلاغة)
- الموضوع: التشبيه وأركانه
- الصف: الثاني الثانوي

📖 القسم الأول: نص أدبي (شعري أو نثري) يحتوي على تشبيهات

✅ القسم الثاني: الأسئلة المقالية (5 أسئلة)
- السؤال 1: استخرج التشبيهات من النص وحدد أركانها
- السؤال 2: صنف التشبيهات حسب النوع (بليغ، تمثيلي، ضمني)
- السؤال 3: اشرح أثر التشبيه في المعنى والجمال
- السؤال 4: حول تشبيهاً من النص إلى نوع آخر
- السؤال 5: اكتب فقرة تستخدم فيها أنواع التشبيه`
  },
  {
    id: "ar-5",
    title: "التعبير الكتابي",
    grade: "الصف الرابع الابتدائي",
    questionType: "مقالي",
    questionCount: 3,
    prompt: `أنشئ ورقة عمل تعبير كتابي بالمواصفات التالية:

📚 المعلومات الأساسية:
- المادة: اللغة العربية (التعبير)
- الموضوع: كتابة فقرة وصفية
- الصف: الرابع الابتدائي

📖 القسم الأول: شرح مبسط (كيف تكتب فقرة وصفية؟)
- 5 نقاط بسيطة مع مثال

✅ القسم الثاني: التطبيق (3 أنشطة)
- النشاط 1: أكمل الفقرة الوصفية (نصف مكتوبة)
- النشاط 2: رتب الجمل لتكوين فقرة وصفية متماسكة
- النشاط 3: اكتب فقرة وصفية (50-70 كلمة) عن أحد الخيارات:
  • فصل الشتاء
  • شخص تحبه
  • لعبتك المفضلة`
  }
];

const mathTemplates: WorksheetTemplate[] = [
  {
    id: "math-1",
    title: "الجمع والطرح",
    grade: "الصف الأول الابتدائي",
    questionType: "صح أو خطأ",
    questionCount: 10,
    prompt: `أنشئ ورقة عمل رياضيات ممتعة بالمواصفات التالية:

📚 المعلومات الأساسية:
- المادة: الرياضيات
- الموضوع: الجمع والطرح حتى العدد 20
- الصف: الأول الابتدائي

🎨 القسم الأول: أسئلة بالصور (5 أسئلة)
- استخدم رموز بصرية (تفاح، كرات، نجوم)
- عمليات جمع بسيطة (5 + 3 = ?)

✅ القسم الثاني: صح أو خطأ (10 أسئلة)
مثال:
• 5 + 5 = 10 (  )
• 7 - 3 = 5 (  )

🎯 القسم الثالث: تحدي المتميزين
- 3 مسائل لفظية بسيطة جداً

✅ متطلبات:
- أرقام لا تتجاوز 20
- خطوط كبيرة وواضحة`
  },
  {
    id: "math-2",
    title: "جدول الضرب",
    grade: "الصف الثالث الابتدائي",
    questionType: "أسئلة قصيرة",
    questionCount: 15,
    prompt: `أنشئ ورقة عمل جدول ضرب تفاعلية بالمواصفات التالية:

📚 المعلومات الأساسية:
- المادة: الرياضيات
- الموضوع: جدول الضرب - العدد 7
- الصف: الثالث الابتدائي

📖 القسم الأول: مراجعة سريعة
- جدول ضرب 7 كاملاً (من 1 إلى 10) للمراجعة

✅ القسم الثاني: التدريبات (15 سؤال)
- النوع الأول (10 أسئلة): أكمل الفراغ
  7 × 3 = ___
  7 × ___ = 42
- النوع الثاني (5 أسئلة): مسائل لفظية بسيطة

🎯 القسم الثالث: لعبة البحث عن الناتج`
  },
  {
    id: "math-3",
    title: "الهندسة - المساحة والمحيط",
    grade: "الصف الخامس الابتدائي",
    questionType: "اختيار من متعدد",
    questionCount: 8,
    prompt: `أنشئ ورقة عمل هندسة تطبيقية بالمواصفات التالية:

📚 المعلومات الأساسية:
- المادة: الرياضيات (الهندسة)
- الموضوع: المساحة والمحيط
- الصف: الخامس الابتدائي

📖 القسم الأول: تذكير بالقوانين
- قانون محيط المستطيل
- قانون مساحة المستطيل
- قانون محيط المربع
- قانون مساحة المربع

✅ القسم الثاني: الأسئلة (8 اختيار من متعدد)
- السؤال 1-3: حساب المحيط (مع رسومات)
- السؤال 4-6: حساب المساحة (مع رسومات)
- السؤال 7-8: مسائل تطبيقية (حديقة، غرفة، ملعب)`
  },
  {
    id: "math-4",
    title: "الجبر - المعادلات الخطية",
    grade: "الصف الأول المتوسط",
    questionType: "أسئلة متنوعة",
    questionCount: 10,
    prompt: `أنشئ ورقة عمل جبر شاملة بالمواصفات التالية:

📚 المعلومات الأساسية:
- المادة: الرياضيات (الجبر)
- الموضوع: حل المعادلات الخطية
- الصف: الأول المتوسط

📖 القسم الأول: مراجعة الخطوات
- خطوات حل المعادلة الخطية (مثال مع الحل)

✅ القسم الثاني: التطبيق (10 أسئلة متدرجة)

المستوى الأول (3 معادلات بسيطة):
س + 5 = 12
3س = 21
س - 7 = 10

المستوى الثاني (4 معادلات متوسطة):
2س + 3 = 11
5س - 10 = 15

المستوى الثالث (3 معادلات متقدمة):
2(س + 3) = 14
5س + 2 = 3س + 10`
  }
];

const scienceTemplates: WorksheetTemplate[] = [
  {
    id: "sci-1",
    title: "النباتات وأجزاؤها",
    grade: "الصف الثالث الابتدائي",
    questionType: "اختيار من متعدد",
    questionCount: 8,
    prompt: `أنشئ ورقة عمل علوم تفاعلية بالمواصفات التالية:

📚 المعلومات الأساسية:
- المادة: العلوم
- الموضوع: أجزاء النبات ووظائفها
- الصف: الثالث الابتدائي

🎨 القسم الأول: رسم توضيحي
- رسم نبات كامل (جذور، ساق، أوراق، أزهار)
- مع أسهم للتسمية

✅ القسم الثاني: الأسئلة (8 اختيار من متعدد)
- السؤال 1-2: تحديد أجزاء النبات من الصورة
- السؤال 3-5: وظائف الأجزاء (ما وظيفة الجذور؟)
- السؤال 6-7: حاجات النبات (ماء، ضوء، هواء)
- السؤال 8: التطبيق العملي

🎯 القسم الثالث: نشاط عملي
- "ارسم نبتة وسمِّ أجزاءها"`
  },
  {
    id: "sci-2",
    title: "دورة الماء في الطبيعة",
    grade: "الصف الخامس الابتدائي",
    questionType: "صح أو خطأ",
    questionCount: 10,
    prompt: `أنشئ ورقة عمل علوم شاملة بالمواصفات التالية:

📚 المعلومات الأساسية:
- المادة: العلوم
- الموضوع: دورة الماء في الطبيعة
- الصف: الخامس الابتدائي

🎨 القسم الأول: رسم تخطيطي
- رسم دورة الماء (تبخر، تكاثف، هطول، جريان)

✅ القسم الثاني: صح أو خطأ (10 أسئلة)
أمثلة:
• التبخر هو تحول الماء من حالة سائلة إلى غازية (  )
• الأمطار هي شكل من أشكال الهطول (  )

🎯 القسم الثالث: إملاء الفراغات (5 جمل)

📝 القسم الرابع: سؤال مقالي
- "اشرح بأسلوبك الخاص كيف تحدث دورة الماء" (50-70 كلمة)`
  },
  {
    id: "sci-3",
    title: "الخلية الحيوانية والنباتية",
    grade: "الصف الأول المتوسط",
    questionType: "أسئلة متنوعة",
    questionCount: 10,
    prompt: `أنشئ ورقة عمل أحياء متقدمة بالمواصفات التالية:

📚 المعلومات الأساسية:
- المادة: العلوم (الأحياء)
- الموضوع: الخلية الحيوانية والنباتية
- الصف: الأول المتوسط

🎨 القسم الأول: رسم تخطيطي
- رسم خلية حيوانية
- رسم خلية نباتية
- (مع أسهم للتسمية - فارغة)

✅ القسم الثاني: الأسئلة (10 أسئلة متنوعة)
- النوع الأول (4 أسئلة): اختيار من متعدد
- النوع الثاني (3 أسئلة): المقارنة (جدول)
- النوع الثالث (3 أسئلة): الربط (اربط العضية بوظيفتها)

🎯 القسم الثالث: التفكير الناقد
- "لماذا تحتوي الخلية النباتية على بلاستيدات خضراء بينما لا تحتوي الخلية الحيوانية عليها؟"`
  }
];

const englishTemplates: WorksheetTemplate[] = [
  {
    id: "en-1",
    title: "Reading Comprehension",
    grade: "Grade 4",
    questionType: "Multiple Choice",
    questionCount: 8,
    prompt: `Create a professional English reading worksheet with the following:

📚 Basic Information:
- Subject: English Language
- Topic: Reading Comprehension
- Grade: 4th Elementary

📖 Section 1: Reading Passage
Write a 150-200 word story titled "A Day at the Beach" suitable for 4th graders with:
- Simple past tense
- Common vocabulary
- Clear beginning, middle, end

✅ Section 2: Questions (8 Multiple Choice)
- Question 1-2: Main Idea Questions
- Question 3-5: Detail Questions
- Question 6-7: Inference Questions
- Question 8: Vocabulary Question

✅ Requirements:
- 4 options per question
- Age-appropriate language
- One correct answer only`
  },
  {
    id: "en-2",
    title: "Present Simple Tense",
    grade: "Grade 5",
    questionType: "Fill in the Blanks",
    questionCount: 10,
    prompt: `Create an English grammar worksheet:

📚 Basic Information:
- Subject: English Grammar
- Topic: Present Simple Tense
- Grade: 5th Elementary

📖 Section 1: Grammar Rule (Brief Review)
- Explain Present Simple usage in 3-4 lines
- Show examples with different subjects (I, He, She, They)

✅ Section 2: Practice (10 Fill-in-the-Blank Questions)

Type 1 (5 sentences): Complete with correct verb form
Example:
- My sister _____ (play) tennis every Friday.
- They _____ (not/like) spicy food.

Type 2 (5 sentences): Correct the mistakes
Example:
- He go to school by bus. → ___________

🎯 Section 3: Challenge (Writing Activity)
- Write 3 sentences about your daily routine using Present Simple`
  },
  {
    id: "en-3",
    title: "Vocabulary Builder",
    grade: "Grade 3",
    questionType: "Matching",
    questionCount: 10,
    prompt: `Create an engaging vocabulary worksheet:

📚 Basic Information:
- Subject: English Language
- Topic: Animals and Their Homes
- Grade: 3rd Elementary

🎨 Section 1: Picture Matching (5 questions)
- Match the animal to its home
- Include: bird/nest, fish/aquarium, dog/kennel, bee/hive, lion/den

✅ Section 2: Fill in the Blanks (5 questions)
- Complete sentences using word bank

🎯 Section 3: Drawing Activity
- Draw your favorite animal and write 2 sentences about it`
  }
];

export default function WorksheetTemplates() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyPrompt = (template: WorksheetTemplate) => {
    navigator.clipboard.writeText(template.prompt);
    setCopiedId(template.id);
    toast.success("تم نسخ القالب!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const TemplateCard = ({ template }: { template: WorksheetTemplate }) => (
    <Card className="p-3 md:p-5 border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg">
      <div className="space-y-2 md:space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm md:text-lg">{template.title}</h3>
          <span className="text-[10px] md:text-xs bg-primary/10 text-primary px-1.5 md:px-2 py-0.5 md:py-1 rounded-full shrink-0">
            {template.questionCount} سؤال
          </span>
        </div>
        <div className="space-y-1 text-xs md:text-sm text-muted-foreground">
          <p>📚 {template.grade}</p>
          <p>📝 {template.questionType}</p>
        </div>
        <Button
          onClick={() => copyPrompt(template)}
          className="w-full gap-2 text-xs md:text-sm h-9 md:h-10"
          variant={copiedId === template.id ? "default" : "outline"}
        >
          {copiedId === template.id ? (
            <>
              <Check className="w-3 h-3 md:w-4 md:h-4" />
              تم النسخ
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 md:w-4 md:h-4" />
              نسخ البرومبت
            </>
          )}
        </Button>
      </div>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-4 md:py-8 px-2 md:px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            مكتبة قوالب أوراق العمل التعليمية
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg px-2">
            قوالب جاهزة لتوليد أوراق عمل تعليمية احترافية
          </p>
          <div className="flex items-center justify-center gap-2 md:gap-4 mt-4 text-xs md:text-sm flex-wrap">
            <span className="bg-muted px-2 md:px-3 py-1 rounded-full">30 قالب</span>
            <span className="bg-muted px-2 md:px-3 py-1 rounded-full">4 مواد</span>
            <span className="bg-muted px-2 md:px-3 py-1 rounded-full hidden sm:inline">3 مراحل دراسية</span>
          </div>
        </div>

        <Tabs defaultValue="arabic" className="w-full">
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <TabsList className="inline-flex w-auto min-w-full md:grid md:w-full md:grid-cols-4 mb-6 md:mb-8 h-auto gap-1">
              <TabsTrigger value="arabic" className="gap-1 md:gap-2 py-2 md:py-3 px-3 md:px-4 flex-shrink-0">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs md:text-sm">عربي</span>
              </TabsTrigger>
              <TabsTrigger value="math" className="gap-1 md:gap-2 py-2 md:py-3 px-3 md:px-4 flex-shrink-0">
                <Calculator className="w-4 h-4" />
                <span className="text-xs md:text-sm">رياضيات</span>
              </TabsTrigger>
              <TabsTrigger value="science" className="gap-1 md:gap-2 py-2 md:py-3 px-3 md:px-4 flex-shrink-0">
                <FlaskConical className="w-4 h-4" />
                <span className="text-xs md:text-sm">علوم</span>
              </TabsTrigger>
              <TabsTrigger value="english" className="gap-1 md:gap-2 py-2 md:py-3 px-3 md:px-4 flex-shrink-0">
                <Languages className="w-4 h-4" />
                <span className="text-xs md:text-sm">إنجليزي</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="arabic">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {arabicTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="math">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {mathTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="science">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {scienceTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="english">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {englishTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
