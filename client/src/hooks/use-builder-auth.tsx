import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Builder } from "@shared/schema";

interface BuilderAuthContextType {
  builder: Builder | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (walletAddress: string) => Promise<void>;
  logout: () => Promise<void>;
}

const BuilderAuthContext = createContext<BuilderAuthContextType | undefined>(undefined);

export function BuilderAuthProvider({ children }: { children: ReactNode }) {
  const [builder, setBuilder] = useState<Builder | null>(null);

  const { data, isLoading } = useQuery<Builder>({
    queryKey: ["/api/builders/me"],
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setBuilder(data);
    }
  }, [data]);

  const loginMutation = useMutation<Builder, Error, string>({
    mutationFn: async (walletAddress: string) => {
      const response = await apiRequest("POST", "/api/builders/login", { walletAddress });
      return await response.json();
    },
    onSuccess: (data) => {
      setBuilder(data);
      queryClient.setQueryData(["/api/builders/me"], data);
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      await apiRequest("POST", "/api/builders/logout", {});
    },
    onSuccess: () => {
      setBuilder(null);
      queryClient.setQueryData(["/api/builders/me"], null);
      queryClient.clear();
    },
  });

  const login = async (walletAddress: string) => {
    await loginMutation.mutateAsync(walletAddress);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <BuilderAuthContext.Provider
      value={{
        builder,
        isAuthenticated: !!builder,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </BuilderAuthContext.Provider>
  );
}

export function useBuilderAuth() {
  const context = useContext(BuilderAuthContext);
  if (context === undefined) {
    throw new Error("useBuilderAuth must be used within a BuilderAuthProvider");
  }
  return context;
}
