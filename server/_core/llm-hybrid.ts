/**
 * 🤖 Hybrid LLM System for Raqim AI 966
 * 
 * نظام ذكي يدعم عدة نماذج LLM مع توجيه تلقائي بناءً على:
 * - نوع المهمة (توليد، تحليل، ترجمة)
 * - حجم الإدخال
 * - الأولوية (سرعة، جودة، تكلفة)
 * - توفر النموذج
 */

import axios, { AxiosInstance } from 'axios';

// ===== تعريف الأنواع =====

export type LLMProvider = 'gemini' | 'deepseek' | 'claude' | 'gpt4' | 'humain';

export type TaskType = 
  | 'generate_prompt'      // توليد برومبت
  | 'analyze_prompt'       // تحليل برومبت
  | 'translate'            // ترجمة
  | 'summarize'            // تلخيص
  | 'creative_writing'     // كتابة إبداعية
  | 'code_generation'      // توليد كود
  | 'general';             // عام

export type Priority = 'speed' | 'quality' | 'cost' | 'balanced';

export interface LLMConfig {
  provider: LLMProvider;
  apiUrl: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  enabled: boolean;
  costPer1kTokens: number;  // بالدولار
  avgResponseTime: number;   // بالثواني
  qualityScore: number;      // من 1-10
}

export interface LLMRequest {
  prompt: string;
  taskType?: TaskType;
  priority?: Priority;
  maxTokens?: number;
  temperature?: number;
  preferredProvider?: LLMProvider;
}

export interface LLMResponse {
  content: string;
  provider: LLMProvider;
  model: string;
  tokensUsed: number;
  cost: number;
  responseTime: number;
  success: boolean;
  error?: string;
}

// ===== تكوين النماذج =====

export class HybridLLMSystem {
  private configs: Map<LLMProvider, LLMConfig> = new Map();
  private clients: Map<LLMProvider, AxiosInstance> = new Map();
  private usageStats: Map<LLMProvider, { requests: number; tokens: number; cost: number }> = new Map();

  constructor() {
    this.initializeConfigs();
    this.initializeClients();
    this.initializeStats();
  }

  /**
   * تهيئة تكوينات جميع النماذج
   */
  private initializeConfigs(): void {
    // Google Gemini
    this.configs.set('gemini', {
      provider: 'gemini',
      apiUrl: process.env.LLM_API_URL || 'https://generativelanguage.googleapis.com',
      apiKey: process.env.LLM_API_KEY || '',
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      maxTokens: 8192,
      temperature: 0.7,
      enabled: !!process.env.LLM_API_KEY,
      costPer1kTokens: 0.00025,
      avgResponseTime: 2.5,
      qualityScore: 8
    });

    // DeepSeek
    this.configs.set('deepseek', {
      provider: 'deepseek',
      apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      maxTokens: 8192,
      temperature: 0.7,
      enabled: !!process.env.DEEPSEEK_API_KEY,
      costPer1kTokens: 0.00014,
      avgResponseTime: 3.0,
      qualityScore: 7
    });

    // Claude (Anthropic)
    this.configs.set('claude', {
      provider: 'claude',
      apiUrl: process.env.CLAUDE_API_URL || 'https://api.anthropic.com',
      apiKey: process.env.CLAUDE_API_KEY || '',
      model: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',
      maxTokens: 4096,
      temperature: 0.7,
      enabled: !!process.env.CLAUDE_API_KEY,
      costPer1kTokens: 0.00025,
      avgResponseTime: 2.0,
      qualityScore: 9
    });

    // GPT-4 (OpenAI)
    this.configs.set('gpt4', {
      provider: 'gpt4',
      apiUrl: process.env.OPENAI_API_URL || 'https://api.openai.com',
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      maxTokens: 4096,
      temperature: 0.7,
      enabled: !!process.env.OPENAI_API_KEY,
      costPer1kTokens: 0.00015,
      avgResponseTime: 3.5,
      qualityScore: 9
    });

    // HUMAIN (Local Saudi Model)
    this.configs.set('humain', {
      provider: 'humain',
      apiUrl: process.env.HUMAIN_API_URL || 'https://api.humain.sa',
      apiKey: process.env.HUMAIN_API_KEY || '',
      model: process.env.HUMAIN_MODEL || 'humain-1',
      maxTokens: 4096,
      temperature: 0.7,
      enabled: !!process.env.HUMAIN_API_KEY,
      costPer1kTokens: 0.0001,
      avgResponseTime: 2.5,
      qualityScore: 8
    });
  }

  /**
   * تهيئة عملاء HTTP لكل نموذج
   */
  private initializeClients(): void {
    this.configs.forEach((config, provider) => {
      if (config.enabled) {
        this.clients.set(provider, axios.create({
          baseURL: config.apiUrl,
          timeout: 30000,
          headers: this.getHeaders(provider, config)
        }));
      }
    });
  }

  /**
   * تهيئة إحصائيات الاستخدام
   */
  private initializeStats(): void {
    this.configs.forEach((_, provider) => {
      this.usageStats.set(provider, {
        requests: 0,
        tokens: 0,
        cost: 0
      });
    });
  }

  /**
   * الحصول على Headers المناسبة لكل نموذج
   */
  private getHeaders(provider: LLMProvider, config: LLMConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    switch (provider) {
      case 'gemini':
        headers['x-goog-api-key'] = config.apiKey;
        break;
      case 'claude':
        headers['x-api-key'] = config.apiKey;
        headers['anthropic-version'] = '2023-06-01';
        break;
      case 'gpt4':
        headers['Authorization'] = `Bearer ${config.apiKey}`;
        break;
      case 'deepseek':
      case 'humain':
        headers['Authorization'] = `Bearer ${config.apiKey}`;
        break;
    }

    return headers;
  }

  /**
   * 🎯 اختيار النموذج الأمثل بناءً على المهمة والأولوية
   */
  selectBestProvider(taskType: TaskType, priority: Priority): LLMProvider {
    const availableProviders = Array.from(this.configs.entries())
      .filter(([_, config]) => config.enabled)
      .map(([provider, config]) => ({ provider, config }));

    if (availableProviders.length === 0) {
      throw new Error('❌ لا توجد نماذج LLM متاحة!');
    }

    // حسب الأولوية
    switch (priority) {
      case 'speed':
        return this.selectBySpeed(availableProviders);
      case 'quality':
        return this.selectByQuality(availableProviders, taskType);
      case 'cost':
        return this.selectByCost(availableProviders);
      case 'balanced':
      default:
        return this.selectBalanced(availableProviders, taskType);
    }
  }

  /**
   * اختيار حسب السرعة
   */
  private selectBySpeed(providers: Array<{ provider: LLMProvider; config: LLMConfig }>): LLMProvider {
    return providers.reduce((fastest, current) => 
      current.config.avgResponseTime < fastest.config.avgResponseTime ? current : fastest
    ).provider;
  }

  /**
   * اختيار حسب الجودة
   */
  private selectByQuality(providers: Array<{ provider: LLMProvider; config: LLMConfig }>, taskType: TaskType): LLMProvider {
    // نماذج معينة أفضل لمهام معينة
    const taskPreferences: Record<TaskType, LLMProvider[]> = {
      generate_prompt: ['deepseek', 'claude', 'gpt4'],
      analyze_prompt: ['deepseek', 'claude', 'gpt4'],
      translate: ['deepseek', 'gpt4', 'humain'],
      summarize: ['deepseek', 'claude', 'gpt4'],
      creative_writing: ['gpt4', 'deepseek', 'claude'],
      code_generation: ['deepseek', 'gpt4', 'claude'],
      general: ['deepseek', 'claude', 'gpt4']
    };

    const preferred = taskPreferences[taskType] || taskPreferences.general;
    
    for (const provider of preferred) {
      if (providers.some(p => p.provider === provider)) {
        return provider;
      }
    }

    // إذا لم يتوفر النموذج المفضل، اختر الأعلى جودة
    return providers.reduce((best, current) => 
      current.config.qualityScore > best.config.qualityScore ? current : best
    ).provider;
  }

  /**
   * اختيار حسب التكلفة
   */
  private selectByCost(providers: Array<{ provider: LLMProvider; config: LLMConfig }>): LLMProvider {
    return providers.reduce((cheapest, current) => 
      current.config.costPer1kTokens < cheapest.config.costPer1kTokens ? current : cheapest
    ).provider;
  }

  /**
   * اختيار متوازن
   */
  private selectBalanced(providers: Array<{ provider: LLMProvider; config: LLMConfig }>, taskType: TaskType): LLMProvider {
    // معادلة موزونة: الجودة 40% + السرعة 30% + التكلفة 30%
    const scored = providers.map(({ provider, config }) => {
      const qualityScore = (config.qualityScore / 10) * 0.4;
      const speedScore = (1 - (config.avgResponseTime / 5)) * 0.3;
      const costScore = (1 - (config.costPer1kTokens / 0.001)) * 0.3;
      const totalScore = qualityScore + speedScore + costScore;

      return { provider, score: totalScore };
    });

    return scored.reduce((best, current) => 
      current.score > best.score ? current : best
    ).provider;
  }

  /**
   * 🚀 إرسال طلب للنموذج
   */
  async sendRequest(request: LLMRequest): Promise<LLMResponse> {
    const startTime = Date.now();
    const {
      prompt,
      taskType = 'general',
      priority = 'balanced',
      maxTokens,
      temperature,
      preferredProvider
    } = request;

    // اختيار النموذج
    const provider = preferredProvider && this.configs.get(preferredProvider)?.enabled
      ? preferredProvider
      : this.selectBestProvider(taskType, priority);

    const config = this.configs.get(provider)!;
    const client = this.clients.get(provider)!;

    try {
      // إعداد الطلب حسب النموذج
      const requestBody = this.prepareRequest(provider, config, {
        prompt,
        maxTokens: maxTokens || config.maxTokens,
        temperature: temperature || config.temperature
      });

      // إرسال الطلب
      const response = await client.post(this.getEndpoint(provider), requestBody);

      // استخراج النتيجة
      const content = this.extractContent(provider, response.data);
      const tokensUsed = this.extractTokens(provider, response.data);
      const cost = (tokensUsed / 1000) * config.costPer1kTokens;
      const responseTime = (Date.now() - startTime) / 1000;

      // تحديث الإحصائيات
      this.updateStats(provider, tokensUsed, cost);

      return {
        content,
        provider,
        model: config.model,
        tokensUsed,
        cost,
        responseTime,
        success: true
      };

    } catch (error: any) {
      console.error(`❌ خطأ في ${provider}:`, error.message);

      // محاولة مع نموذج بديل
      if (!preferredProvider) {
        const fallbackProvider = this.getFallbackProvider(provider);
        if (fallbackProvider) {
          console.log(`🔄 المحاولة مع ${fallbackProvider}...`);
          return this.sendRequest({
            ...request,
            preferredProvider: fallbackProvider
          });
        }
      }

      return {
        content: '',
        provider,
        model: config.model,
        tokensUsed: 0,
        cost: 0,
        responseTime: (Date.now() - startTime) / 1000,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * إعداد جسم الطلب حسب النموذج
   */
  private prepareRequest(provider: LLMProvider, config: LLMConfig, params: any): any {
    const { prompt, maxTokens, temperature } = params;

    switch (provider) {
      case 'gemini':
        return {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature
          }
        };

      case 'claude':
        return {
          model: config.model,
          max_tokens: maxTokens,
          temperature,
          messages: [{
            role: 'user',
            content: prompt
          }]
        };

      case 'gpt4':
      case 'deepseek':
      case 'humain':
        return {
          model: config.model,
          max_tokens: maxTokens,
          temperature,
          messages: [{
            role: 'user',
            content: prompt
          }]
        };
    }
  }

  /**
   * الحصول على endpoint المناسب
   */
  private getEndpoint(provider: LLMProvider): string {
    const config = this.configs.get(provider)!;
    
    switch (provider) {
      case 'gemini':
        return `/v1beta/models/${config.model}:generateContent`;
      case 'claude':
        return '/v1/messages';
      case 'gpt4':
        return '/v1/chat/completions';
      case 'deepseek':
      case 'humain':
        return '/v1/chat/completions';
      default:
        return '/v1/chat/completions';
    }
  }

  /**
   * استخراج المحتوى من الاستجابة
   */
  private extractContent(provider: LLMProvider, data: any): string {
    switch (provider) {
      case 'gemini':
        return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      case 'claude':
        return data.content?.[0]?.text || '';
      case 'gpt4':
      case 'deepseek':
      case 'humain':
        return data.choices?.[0]?.message?.content || '';
      default:
        return '';
    }
  }

  /**
   * استخراج عدد الـ tokens
   */
  private extractTokens(provider: LLMProvider, data: any): number {
    switch (provider) {
      case 'gemini':
        return data.usageMetadata?.totalTokenCount || 0;
      case 'claude':
        return (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);
      case 'gpt4':
      case 'deepseek':
      case 'humain':
        return data.usage?.total_tokens || 0;
      default:
        return 0;
    }
  }

  /**
   * الحصول على نموذج بديل
   */
  private getFallbackProvider(failedProvider: LLMProvider): LLMProvider | null {
    const fallbackOrder: LLMProvider[] = ['deepseek', 'claude', 'gpt4', 'gemini', 'humain'];
    const available = fallbackOrder.filter(p => 
      p !== failedProvider && this.configs.get(p)?.enabled
    );
    return available[0] || null;
  }

  /**
   * تحديث الإحصائيات
   */
  private updateStats(provider: LLMProvider, tokens: number, cost: number): void {
    const stats = this.usageStats.get(provider);
    if (stats) {
      stats.requests++;
      stats.tokens += tokens;
      stats.cost += cost;
    }
  }

  /**
   * 📊 الحصول على إحصائيات الاستخدام
   */
  getUsageStats(): Record<LLMProvider, { requests: number; tokens: number; cost: number }> {
    const stats: any = {};
    this.usageStats.forEach((value, key) => {
      stats[key] = { ...value };
    });
    return stats;
  }

  /**
   * 📊 الحصول على معلومات النماذج المتاحة
   */
  getAvailableProviders(): Array<{ provider: LLMProvider; config: Omit<LLMConfig, 'apiKey'> }> {
    return Array.from(this.configs.entries())
      .filter(([_, config]) => config.enabled)
      .map(([provider, config]) => ({
        provider,
        config: {
          ...config,
          apiKey: '***' // إخفاء API Key
        }
      }));
  }
}

// ===== تصدير Instance واحد =====
export const hybridLLM = new HybridLLMSystem();
