import { Star, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

interface TemplateRatingProps {
  templateId: string;
  templateTitle: string;
}

export default function TemplateRating({ templateId, templateTitle }: TemplateRatingProps) {
  const { isAuthenticated } = useAuth();
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch template ratings
  const { data: ratingsData } = trpc.templates.getRatings.useQuery({ templateId });
  
  // Fetch template usage
  const { data: usageData } = trpc.templates.getUsage.useQuery({ templateId });

  // Fetch user's rating if authenticated
  const { data: userRating } = trpc.templates.getUserRating.useQuery(
    { templateId }
  );

  // Add rating mutation
  const addRatingMutation = trpc.templates.addRating.useMutation({
    onSuccess: () => {
      toast.success("تم إضافة تقييمك بنجاح! 🌟");
      setShowRatingForm(false);
      setComment("");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إضافة التقييم");
    },
  });

  // Set existing rating if user already rated
  useEffect(() => {
    if (userRating) {
      setSelectedRating(userRating.rating);
      setComment(userRating.comment || "");
    }
  }, [userRating]);

  const handleRatingSubmit = () => {


    if (selectedRating === 0) {
      toast.error("يرجى اختيار تقييم أولاً");
      return;
    }

    addRatingMutation.mutate({
      templateId,
      rating: selectedRating,
      comment: comment.trim() || undefined,
    });
  };

  const averageRating = ratingsData?.averageRating || 0;
  const totalRatings = ratingsData?.totalRatings || 0;
  const usageCount = usageData?.usageCount || 0;

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-border/50">
      {/* عرض التقييم والاستخدام */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {/* التقييم */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">
              {averageRating > 0 ? averageRating.toFixed(1) : "—"}
            </span>
            <span className="text-muted-foreground/60">
              ({totalRatings})
            </span>
          </div>

          {/* عداد الاستخدام */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>استُخدم {usageCount} مرة</span>
          </div>
        </div>

        {/* زر التقييم */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRatingForm(!showRatingForm)}
          className="text-xs"
        >
          {userRating ? "تعديل التقييم" : "قيّم القالب"}
        </Button>
      </div>

      {/* نموذج التقييم */}
      {showRatingForm && (
        <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
          <div className="space-y-2">
            <label className="text-sm font-medium">تقييمك:</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || selectedRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
              {selectedRating > 0 && (
                <span className="text-sm text-muted-foreground mr-2">
                  {selectedRating === 5 && "ممتاز! 🌟"}
                  {selectedRating === 4 && "جيد جداً 👍"}
                  {selectedRating === 3 && "جيد ✓"}
                  {selectedRating === 2 && "مقبول"}
                  {selectedRating === 1 && "يحتاج تحسين"}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">تعليقك (اختياري):</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="شاركنا رأيك في هذا القالب..."
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-left">
              {comment.length}/500
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleRatingSubmit}
              disabled={addRatingMutation.isPending || selectedRating === 0}
              size="sm"
              className="flex-1"
            >
              {addRatingMutation.isPending ? "جاري الحفظ..." : userRating ? "تحديث التقييم" : "إرسال التقييم"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowRatingForm(false);
                if (!userRating) {
                  setSelectedRating(0);
                  setComment("");
                }
              }}
              size="sm"
            >
              إلغاء
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
