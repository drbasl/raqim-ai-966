import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { hybridLLM, TaskType, Priority } from "./_core/llm-hybrid";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  savedPrompts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserSavedPrompts(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          basePrompt: z.string(),
          enhancedPrompt: z.string(),
          usageType: z.string(),
          tags: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.createSavedPrompt({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteSavedPrompt(input.id, ctx.user.id);
        return { success: true };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          tags: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        await db.updateSavedPrompt(id, ctx.user.id, updates);
        return { success: true };
      }),

    exportPrompts: protectedProcedure
      .input(z.object({ format: z.enum(["json", "txt"]) }))
      .query(async ({ ctx, input }) => {
        const prompts = await db.getUserSavedPrompts(ctx.user.id);
        
        if (input.format === "json") {
          return {
            format: "json" as const,
            data: JSON.stringify(prompts, null, 2),
          };
        } else {
          const txtContent = prompts
            .map((p) => `العنوان: ${p.title}\n\nالبرومبت الأساسي:\n${p.basePrompt}\n\nالبرومبت المحسّن:\n${p.enhancedPrompt}\n\n${"-".repeat(50)}\n\n`)
            .join("");
          return {
            format: "txt" as const,
            data: txtContent,
          };
        }
      }),

    toggleFavorite: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const isFavorite = await db.toggleFavorite(ctx.user.id, input.id);
        
        // Log activity
        await db.logActivity({
          userId: ctx.user.id,
          action: isFavorite ? "favorite" : "unfavorite",
          entityType: "prompt",
          entityId: input.id,
          details: null,
        });
        
        return { success: true, isFavorite };
      }),

    getFavorites: protectedProcedure.query(async ({ ctx }) => {
      return await db.getFavoritePrompts(ctx.user.id);
    }),
  }),

  popularPrompts: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getPopularPrompts(input.limit || 10);
      }),

    use: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.incrementPromptUsage(input.id);
        return { success: true };
      }),

    like: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.likePrompt(input.id);
        return { success: true };
      }),

    rate: protectedProcedure
      .input(
        z.object({
          promptId: z.number(),
          rating: z.number().min(1).max(5),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.ratePrompt({
          promptId: input.promptId,
          userId: ctx.user.id,
          rating: input.rating,
        });
        return { success: true };
      }),
  }),

  dashboard: router({
    stats: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserStats(ctx.user.id);
    }),

    recentPrompts: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getRecentPrompts(ctx.user.id, input.limit || 5);
      }),
  }),

  activity: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserActivity(ctx.user.id, 50);
    }),
  }),

  share: router({
    generateLink: protectedProcedure
      .input(z.object({ promptId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const token = await db.generateShareToken(ctx.user.id, input.promptId);
        
        // Log activity
        await db.logActivity({
          userId: ctx.user.id,
          action: "share",
          entityType: "prompt",
          entityId: input.promptId,
          details: null,
        });
        
        return { token, url: `${process.env.VITE_APP_URL || ''}/share/${token}` };
      }),

    getByToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        return await db.getPromptByShareToken(input.token);
      }),

    togglePublic: protectedProcedure
      .input(z.object({ promptId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const isPublic = await db.togglePromptPublic(ctx.user.id, input.promptId);
        return { success: true, isPublic };
      }),
  }),

  prompt: router({
    analyze: publicProcedure
      .input(z.object({ prompt: z.string() }))
      .mutation(async ({ input }) => {
        const systemPrompt = `أنت خبير في تحليل البرومبتات. حلل البرومبت التالي وقدم:
1. تقييم من 1-10
2. نقاط القوة (3-5 نقاط)
3. نقاط الضعف (3-5 نقاط)
4. اقتراحات للتحسين (3-5 اقتراحات)
5. نسخة محسّنة من البرومبت

الرد يجب أن يكون بصيغة JSON بالشكل التالي:
{
  "score": رقم,
  "strengths": ["نقطة 1", "نقطة 2"],
  "weaknesses": ["نقطة 1", "نقطة 2"],
  "suggestions": ["اقتراح 1", "اقتراح 2"],
  "improvedVersion": "البرومبت المحسّن"
}`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.prompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "prompt_analysis",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    score: { type: "number" },
                    strengths: { type: "array", items: { type: "string" } },
                    weaknesses: { type: "array", items: { type: "string" } },
                    suggestions: { type: "array", items: { type: "string" } },
                    improvedVersion: { type: "string" },
                  },
                  required: ["score", "strengths", "weaknesses", "suggestions", "improvedVersion"],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = response.choices[0].message.content;
          if (!content || typeof content !== "string") throw new Error("لم يتم الحصول على رد");

          return JSON.parse(content);
        } catch (error) {
          console.error("Error analyzing prompt:", error);
          throw new Error("حدث خطأ في تحليل البرومبت");
        }
      }),

    generate: publicProcedure
      .input(
        z.object({
          basePrompt: z.string(),
          usageType: z.enum(["social", "code", "education", "crypto", "article", "exam"]),
          options: z.object({
            humanTone: z.boolean(),
            examples: z.boolean(),
            keyPoints: z.boolean(),
            complexity: z.enum(["بسيط", "متوسط", "متقدم"]),
            engaging: z.boolean(),
          }),
        })
      )
      .mutation(async ({ input }) => {
        const { basePrompt, usageType, options } = input;
        // بناء البرومبت للنموذج الذكي
        const usageTypePrompts = {
          social: "أنت خبير في كتابة محتوى السوشيال ميديا والتغريدات الجذابة والمؤثرة.",
          code: "أنت خبير برمجة متمرس في كتابة الأكواد النظيفة والموثقة بشكل احترافي.",
          education: "أنت معلم خبير متخصص في شرح المفاهيم التعليمية بطريقة واضحة ومبسطة.",
          crypto: "أنت محلل كريبتو وتداول محترف متخصص في تحليل الأسواق والعملات الرقمية.",
          article: "أنت كاتب محتوى محترف متخصص في كتابة المقالات الطويلة والشاملة.",
          exam: "أنت خبير في إعداد الأسئلة والامتحانات والمراجعات التعليمية.",
        };

        const enhancements = [];
        if (options.humanTone) enhancements.push("استخدم لهجة بشرية طبيعية وودية");
        if (options.examples) enhancements.push("قدم أمثلة عملية وواقعية");
        if (options.keyPoints) enhancements.push("اعرض النقاط الرئيسية بشكل منظم وأضف ملخصاً في النهاية");
        if (options.engaging) enhancements.push("استخدم أسلوباً جدلياً محفزاً للتفاعل والنقاش");

        const complexityInstructions = {
          "بسيط": "اجعل المحتوى بسيطاً وسهل الفهم للمبتدئين",
          "متوسط": "اجعل المحتوى متوازناً بين البساطة والعمق",
          "متقدم": "اجعل المحتوى متقدماً ومفصلاً للخبراء والمحترفين",
        };
        enhancements.push(complexityInstructions[options.complexity]);

        const systemPrompt = `${usageTypePrompts[usageType]}

مهمتك هي تحسين البرومبت التالي وجعله أكثر فعالية واحترافية.

متطلبات التحسين:
${enhancements.map((e, i) => `${i + 1}. ${e}`).join("\n")}

قم بإعادة صياغة البرومبت بشكل محسّن ومنظم، مع الحفاظ على الهدف الأساسي وإضافة التفاصيل المناسبة.
يجب أن يكون البرومبت المحسّن جاهزاً للاستخدام مباشرة مع أي نموذج ذكاء اصطناعي.

البرومبت الأساسي المطلوب تحسينه:
"${basePrompt}"

قم بكتابة البرومبت المحسّن فقط، بدون أي مقدمات أو شروحات إضافية.`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: "قم بتحسين البرومبت الآن:" },
            ],
          });
          const content = response.choices[0]?.message?.content;
          const enhancedPrompt = typeof content === 'string' ? content.trim() : basePrompt;
          return {
            enhancedPrompt,
            originalPrompt: basePrompt,
          };
        } catch (error) {
          console.error("Error generating prompt:", error);
          throw new Error("فشل في توليد البرومبت. الرجاء المحاولة مرة أخرى.");
        }
      }),
  }),

  templates: router({    // Get template usage count
    getUsage: publicProcedure
      .input(z.object({ templateId: z.string() }))
      .query(async ({ input }) => {
        return await db.getTemplateUsage(input.templateId);
      }),

    // Increment template usage count
    incrementUsage: publicProcedure
      .input(z.object({ templateId: z.string() }))
      .mutation(async ({ input }) => {
        await db.incrementTemplateUsage(input.templateId);
        return { success: true };
      }),

    // Get template ratings
    getRatings: publicProcedure
      .input(z.object({ templateId: z.string() }))
      .query(async ({ input }) => {
        return await db.getTemplateRatings(input.templateId);
      }),

    // Add template rating
    addRating: protectedProcedure
      .input(
        z.object({
          templateId: z.string(),
          rating: z.number().min(1).max(5),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await db.addTemplateRating({
          templateId: input.templateId,
          userId: ctx.user.id,
          rating: input.rating,
          comment: input.comment || null,
        });
        return { success: true };
      }),

    // Get user's rating for a template
    getUserRating: protectedProcedure
      .input(z.object({ templateId: z.string() }))
      .query(async ({ ctx, input }) => {
        return await db.getUserTemplateRating(ctx.user.id, input.templateId);
      }),
  }),

  worksheets: router({
    generate: publicProcedure
      .input(
        z.object({
          generationMethod: z.enum(["text", "file", "title"]),
          questionType: z.enum(["multiple_choice", "short_answer", "essay", "true_false", "fill_blank", "mixed"]),
          questionCount: z.number().min(1).max(30),
          language: z.string(),
          gradeLevel: z.string(),
          lessonTitle: z.string(),
          teacherName: z.string().optional(),
          schoolName: z.string().optional(),
          sourceText: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Generate worksheet content using LLM
        const prompt = `أنت مساعد تعليمي متخصص في إنشاء أوراق العمل.

المهمة: إنشاء ورقة عمل تعليمية بالمواصفات التالية:
- عنوان الدرس: ${input.lessonTitle}
- نوع الأسئلة: ${input.questionType}
- عدد الأسئلة: ${input.questionCount}
- المرحلة الدراسية: ${input.gradeLevel}
- اللغة: ${input.language === "ar" ? "العربية" : "الإنجليزية"}
${input.teacherName ? `- اسم المعلم/ة: ${input.teacherName}` : ""}
${input.schoolName ? `- اسم المدرسة: ${input.schoolName}` : ""}
${input.sourceText ? `\n\nالنص المصدر:\n${input.sourceText}` : ""}

يرجى إنشاء ورقة عمل احترافية ومنسقة بشكل جيد مع الأسئلة والإجابات (في صفحة منفصلة).`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "أنت مساعد تعليمي متخصص في إنشاء أوراق العمل التعليمية.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const content = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : JSON.stringify(response.choices[0].message.content);

        // Save to database
        // لا يتم الحفظ في قاعدة البيانات، فقط إرجاع النتيجة

        // حذف تسجيل النشاط المرتبط بالمستخدم

        return { content };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserWorksheets(ctx.user.id);
    }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteWorksheet(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  llm: router({
    generatePrompt: publicProcedure
      .input(z.object({
        userInput: z.string().min(10),
        usageType: z.enum(["social", "code", "education", "crypto", "article", "exam"]),
        options: z.object({
          tone: z.string().optional(),
          examples: z.boolean().optional(),
          keyPoints: z.boolean().optional(),
          complexity: z.enum(["بسيط", "متوسط", "متقدم"]).optional(),
          engaging: z.boolean().optional(),
        }).optional(),
        llmOptions: z.object({
          priority: z.enum(['speed', 'quality', 'cost', 'balanced']).optional(),
        }).optional()
      }))
      .mutation(async ({ input }) => {
        const { userInput, usageType, options, llmOptions } = input;
        const systemPrompt = buildSystemPromptForHybrid(userInput, usageType, options);
        const priority: Priority = (llmOptions?.priority || 'balanced') as Priority;
        
        console.log(`🚀 توليد برومبت هجين - الأولوية: ${priority}`);
        
        const response = await hybridLLM.sendRequest({
          prompt: systemPrompt,
          taskType: 'generate_prompt',
          priority,
          maxTokens: getMaxTokensByLength(options?.complexity),
        });
        
        if (!response.success) {
          throw new Error(`فشل التوليد: ${response.error}`);
        }
        
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

    analyzePrompt: publicProcedure
      .input(z.object({
        prompt: z.string().min(20),
        llmOptions: z.object({
          priority: z.enum(['speed', 'quality', 'cost', 'balanced']).optional(),
        }).optional()
      }))
      .mutation(async ({ input }) => {
        const { prompt, llmOptions } = input;
        const priority: Priority = (llmOptions?.priority || 'quality') as Priority;
        
        const analysisPrompt = `أنت خبير تحليل برومبتات. حلل البرومبت التالي:
"${prompt}"

قدم:
1. التقييم من 1-10
2. نقاط القوة
3. نقاط الضعف
4. اقتراحات التحسين`;

        const response = await hybridLLM.sendRequest({
          prompt: analysisPrompt,
          taskType: 'analyze_prompt',
          priority,
          maxTokens: 2000,
          temperature: 0.3
        });
        
        if (!response.success) {
          throw new Error('فشل التحليل');
        }
        
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

    getLLMStats: publicProcedure
      .query(() => {
        const stats = hybridLLM.getUsageStats();
        const available = hybridLLM.getAvailableProviders();
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

    testProviders: publicProcedure
      .input(z.object({
        prompt: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { prompt } = input;
        const available = hybridLLM.getAvailableProviders();
        
        const results = await Promise.allSettled(
          available.map(p =>
            hybridLLM.sendRequest({
              prompt,
              taskType: 'general',
              preferredProvider: p.provider as any,
              maxTokens: 500
            })
          )
        );
        
        const comparison = results.map((result, index) => {
          if (result.status === 'fulfilled') {
            const response = result.value;
            return {
              provider: available[index].provider,
              success: response.success,
              responseTime: response.responseTime,
              tokensUsed: response.tokensUsed,
              cost: response.cost,
              model: response.model
            };
          }
          return {
            provider: available[index].provider,
            success: false,
            error: 'Failed'
          };
        });
        
        return { comparison };
      }),

    translateText: publicProcedure
      .input(z.object({
        text: z.string(),
        targetLanguage: z.enum(['ar', 'en']),
      }))
      .mutation(async ({ input }) => {
        const { text, targetLanguage } = input;
        const translatePrompt = `ترجم النص إلى ${targetLanguage === 'ar' ? 'العربية' : 'الإنجليزية'}:\n\n${text}`;
        
        const response = await hybridLLM.sendRequest({
          prompt: translatePrompt,
          taskType: 'translate',
          priority: 'quality',
          maxTokens: 2000
        });
        
        if (!response.success) {
          throw new Error('فشلت الترجمة');
        }
        
        return {
          translatedText: response.content,
          metadata: {
            provider: response.provider,
            tokensUsed: response.tokensUsed
          }
        };
      }),
  }),

  images: router({
    generateNanoBanana: publicProcedure
      .input(z.object({ prompt: z.string().min(10).max(500) }))
      .mutation(async ({ input }) => {
        try {
          // Using Replit's Gemini AI integration - no API key needed!
          const { GoogleGenAI, Modality } = await import('@google/genai');
          
          const ai = new GoogleGenAI({
            apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || 'dummy',
            httpOptions: {
              apiVersion: '',
              baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
            },
          });

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [{ role: 'user', parts: [{ text: input.prompt }] }],
            config: {
              responseModalities: [Modality.TEXT, Modality.IMAGE],
            },
          });

          const candidate = response.candidates?.[0];
          const imagePart = candidate?.content?.parts?.find((part: any) => part.inlineData);
          
          if (!imagePart?.inlineData?.data) {
            throw new Error('لم يتم توليد صورة');
          }

          const mimeType = imagePart.inlineData.mimeType || 'image/png';
          const imageUrl = `data:${mimeType};base64,${imagePart.inlineData.data}`;
          
          return {
            imageUrl,
            success: true,
          };
        } catch (error) {
          console.error('Image generation error:', error);
          throw new Error('فشل توليد الصورة. يرجى المحاولة مرة أخرى.');
        }
      }),
  }),
});

function buildSystemPromptForHybrid(userInput: string, usageType: string, options?: any): string {
  const usageTypeMap: Record<string, string> = {
    social: 'محتوى السوشيال ميديا',
    code: 'البرمجة والأكواد',
    education: 'التعليم والشرح',
    crypto: 'تحليل العملات الرقمية',
    article: 'كتابة المقالات',
    exam: 'الأسئلة والاختبارات'
  };
  
  let prompt = `أنت خبير في ${usageTypeMap[usageType]}. حسّن البرومبت التالي:\n"${userInput}"\n`;
  
  if (options?.examples) prompt += '\nأضف أمثلة عملية.';
  if (options?.keyPoints) prompt += '\nاستخدم نقاط رئيسية منظمة.';
  if (options?.engaging) prompt += '\nاجعل الأسلوب جذاباً ومحفزاً.';
  
  return prompt;
}

function getMaxTokensByLength(complexity?: string): number {
  switch (complexity) {
    case 'بسيط': return 500;
    case 'متقدم': return 3000;
    default: return 1500;
  }
}

export type AppRouter = typeof appRouter;
