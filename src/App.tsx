
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Explore from '@/pages/Explore';
import TripDetails from '@/pages/TripDetails';
import SavedTrips from '@/pages/SavedTrips';
import Maps from '@/pages/Maps';
import NotFound from '@/pages/NotFound';
import Destinations from '@/pages/Destinations';

// Guide Portal Routes
import GuideLayout from '@/layouts/GuideLayout';
import GuideLogin from '@/pages/guide/Login';
import GuideDashboard from '@/pages/guide/Dashboard';
import GuideProfile from '@/pages/guide/Profile';
import TripManagement from '@/pages/guide/TripManagement';
import CreateTrip from '@/pages/guide/CreateTrip';

import '@/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main App Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/trip/:id" element={<TripDetails />} />
        <Route path="/saved-trips" element={<SavedTrips />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/destinations" element={<Destinations />} />
        
        {/* Guide Portal Routes */}
        <Route path="/guide/login" element={<GuideLogin />} />
        <Route path="/guide" element={<GuideLayout />}>
          <Route path="dashboard" element={<GuideDashboard />} />
          <Route path="profile" element={<GuideProfile />} />
          <Route path="trips" element={<TripManagement />} />
          <Route path="create-trip" element={<CreateTrip />} />
          {/* Additional guide routes will be added here */}
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
