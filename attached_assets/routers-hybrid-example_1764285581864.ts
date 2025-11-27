/**
 * 🔌 مثال تطبيقي - دمج Hybrid LLM مع tRPC Router
 * 
 * هذا الملف يوضح كيفية دمج نظام Hybrid LLM مع الـ routers الموجودة
 * في مشروع رقيم AI 966
 */

import { router, publicProcedure } from './server/_core/trpc';
import { hybridLLM, TaskType, Priority, LLMProvider } from './server/_core/llm-hybrid';
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// 📊 Schema Definitions
// ═══════════════════════════════════════════════════════════════

const GeneratePromptInput = z.object({
  userInput: z.string().min(10, 'البرومبت قصير جداً'),
  usageType: z.enum([
    'tweet',
    'code',
    'article',
    'teaching',
    'exam',
    'crypto'
  ]),
  options: z.object({
    tone: z.string().optional(),
    examples: z.boolean().optional(),
    bulletPoints: z.boolean().optional(),
    length: z.enum(['short', 'medium', 'long']).optional(),
    complexity: z.enum(['simple', 'moderate', 'advanced']).optional(),
  }).optional(),
  // خيارات LLM
  llmOptions: z.object({
    priority: z.enum(['speed', 'quality', 'cost', 'balanced']).optional(),
    preferredProvider: z.enum(['gemini', 'deepseek', 'claude', 'gpt4', 'humain']).optional(),
  }).optional()
});

const AnalyzePromptInput = z.object({
  prompt: z.string().min(20, 'البرومبت قصير جداً للتحليل'),
  llmOptions: z.object({
    priority: z.enum(['speed', 'quality', 'cost', 'balanced']).optional(),
  }).optional()
});

// ═══════════════════════════════════════════════════════════════
// 🤖 Enhanced App Router with Hybrid LLM
// ═══════════════════════════════════════════════════════════════

export const enhancedAppRouter = router({
  
  // ─────────────────────────────────────────────────────────────
  // 1️⃣ توليد البرومبت المحسّن (Enhanced)
  // ─────────────────────────────────────────────────────────────
  
  generatePrompt: publicProcedure
    .input(GeneratePromptInput)
    .mutation(async ({ input }) => {
      const { userInput, usageType, options, llmOptions } = input;
      
      // بناء البرومبت النهائي
      const systemPrompt = buildSystemPrompt(userInput, usageType, options);
      
      // تحديد نوع المهمة والأولوية
      const taskType: TaskType = 'generate_prompt';
      const priority: Priority = llmOptions?.priority || 'balanced';
      const preferredProvider = llmOptions?.preferredProvider;
      
      console.log(`🚀 توليد برومبت - المهمة: ${taskType}, الأولوية: ${priority}`);
      
      // إرسال للـ Hybrid LLM
      const response = await hybridLLM.sendRequest({
        prompt: systemPrompt,
        taskType,
        priority,
        preferredProvider,
        maxTokens: getMaxTokensByLength(options?.length),
        temperature: getTemperatureByComplexity(options?.complexity)
      });
      
      if (!response.success) {
        throw new Error(`فشل توليد البرومبت: ${response.error}`);
      }
      
      console.log(`✅ نجح التوليد - النموذج: ${response.provider}, التكلفة: $${response.cost.toFixed(6)}`);
      
      return {
        generatedPrompt: response.content,
        metadata: {
          provider: response.provider,
          model: response.model,
          tokensUsed: response.tokensUsed,
          cost: response.cost,
          responseTime: response.responseTime
        }
      };
    }),
  
  // ─────────────────────────────────────────────────────────────
  // 2️⃣ تحليل البرومبت (Enhanced)
  // ─────────────────────────────────────────────────────────────
  
  analyzePrompt: publicProcedure
    .input(AnalyzePromptInput)
    .mutation(async ({ input }) => {
      const { prompt, llmOptions } = input;
      
      const analysisPrompt = `أنت خبير في تحليل وتقييم البرومبتات. قم بتحليل البرومبت التالي بشكل شامل:

"${prompt}"

قدم التحليل التالي:
1. **التقييم العام**: درجة من 100
2. **نقاط القوة**: ما الذي يجعل هذا البرومبت فعالاً؟
3. **نقاط الضعف**: ما الذي ينقصه أو يحتاج تحسين؟
4. **الوضوح**: هل البرومبت واضح ومفهوم؟ (درجة من 10)
5. **الشمولية**: هل يغطي جميع الجوانب المطلوبة؟ (درجة من 10)
6. **القابلية للتنفيذ**: هل يمكن للذكاء الاصطناعي تنفيذه بسهولة؟ (درجة من 10)
7. **اقتراحات التحسين**: 3-5 اقتراحات عملية محددة

استخدم تنسيق JSON للنتيجة.`;
      
      const priority: Priority = llmOptions?.priority || 'quality'; // التحليل يحتاج جودة عالية
      
      console.log(`🔍 تحليل برومبت - الأولوية: ${priority}`);
      
      const response = await hybridLLM.sendRequest({
        prompt: analysisPrompt,
        taskType: 'analyze_prompt',
        priority,
        maxTokens: 3000,
        temperature: 0.3 // تحليل يحتاج دقة أكثر من إبداع
      });
      
      if (!response.success) {
        throw new Error(`فشل تحليل البرومبت: ${response.error}`);
      }
      
      console.log(`✅ نجح التحليل - النموذج: ${response.provider}`);
      
      return {
        analysis: response.content,
        metadata: {
          provider: response.provider,
          model: response.model,
          tokensUsed: response.tokensUsed,
          cost: response.cost,
          responseTime: response.responseTime
        }
      };
    }),
  
  // ─────────────────────────────────────────────────────────────
  // 3️⃣ إحصائيات استخدام LLM
  // ─────────────────────────────────────────────────────────────
  
  getLLMStats: publicProcedure
    .query(() => {
      const stats = hybridLLM.getUsageStats();
      const available = hybridLLM.getAvailableProviders();
      
      // حساب الإجماليات
      const totals = Object.values(stats).reduce(
        (acc, curr) => ({
          requests: acc.requests + curr.requests,
          tokens: acc.tokens + curr.tokens,
          cost: acc.cost + curr.cost
        }),
        { requests: 0, tokens: 0, cost: 0 }
      );
      
      return {
        byProvider: stats,
        totals,
        availableProviders: available.map(p => ({
          provider: p.provider,
          model: p.config.model,
          enabled: p.config.enabled
        }))
      };
    }),
  
  // ─────────────────────────────────────────────────────────────
  // 4️⃣ اختبار النماذج المختلفة
  // ─────────────────────────────────────────────────────────────
  
  testProviders: publicProcedure
    .input(z.object({
      prompt: z.string(),
      providers: z.array(z.enum(['gemini', 'deepseek', 'claude', 'gpt4', 'humain'])).optional()
    }))
    .mutation(async ({ input }) => {
      const { prompt, providers } = input;
      
      const available = hybridLLM.getAvailableProviders();
      const providersToTest = providers || available.map(p => p.provider);
      
      console.log(`🧪 اختبار ${providersToTest.length} نماذج...`);
      
      const results = await Promise.allSettled(
        providersToTest.map(provider =>
          hybridLLM.sendRequest({
            prompt,
            taskType: 'general',
            preferredProvider: provider,
            maxTokens: 500
          })
        )
      );
      
      const comparison = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          const response = result.value;
          return {
            provider: providersToTest[index],
            success: response.success,
            content: response.content.substring(0, 200) + '...',
            tokensUsed: response.tokensUsed,
            cost: response.cost,
            responseTime: response.responseTime,
            model: response.model
          };
        } else {
          return {
            provider: providersToTest[index],
            success: false,
            error: result.reason?.message || 'فشل غير معروف'
          };
        }
      });
      
      return {
        prompt,
        comparison,
        summary: {
          tested: providersToTest.length,
          successful: comparison.filter(c => c.success).length,
          failed: comparison.filter(c => !c.success).length
        }
      };
    }),
  
  // ─────────────────────────────────────────────────────────────
  // 5️⃣ ترجمة ذكية
  // ─────────────────────────────────────────────────────────────
  
  translateText: publicProcedure
    .input(z.object({
      text: z.string(),
      targetLanguage: z.enum(['ar', 'en']),
      preserveFormatting: z.boolean().optional()
    }))
    .mutation(async ({ input }) => {
      const { text, targetLanguage, preserveFormatting } = input;
      
      const translatePrompt = `ترجم النص التالي إلى ${targetLanguage === 'ar' ? 'العربية' : 'الإنجليزية'}:

${text}

${preserveFormatting ? 'حافظ على التنسيق الأصلي (فقرات، نقاط، إلخ).' : ''}`;
      
      const response = await hybridLLM.sendRequest({
        prompt: translatePrompt,
        taskType: 'translate',
        priority: 'quality', // الترجمة تحتاج جودة
        maxTokens: 2000
      });
      
      if (!response.success) {
        throw new Error('فشلت الترجمة');
      }
      
      return {
        translatedText: response.content,
        metadata: {
          provider: response.provider,
          sourceLanguage: targetLanguage === 'ar' ? 'en' : 'ar',
          targetLanguage,
          tokensUsed: response.tokensUsed
        }
      };
    })
});

// ═══════════════════════════════════════════════════════════════
// 🛠️ Helper Functions
// ═══════════════════════════════════════════════════════════════

/**
 * بناء البرومبت النهائي بناءً على نوع الاستخدام والخيارات
 */
function buildSystemPrompt(
  userInput: string,
  usageType: string,
  options?: any
): string {
  const usageTypeMap: Record<string, string> = {
    tweet: 'تغريدات احترافية على تويتر',
    code: 'كتابة وشرح الأكواد البرمجية',
    article: 'كتابة المقالات والمحتوى الطويل',
    teaching: 'شرح الدروس التعليمية',
    exam: 'إنشاء الاختبارات والأسئلة',
    crypto: 'تحليل العملات الرقمية والتوصيات'
  };
  
  let prompt = `أنت خبير في ${usageTypeMap[usageType] || 'المساعدة العامة'}.

المهمة: قم بتحسين وتطوير البرومبت التالي ليصبح أكثر احترافية وفعالية:

"${userInput}"

`;

  if (options?.tone) {
    prompt += `\nالنبرة المطلوبة: ${options.tone}`;
  }
  
  if (options?.examples) {
    prompt += `\nقم بتضمين أمثلة عملية توضيحية.`;
  }
  
  if (options?.bulletPoints) {
    prompt += `\nاستخدم نقاط رئيسية منظمة.`;
  }
  
  if (options?.complexity) {
    const complexityMap = {
      simple: 'بسيط ومباشر',
      moderate: 'متوسط التعقيد',
      advanced: 'متقدم وتفصيلي'
    };
    prompt += `\nمستوى التعقيد: ${complexityMap[options.complexity]}`;
  }
  
  prompt += `\n\nقدم البرومبت المحسّن فقط، بدون مقدمات أو تعليقات إضافية.`;
  
  return prompt;
}

/**
 * تحديد max tokens بناءً على الطول المطلوب
 */
function getMaxTokensByLength(length?: string): number {
  switch (length) {
    case 'short':
      return 500;
    case 'long':
      return 3000;
    case 'medium':
    default:
      return 1500;
  }
}

/**
 * تحديد temperature بناءً على مستوى التعقيد
 */
function getTemperatureByComplexity(complexity?: string): number {
  switch (complexity) {
    case 'simple':
      return 0.5; // أقل إبداع، أكثر دقة
    case 'advanced':
      return 0.9; // أكثر إبداع وتنوع
    case 'moderate':
    default:
      return 0.7; // متوازن
  }
}

// ═══════════════════════════════════════════════════════════════
// 📤 Export
// ═══════════════════════════════════════════════════════════════

export type EnhancedAppRouter = typeof enhancedAppRouter;
