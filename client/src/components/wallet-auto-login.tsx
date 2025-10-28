import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useBuilderAuth } from "@/hooks/use-builder-auth";

export function WalletAutoLogin() {
  const { address, isConnected } = useAccount();
  const { client, isLoading: clientLoading, login: clientLogin } = useClientAuth();
  const { builder, isLoading: builderLoading, login: builderLogin } = useBuilderAuth();
  const hasAttemptedLogin = useRef(false);

  useEffect(() => {
    async function autoLogin() {
      if (!isConnected || !address) {
        hasAttemptedLogin.current = false;
        return;
      }

      if (clientLoading || builderLoading) {
        return;
      }

      if (client || builder) {
        return;
      }

      if (hasAttemptedLogin.current) {
        return;
      }

      hasAttemptedLogin.current = true;

      try {
        await clientLogin(address);
      } catch (clientError) {
        try {
          await builderLogin(address);
        } catch (builderError) {
          console.log("No existing client or builder account for this wallet");
        }
      }
    }

    autoLogin();
  }, [isConnected, address, client, builder, clientLoading, builderLoading, clientLogin, builderLogin]);

  return null;
}
