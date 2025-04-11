
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TripDetails from "./pages/TripDetails";
import NotFound from "./pages/NotFound";
import Maps from "./pages/Maps";
import About from "./pages/About";
import SavedTrips from "./pages/SavedTrips";
import Settings from "./pages/Settings";
import CampgroundBooking from "./pages/CampgroundBooking";

// Main app layout components
import MainNav from "./components/MainNav";
import TopNav from "./components/TopNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "./hooks/use-mobile";
import { ThemeProvider } from "./components/ThemeProvider";

// Guide Portal components
import GuidePortalLayout from "./components/guide/GuidePortalLayout";
import Services from "./pages/guide/Services";
import GuideRecommendations from "./pages/guide/GuideRecommendations";
import GuideContent from "./pages/guide/GuideContent";
import GuideProfile from "./pages/guide/GuideProfile";
import GuideAnalytics from "./pages/guide/GuideAnalytics";
import Activities from "./pages/guide/Activities";
import AddActivity from "./pages/guide/AddActivity";

const queryClient = new QueryClient();

// Main App Layout wrapper
const MainAppLayout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen w-full bg-white">
      {!isMobile && <MainNav />}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <TopNav />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route path="/saved-trips" element={<SavedTrips />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/campground/:id" element={<CampgroundBooking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <Routes>
      {/* Main application routes */}
      <Route path="/*" element={<MainAppLayout />} />
      
      {/* Guide Portal routes - completely separate experience */}
      <Route path="/guide-portal/*" element={<GuidePortalLayout />}>
        <Route index element={<GuideAnalytics />} />
        <Route path="activities" element={<Activities />} />
        <Route path="add-activity" element={<AddActivity />} />
        <Route path="edit-activity/:id" element={<AddActivity />} />
        <Route path="services" element={<Services />} />
        <Route path="recommendations" element={<GuideRecommendations />} />
        <Route path="content" element={<GuideContent />} />
        <Route path="profile" element={<GuideProfile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

// Changed functional component definition to wrap providers properly
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <SidebarProvider>
              <AppContent />
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
