import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Search, Home, Users, DollarSign, Settings, HelpCircle } from "lucide-react";

const shortcuts = [
  { key: "?", description: "Show keyboard shortcuts", icon: HelpCircle, category: "General" },
  { key: "/", description: "Focus search", icon: Search, category: "Navigation" },
  { key: "g h", description: "Go to home", icon: Home, category: "Navigation" },
  { key: "g m", description: "Go to marketplace", icon: Users, category: "Navigation" },
  { key: "g d", description: "Go to dashboard", icon: DollarSign, category: "Navigation" },
  { key: "g s", description: "Go to settings", icon: Settings, category: "Navigation" },
  { key: "Esc", description: "Close modals/dialogs", icon: Keyboard, category: "General" },
  { key: "Ctrl/⌘ K", description: "Open command palette", icon: Keyboard, category: "General" },
];

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = Array.from(new Set(shortcuts.map((s) => s.category)));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl" data-testid="keyboard-shortcuts-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Press <kbd className="px-2 py-1 text-xs font-semibold rounded bg-muted">?</kbd> to
            toggle this menu
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">{category}</h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut) => {
                    const Icon = shortcut.icon;
                    return (
                      <div
                        key={shortcut.key}
                        className="flex items-center justify-between p-2 rounded-md hover-elevate"
                        data-testid={`shortcut-${shortcut.key.replace(" ", "-")}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{shortcut.description}</span>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {shortcut.key}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Global keyboard shortcuts handler
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Focus search with "/"
      if (e.key === "/" && !isCtrlOrCmd) {
        e.preventDefault();
        const searchInput = document.querySelector('[data-testid="search-input"]') as HTMLInputElement;
        searchInput?.focus();
      }

      // Navigation shortcuts with "g"
      if (e.key === "g" && !isCtrlOrCmd) {
        const nextKey = new Promise<string>((resolve) => {
          const handler = (nextE: KeyboardEvent) => {
            window.removeEventListener("keydown", handler);
            resolve(nextE.key);
          };
          window.addEventListener("keydown", handler);
          setTimeout(() => {
            window.removeEventListener("keydown", handler);
            resolve("");
          }, 1000);
        });

        nextKey.then((key) => {
          switch (key) {
            case "h":
              window.location.href = "/";
              break;
            case "m":
              window.location.href = "/marketplace";
              break;
            case "d":
              window.location.href = "/dashboard";
              break;
            case "s":
              window.location.href = "/settings";
              break;
          }
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
