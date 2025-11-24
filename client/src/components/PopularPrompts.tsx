import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { TrendingUp, Heart, Eye, Copy, Star } from "lucide-react";
import { toast } from "sonner";

interface PopularPromptsProps {
  onUsePrompt?: (prompt: string) => void;
}

export default function PopularPrompts({ onUsePrompt }: PopularPromptsProps) {
  const { data: prompts, isLoading } = trpc.popularPrompts.list.useQuery({ limit: 8 });

  const useMutation = trpc.popularPrompts.use.useMutation();
  const likeMutation = trpc.popularPrompts.like.useMutation({
    onSuccess: () => {
      toast.success("شكراً لإعجابك!");
    },
  });

  const handleCopy = async (prompt: string) => {
    await navigator.clipboard.writeText(prompt);
    toast.success("تم نسخ البرومبت!");
  };

  const handleUse = (id: number, prompt: string) => {
    useMutation.mutate({ id });
    if (onUsePrompt) {
      onUsePrompt(prompt);
      // Scroll to generator
      const generator = document.getElementById("generator");
      generator?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLike = (id: number) => {
    likeMutation.mutate({ id });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse bg-card/50">
            <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!prompts || prompts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">لا توجد برومبتات شعبية حالياً</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {prompts.map((prompt) => (
        <Card
          key={prompt.id}
          className="p-6 bg-card/50 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg group"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {prompt.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{(prompt.rating / 10).toFixed(1)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{prompt.usageCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                <span>{prompt.likesCount.toLocaleString()}</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                {prompt.category}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {prompt.prompt}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => handleUse(prompt.id, prompt.prompt)}
              >
                <TrendingUp className="ml-2 w-4 h-4" />
                استخدم الآن
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(prompt.prompt)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLike(prompt.id)}
                disabled={likeMutation.isPending}
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
