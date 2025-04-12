
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm sr-only sm:not-sr-only">Dawn</span>
      <Sun className="h-4 w-4" aria-label="Dawn" />
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
      <Moon className="h-4 w-4" aria-label="Dusk" />
      <span className="text-sm sr-only sm:not-sr-only">Dusk</span>
    </div>
  );
}
