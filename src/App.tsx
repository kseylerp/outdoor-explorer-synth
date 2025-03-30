
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
import MainNav from "./components/MainNav";
import TopNav from "./components/TopNav";
import { useIsMobile } from "@/hooks/use-mobile";

const queryClient = new QueryClient();

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen w-full">
      <MainNav />
      <div className={`flex-1 flex flex-col ${isMobile ? 'ml-12' : 'ml-64'} transition-all duration-300`}>
        <TopNav />
        <main className="flex-1 overflow-auto">
          {children}
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/trip/:id" element={<MainLayout><TripDetails /></MainLayout>} />
          <Route path="/explore" element={<MainLayout><Explore /></MainLayout>} />
          <Route path="/saved-trips" element={<MainLayout><SavedTrips /></MainLayout>} />
          <Route path="/destinations" element={<MainLayout><Destinations /></MainLayout>} />
          <Route path="/maps" element={<MainLayout><Maps /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
