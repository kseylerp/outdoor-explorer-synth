
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import TopNav from './components/TopNav';
import MainNav from './components/MainNav';
import Index from './pages/Index';
import Explore from './pages/Explore';
import SavedTrips from './pages/SavedTrips';
import TripDetails from './pages/TripDetails';
import Maps from './pages/Maps';
import CampgroundBooking from './pages/CampgroundBooking';
import About from './pages/About';
import Settings from './pages/Settings';
import Destinations from './pages/Destinations';
import NotFound from './pages/NotFound';
import GuidePortal from './pages/guide/GuidePortal';
import { useIsMobile } from '@/hooks/use-mobile';

// Add the import for our new page
import TripResponse from './pages/TripResponse';

function App() {
  const isMobile = useIsMobile();

  return (
    <BrowserRouter>
      <div className="app-container">
        <TopNav />
        <div className="content-container">
          <MainNav />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/saved-trips" element={<SavedTrips />} />
              <Route path="/trip/:id" element={<TripDetails />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/campgrounds" element={<CampgroundBooking />} />
              <Route path="/about" element={<About />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/trip-response" element={<TripResponse />} />
              <Route path="/guide" element={<GuidePortal />} />
              <Route path="/guide/*" element={<GuidePortal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
