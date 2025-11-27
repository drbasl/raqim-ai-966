/**
 * 📊 LLM Statistics Dashboard Component
 * 
 * مكون React لعرض إحصائيات استخدام نظام Hybrid LLM
 * في Dashboard الإدارة
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  Zap,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Server,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { trpc } from '@/lib/trpc';

// ═══════════════════════════════════════════════════════════════
// 🎨 Types
// ═══════════════════════════════════════════════════════════════

interface ProviderStats {
  requests: number;
  tokens: number;
  cost: number;
}

interface LLMStats {
  byProvider: Record<string, ProviderStats>;
  totals: ProviderStats;
  availableProviders: Array<{
    provider: string;
    model: string;
    enabled: boolean;
  }>;
}

// ═══════════════════════════════════════════════════════════════
// 📊 Main Component
// ═══════════════════════════════════════════════════════════════

export function LLMStatsDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // جلب الإحصائيات من الخادم
  const { data: stats, refetch } = trpc.getLLMStats.useQuery(undefined, {
    refetchInterval: 30000 // تحديث كل 30 ثانية
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!stats) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin">
              <RefreshCw className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">جاري تحميل الإحصائيات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* العنوان والأزرار */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">📊 إحصائيات نظام LLM</h2>
          <p className="text-muted-foreground">مراقبة استخدام نماذج الذكاء الاصطناعي</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
      </div>

      {/* الإحصائيات الإجمالية */}
      <TotalStatsCards totals={stats.totals} />

      {/* النماذج المتاحة */}
      <AvailableProvidersCard providers={stats.availableProviders} />

      {/* تفاصيل كل نموذج */}
      <ProviderDetailsCards byProvider={stats.byProvider} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 📈 Total Stats Cards
// ═══════════════════════════════════════════════════════════════

function TotalStatsCards({ totals }: { totals: ProviderStats }) {
  const stats = [
    {
      title: 'إجمالي الطلبات',
      value: totals.requests.toLocaleString(),
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'إجمالي الـ Tokens',
      value: totals.tokens.toLocaleString(),
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'إجمالي التكلفة',
      value: `$${totals.cost.toFixed(4)}`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'متوسط التكلفة',
      value: totals.requests > 0 
        ? `$${(totals.cost / totals.requests).toFixed(6)}`
        : '$0.00',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🤖 Available Providers Card
// ═══════════════════════════════════════════════════════════════

function AvailableProvidersCard({ 
  providers 
}: { 
  providers: Array<{ provider: string; model: string; enabled: boolean }> 
}) {
  const providerInfo: Record<string, { name: string; icon: string; color: string }> = {
    gemini: { name: 'Google Gemini', icon: '🔷', color: 'bg-blue-500/20 text-blue-700 dark:text-blue-300' },
    deepseek: { name: 'DeepSeek', icon: '🧠', color: 'bg-purple-500/20 text-purple-700 dark:text-purple-300' },
    claude: { name: 'Anthropic Claude', icon: '🟣', color: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' },
    gpt4: { name: 'OpenAI GPT-4', icon: '🟢', color: 'bg-green-500/20 text-green-700 dark:text-green-300' },
    humain: { name: 'HUMAIN 🇸🇦', icon: '🌟', color: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="w-5 h-5" />
          النماذج المتاحة
        </CardTitle>
        <CardDescription>
          {providers.length} نموذج متاح للاستخدام
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {providers.map((provider) => {
            const info = providerInfo[provider.provider] || { 
              name: provider.provider, 
              icon: '🤖',
              color: 'bg-gray-500/20 text-gray-700'
            };
            
            return (
              <div
                key={provider.provider}
                className={`p-4 rounded-lg border-2 ${
                  provider.enabled 
                    ? 'border-green-500/50 bg-green-500/5' 
                    : 'border-gray-300 bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <p className="font-semibold">{info.name}</p>
                      <p className="text-xs text-muted-foreground">{provider.model}</p>
                    </div>
                  </div>
                  {provider.enabled ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <Badge 
                  variant={provider.enabled ? "default" : "secondary"}
                  className="text-xs"
                >
                  {provider.enabled ? 'نشط' : 'معطل'}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// 📊 Provider Details Cards
// ═══════════════════════════════════════════════════════════════

function ProviderDetailsCards({ 
  byProvider 
}: { 
  byProvider: Record<string, ProviderStats> 
}) {
  const providerInfo: Record<string, { name: string; icon: string; costPer1k: number }> = {
    gemini: { name: 'Gemini', icon: '🔷', costPer1k: 0.00025 },
    deepseek: { name: 'DeepSeek', icon: '🧠', costPer1k: 0.00014 },
    claude: { name: 'Claude', icon: '🟣', costPer1k: 0.00025 },
    gpt4: { name: 'GPT-4', icon: '🟢', costPer1k: 0.00015 },
    humain: { name: 'HUMAIN', icon: '🌟', costPer1k: 0.0001 }
  };

  const sortedProviders = Object.entries(byProvider)
    .sort(([, a], [, b]) => b.requests - a.requests);

  if (sortedProviders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">لا توجد بيانات استخدام بعد</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          تفاصيل الاستخدام حسب النموذج
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedProviders.map(([provider, stats]) => {
            const info = providerInfo[provider] || { 
              name: provider, 
              icon: '🤖',
              costPer1k: 0 
            };
            
            const avgTokensPerRequest = stats.requests > 0 
              ? Math.round(stats.tokens / stats.requests) 
              : 0;
            
            const avgCostPerRequest = stats.requests > 0 
              ? stats.cost / stats.requests 
              : 0;

            return (
              <div key={provider} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <p className="font-semibold">{info.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${info.costPer1k.toFixed(5)} / 1K tokens
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{stats.requests} طلب</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Tokens</p>
                    <p className="font-semibold">{stats.tokens.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      ~{avgTokensPerRequest} / طلب
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">التكلفة</p>
                    <p className="font-semibold">${stats.cost.toFixed(4)}</p>
                    <p className="text-xs text-muted-foreground">
                      ~${avgCostPerRequest.toFixed(6)} / طلب
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">الحصة</p>
                    <p className="font-semibold">
                      {((stats.requests / Object.values(byProvider).reduce((sum, s) => sum + s.requests, 0)) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <Separator />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
// 📤 Export
// ═══════════════════════════════════════════════════════════════

export default LLMStatsDashboard;
