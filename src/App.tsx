
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Explore from './pages/Explore';
import AgentChat from './pages/AgentChat'; // Add import
import RealtimeChat from './pages/RealtimeChat';
import TopNav from './components/TopNav';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col">
        <TopNav />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/chat" element={<RealtimeChat />} />
            <Route path="/agent" element={<AgentChat />} /> {/* Add new route */}
          </Routes>
        </div>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
