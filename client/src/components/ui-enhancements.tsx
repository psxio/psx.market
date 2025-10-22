import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Bell, X, Check, Info, AlertTriangle, AlertCircle, Undo2, Keyboard, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Toast Notification Center Types
interface ToastNotification {
  id: string;
  title: string;
  description?: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: number;
  read: boolean;
}

// Undo/Redo Types
interface UndoAction {
  id: string;
  description: string;
  undo: () => void | Promise<void>;
  timestamp: number;
}

// Confirmation Dialog Types
interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

// UI Enhancements Context
interface UIEnhancementsContextType {
  // Toast Notification Center
  notifications: ToastNotification[];
  addNotification: (notification: Omit<ToastNotification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;

  // Data Density
  dataDensity: "compact" | "comfortable" | "spacious";
  setDataDensity: (density: "compact" | "comfortable" | "spacious") => void;

  // Keyboard Shortcuts
  registerShortcut: (key: string, description: string, callback: () => void) => void;
  unregisterShortcut: (key: string) => void;
  showShortcuts: () => void;

  // Confirmation Modal
  confirm: (options: ConfirmationOptions) => Promise<boolean>;

  // Undo/Redo
  addUndoAction: (description: string, undo: () => void | Promise<void>) => void;
  performUndo: () => Promise<void>;
  canUndo: boolean;
  undoStackSize: number;
}

const UIEnhancementsContext = createContext<UIEnhancementsContextType | undefined>(undefined);

export function useUIEnhancements() {
  const context = useContext(UIEnhancementsContext);
  if (!context) {
    throw new Error("useUIEnhancements must be used within UIEnhancementsProvider");
  }
  return context;
}

// Provider Component
export function UIEnhancementsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [dataDensity, setDataDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable");
  const [shortcuts, setShortcuts] = useState<Map<string, { description: string; callback: () => void }>>(new Map());
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    options?: ConfirmationOptions;
    resolve?: (value: boolean) => void;
  }>({ open: false });
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ui-preferences");
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        if (prefs.dataDensity) setDataDensity(prefs.dataDensity);
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("ui-preferences", JSON.stringify({ dataDensity }));
  }, [dataDensity]);

  // Toast Notification Functions
  const addNotification = useCallback((notification: Omit<ToastNotification, "id" | "timestamp" | "read">) => {
    const newNotification: ToastNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Keyboard Shortcuts
  const registerShortcut = useCallback((key: string, description: string, callback: () => void) => {
    setShortcuts(prev => new Map(prev).set(key, { description, callback }));
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts(prev => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const showShortcuts = useCallback(() => {
    setShowShortcutsDialog(true);
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Build key combination string
      const parts: string[] = [];
      if (e.ctrlKey || e.metaKey) parts.push("ctrl");
      if (e.shiftKey) parts.push("shift");
      if (e.altKey) parts.push("alt");
      parts.push(e.key.toLowerCase());
      const combo = parts.join("+");

      const shortcut = shortcuts.get(combo);
      if (shortcut) {
        e.preventDefault();
        shortcut.callback();
      }

      // Special: Show shortcuts dialog with ?
      if (e.key === "?" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          setShowShortcutsDialog(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);

  // Confirmation Modal
  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmationDialog({
        open: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback((confirmed: boolean) => {
    if (confirmationDialog.resolve) {
      confirmationDialog.resolve(confirmed);
    }
    setConfirmationDialog({ open: false });
  }, [confirmationDialog]);

  // Undo/Redo
  const addUndoAction = useCallback((description: string, undo: () => void | Promise<void>) => {
    const action: UndoAction = {
      id: `undo-${Date.now()}-${Math.random()}`,
      description,
      undo,
      timestamp: Date.now(),
    };
    setUndoStack(prev => [action, ...prev].slice(0, 10)); // Keep last 10
  }, []);

  const performUndo = useCallback(async () => {
    if (undoStack.length === 0) return;
    
    const [action, ...rest] = undoStack;
    setUndoStack(rest);
    
    await action.undo();
    
    addNotification({
      type: "info",
      title: "Action Undone",
      description: action.description,
    });
  }, [undoStack, addNotification]);

  const value: UIEnhancementsContextType = {
    notifications,
    addNotification,
    markAsRead,
    clearNotification,
    clearAllNotifications,
    unreadCount,
    dataDensity,
    setDataDensity,
    registerShortcut,
    unregisterShortcut,
    showShortcuts,
    confirm,
    addUndoAction,
    performUndo,
    canUndo: undoStack.length > 0,
    undoStackSize: undoStack.length,
  };

  return (
    <UIEnhancementsContext.Provider value={value}>
      {children}

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showShortcutsDialog} onOpenChange={setShowShortcutsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription>
              Available keyboard shortcuts for quick actions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {Array.from(shortcuts.entries()).map(([key, { description }]) => (
              <div key={key} className="flex items-center justify-between p-2 rounded border">
                <span className="text-sm">{description}</span>
                <Badge variant="outline">{key.replace(/\+/g, " + ").toUpperCase()}</Badge>
              </div>
            ))}
            {shortcuts.size === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No shortcuts registered
              </p>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-4">
            Press <Badge variant="outline" className="mx-1">?</Badge> anytime to show this dialog
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmationDialog.open} onOpenChange={(open) => !open && handleConfirm(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmationDialog.options?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationDialog.options?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleConfirm(false)}>
              {confirmationDialog.options?.cancelText || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleConfirm(true)}
              className={confirmationDialog.options?.variant === "destructive" ? "bg-destructive text-destructive-foreground hover-elevate" : ""}
            >
              {confirmationDialog.options?.confirmText || "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </UIEnhancementsContext.Provider>
  );
}

// Notification Center Component
export function NotificationCenter() {
  const { notifications, markAsRead, clearNotification, clearAllNotifications, unreadCount } = useUIEnhancements();
  const [open, setOpen] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <Check className="w-4 h-4" />;
      case "warning": return <AlertTriangle className="w-4 h-4" />;
      case "error": return <AlertCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "success": return "default";
      case "warning": return "outline";
      case "error": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(true)}
        data-testid="button-notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[400px]">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </SheetDescription>
          </SheetHeader>

          <div className="flex gap-2 my-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => notifications.forEach(n => !n.read && markAsRead(n.id))}
              disabled={unreadCount === 0}
              data-testid="button-mark-all-read"
            >
              Mark all as read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              data-testid="button-clear-all"
            >
              Clear all
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <Card
                    key={notification.id}
                    className={`transition-opacity ${notification.read ? "opacity-60" : ""}`}
                    data-testid={`notification-${notification.id}`}
                  >
                    <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 p-3">
                      <div className="flex gap-2 flex-1">
                        <Badge variant={getVariant(notification.type)} className="mt-0.5">
                          {getIcon(notification.type)}
                        </Badge>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold">{notification.title}</h4>
                          {notification.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => clearNotification(notification.id)}
                        data-testid={`button-clear-${notification.id}`}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}

// Undo Button Component
export function UndoButton() {
  const { performUndo, canUndo, undoStackSize } = useUIEnhancements();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={performUndo}
      disabled={!canUndo}
      data-testid="button-undo"
      className="gap-2"
    >
      <Undo2 className="w-4 h-4" />
      Undo {undoStackSize > 0 && `(${undoStackSize})`}
    </Button>
  );
}

// Loading Skeleton Components
export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}

// Empty State Component
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: any;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="text-center py-12">
      <Icon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Button onClick={action.onClick} data-testid="button-empty-state-action">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Data Density Selector
export function DataDensitySelector() {
  const { dataDensity, setDataDensity } = useUIEnhancements();

  return (
    <Tabs value={dataDensity} onValueChange={(v) => setDataDensity(v as any)}>
      <TabsList>
        <TabsTrigger value="compact" data-testid="density-compact">Compact</TabsTrigger>
        <TabsTrigger value="comfortable" data-testid="density-comfortable">Comfortable</TabsTrigger>
        <TabsTrigger value="spacious" data-testid="density-spacious">Spacious</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

// Get density classes
export function useDensityClasses() {
  const { dataDensity } = useUIEnhancements();

  const cellPadding = {
    compact: "p-1 text-xs",
    comfortable: "p-2 text-sm",
    spacious: "p-4 text-base",
  }[dataDensity];

  const cardPadding = {
    compact: "p-3",
    comfortable: "p-4",
    spacious: "p-6",
  }[dataDensity];

  return { cellPadding, cardPadding, dataDensity };
}
