import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useClientAuth } from "./use-client-auth";
import { useLocation } from "wouter";

interface WalletStatus {
  type: "client" | "builder" | null;
  id?: string;
  walletAddress?: string;
  name?: string;
  verified?: boolean;
  psxTier?: string;
  category?: string;
}

export function useWalletAuth() {
  const { address, isConnected } = useAccount();
  const { client, login: clientLogin, isAuthenticated: isClientAuthenticated } = useClientAuth();
  const [, setLocation] = useLocation();
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);

  // Check wallet registration status
  const { data: walletStatus, isLoading } = useQuery<WalletStatus>({
    queryKey: ["/api/auth/wallet", address],
    enabled: !!address && isConnected,
    retry: false,
    staleTime: 30000, // 30 seconds
  });

  // Auto-login when wallet connects
  useEffect(() => {
    if (!address || !walletStatus || hasAttemptedLogin || isClientAuthenticated) {
      return;
    }

    const attemptAutoLogin = async () => {
      try {
        if (walletStatus.type === "client" && !isClientAuthenticated) {
          await clientLogin(address);
          setHasAttemptedLogin(true);
          setLocation("/dashboard");
        } else if (walletStatus.type === "builder") {
          // For builders, just redirect to their dashboard
          setHasAttemptedLogin(true);
          setLocation("/builder-dashboard");
        }
      } catch (error) {
        console.error("Auto-login failed:", error);
      }
    };

    attemptAutoLogin();
  }, [address, walletStatus, hasAttemptedLogin, isClientAuthenticated, clientLogin, setLocation]);

  // Reset when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setHasAttemptedLogin(false);
    }
  }, [isConnected]);

  return {
    address,
    isConnected,
    walletStatus,
    isLoading,
    isRegistered: !!walletStatus?.type,
    userType: walletStatus?.type || null,
    isClient: walletStatus?.type === "client",
    isBuilder: walletStatus?.type === "builder",
    client,
  };
}
