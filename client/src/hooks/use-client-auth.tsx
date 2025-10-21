import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Client, InsertClient } from "@shared/schema";

interface ClientAuthContextType {
  client: Client | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (data: InsertClient) => Promise<void>;
  login: (walletAddress: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Client>) => Promise<void>;
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);

  const { data, isLoading } = useQuery<Client>({
    queryKey: ["/api/clients/me"],
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setClient(data);
    }
  }, [data]);

  const registerMutation = useMutation<Client, Error, InsertClient>({
    mutationFn: async (data: InsertClient) => {
      const response = await apiRequest("POST", "/api/clients/register", data);
      return await response.json();
    },
    onSuccess: (data) => {
      setClient(data);
      queryClient.setQueryData(["/api/clients/me"], data);
    },
  });

  const loginMutation = useMutation<Client, Error, string>({
    mutationFn: async (walletAddress: string) => {
      const response = await apiRequest("POST", "/api/clients/login", { walletAddress });
      return await response.json();
    },
    onSuccess: (data) => {
      setClient(data);
      queryClient.setQueryData(["/api/clients/me"], data);
    },
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      await apiRequest("POST", "/api/clients/logout", {});
    },
    onSuccess: () => {
      setClient(null);
      queryClient.setQueryData(["/api/clients/me"], null);
      queryClient.clear();
    },
  });

  const updateProfileMutation = useMutation<Client, Error, Partial<Client>>({
    mutationFn: async (data: Partial<Client>) => {
      const response = await apiRequest("PUT", "/api/clients/me", data);
      return await response.json();
    },
    onSuccess: (data) => {
      setClient(data);
      queryClient.setQueryData(["/api/clients/me"], data);
    },
  });

  const register = async (data: InsertClient) => {
    await registerMutation.mutateAsync(data);
  };

  const login = async (walletAddress: string) => {
    await loginMutation.mutateAsync(walletAddress);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const updateProfile = async (data: Partial<Client>) => {
    await updateProfileMutation.mutateAsync(data);
  };

  return (
    <ClientAuthContext.Provider
      value={{
        client,
        isAuthenticated: !!client,
        isLoading,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider");
  }
  return context;
}
