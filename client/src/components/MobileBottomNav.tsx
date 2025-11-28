import { Home, BookOpen, TrendingUp, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";

export default function MobileBottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "مولّد البرومبتات", href: "/" },
    { icon: Sparkles, label: "برومبتات الصور", href: "/image-generator" },
    { icon: BookOpen, label: "🛠️ ابني البرومبت", href: "#prompt-builder" },
    { icon: TrendingUp, label: "مولد أوراق العمل", href: "/worksheets" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href} asChild>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className="flex flex-col items-center justify-center h-full flex-1 rounded-none gap-0.5"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
