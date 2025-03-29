
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen w-full">
          <MainNav />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNav />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/trip/:id" element={<TripDetails />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/saved-trips" element={<SavedTrips />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/maps" element={<Maps />} />
                <Route path="/about" element={<About />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
