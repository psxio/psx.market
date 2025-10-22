import { createContext, useContext, useState, useEffect } from "react";

interface Admin {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    const stored = localStorage.getItem("admin");
    return stored ? JSON.parse(stored) : null;
  });
  const [isVerifying, setIsVerifying] = useState(true);

  // Helper to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // Verify session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch("/api/admin/me", {
          credentials: "include",
          headers: getAuthHeaders(),
        });

        if (response.ok) {
          const adminData = await response.json();
          setAdmin(adminData);
          localStorage.setItem("admin", JSON.stringify(adminData));
        } else {
          // Backend session invalid, clear frontend state
          setAdmin(null);
          localStorage.removeItem("admin");
          localStorage.removeItem("adminToken");
        }
      } catch (error) {
        console.error("Session verification failed:", error);
        setAdmin(null);
        localStorage.removeItem("admin");
        localStorage.removeItem("adminToken");
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const adminData = await response.json();
    
    // Store token for iframe/cookie-blocked scenarios
    if (adminData.token) {
      localStorage.setItem("adminToken", adminData.token);
    }
    
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
        headers,
      });
    } finally {
      setAdmin(null);
      localStorage.removeItem("admin");
      localStorage.removeItem("adminToken");
    }
  };

  // Show nothing while verifying to prevent flash of login page
  if (isVerifying) {
    return null;
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        login,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
