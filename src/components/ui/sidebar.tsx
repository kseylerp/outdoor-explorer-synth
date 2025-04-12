
import { create } from "zustand";
import { useState, useEffect, createContext, useContext } from 'react';
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarState {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  closeSidebar: () => set({ isOpen: false }),
  openSidebar: () => set({ isOpen: true }),
}));

export const SidebarContext = createContext<SidebarState | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    // Fall back to the store if not in provider
    return useSidebarStore();
  }
  return context;
};

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const sidebarStore = useSidebarStore();
  
  return (
    <SidebarContext.Provider value={sidebarStore}>
      {children}
    </SidebarContext.Provider>
  );
};

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  showToggle?: boolean;
  mobileFullWidth?: boolean;
}

export function Sidebar({ 
  children, 
  className,
  showToggle = true,
  mobileFullWidth = true
}: SidebarProps) {
  const { isOpen, toggleSidebar } = useSidebar();
  const [mounted, setMounted] = useState(false);
  
  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <>
      {/* Mobile overlay */}
      {mounted && isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" 
          onClick={() => toggleSidebar()}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 left-0 z-50 h-screen transition-transform duration-300 bg-[#EFF3EE] dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          mobileFullWidth ? "w-full sm:w-64 md:w-64" : "w-64",
          className
        )}
      >
        <div className="h-full overflow-y-auto">
          {showToggle && (
            <button 
              className="md:hidden absolute right-2 top-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
