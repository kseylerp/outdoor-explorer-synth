
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TripDetails from "./pages/TripDetails";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import Destinations from "./pages/Destinations";
import Maps from "./pages/Maps";
import About from "./pages/About";
import SavedTrips from "./pages/SavedTrips";
import Settings from "./pages/Settings";

// Main app layout components
import MainNav from "./components/MainNav";
import TopNav from "./components/TopNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "./hooks/use-mobile";

// Guide Portal components
import GuidePortalLayout from "./components/guide/GuidePortalLayout";
import Services from "./pages/guide/Services";
import GuideRecommendations from "./pages/guide/GuideRecommendations";
import GuideContent from "./pages/guide/GuideContent";
import GuideProfile from "./pages/guide/GuideProfile";
import GuideAnalytics from "./pages/guide/GuideAnalytics";

const queryClient = new QueryClient();

const AppContent = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen w-full">
      {!isMobile && <MainNav />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto">
          <Routes>
            {/* Main App Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/saved-trips" element={<SavedTrips />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Guide Portal Routes - using the layout with auth protection */}
            <Route path="/guide-portal" element={<GuidePortalLayout />}>
              <Route index element={<GuideAnalytics />} />
              <Route path="services" element={<Services />} />
              <Route path="recommendations" element={<GuideRecommendations />} />
              <Route path="content" element={<GuideContent />} />
              <Route path="profile" element={<GuideProfile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SidebarProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
