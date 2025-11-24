import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TourGuide } from "./components/TourGuide";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import MyLibrary from "./pages/MyLibrary";
import Profile from "./pages/Profile";
import History from "./pages/History";
import SharedPrompt from "./pages/SharedPrompt";
import Worksheets from "./pages/Worksheets";
import Templates from "./pages/Templates";
import Popular from "./pages/Popular";
import WorksheetTemplates from "./pages/WorksheetTemplates";
import ProfessionalPrompts from "./pages/ProfessionalPrompts";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/professional-prompts" component={ProfessionalPrompts} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/library" component={Library} />
      <Route path={"/my-library"} component={MyLibrary} />
      <Route path="/profile" component={Profile} />
      <Route path="/history" component={History} />
      <Route path="/share/:token" component={SharedPrompt} />
      <Route path="/worksheets" component={Worksheets} />
      <Route path="/templates" component={Templates} />
      <Route path="/popular" component={Popular} />
      <Route path="/worksheet-templates" component={WorksheetTemplates} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const [runTour, setRunTour] = useState(false);

  // تحقق إذا كان المستخدم قد شاهد الجولة من قبل
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      // ابدأ الجولة تلقائياً للمستخدمين الجدد بعد ثانية
      setTimeout(() => setRunTour(true), 1000);
    }
  }, []);

  const handleTourFinish = () => {
    setRunTour(false);
    localStorage.setItem('hasSeenTour', 'true');
  };

  const handleTourStart = () => {
    setRunTour(true);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          
          {/* الجولة التعريفية */}
          <TourGuide run={runTour} onFinish={handleTourFinish} />
          
          {/* زر الجولة التعريفية الثابت */}
          <Button
            className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 shadow-lg hover:shadow-xl transition-all duration-300 gap-2 text-sm md:text-base"
            size="default"
            onClick={handleTourStart}
          >
            <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">ابدأ الجولة التعريفية</span>
            <span className="sm:hidden">جولة تعريفية</span>
          </Button>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
