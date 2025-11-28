import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationCenter from "./components/NotificationCenter";
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
import ImageGenerator from "./pages/ImageGenerator";
import { useEffect } from "react";
import ReactGA from "react-ga4";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    // تتبع كل صفحة عند تغييرها
    ReactGA.send({ 
      hitType: "pageview", 
      page: location, 
      title: document.title 
    });
  }, [location]);

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
      <Route path="/image-generator" component={ImageGenerator} />
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

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <NotificationCenter />
            <Router />
          </TooltipProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
