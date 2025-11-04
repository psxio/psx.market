import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { PrivyProvider } from '@privy-io/react-auth';
import { config, privyAppId } from '@/lib/wagmiConfig';
import '@rainbow-me/rainbowkit/styles.css';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { UIEnhancementsProvider } from "@/components/ui-enhancements";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { ClientAuthProvider } from "@/hooks/use-client-auth";
import { BuilderAuthProvider } from "@/hooks/use-builder-auth";
import { InstallPWAPrompt } from "@/components/install-pwa-prompt";
import { NotificationToastListener } from "@/components/notification-toast-listener";
import { Footer } from "@/components/footer";
import { FAQChatbot } from "@/components/faq-chatbot";
import { KeyboardShortcutsHelp, useKeyboardShortcuts } from "@/components/keyboard-shortcuts-help";
import { WalletAutoLogin } from "@/components/wallet-auto-login";
import { OnboardingRoleSelector } from "@/components/onboarding-role-selector";
import { usePrivySync } from "@/hooks/use-privy-sync";
import Home from "@/pages/home";
import BuilderProfile from "@/pages/builder-profile-enhanced";
import ServiceDetail from "@/pages/service-detail";
import OrderConfirmation from "@/pages/order-confirmation";
import Marketplace from "@/pages/marketplace";
import CategoryPage from "@/pages/category";
import BuildersLanding from "@/pages/builders";
import BrowseBuilders from "@/pages/browse-builders";
import BrowsePortfolios from "@/pages/browse-portfolios";
import AdultBuilders from "@/pages/adult-builders";
import BuilderQuiz from "@/pages/builder-quiz";
import Apply from "@/pages/apply";
import HowItWorks from "@/pages/how-it-works";
import GettingStarted from "@/pages/getting-started";
import BuilderInvite from "@/pages/builder-invite";
import BuilderOnboarding from "@/pages/builder-onboarding";
import ChaptersOnboarding from "@/pages/chapters-onboarding";
import DualPlatformOnboardingPage from "@/pages/dual-platform-onboarding";
import BecomeClient from "@/pages/become-client";
import ClientDashboard from "@/pages/client-dashboard";
import BuilderDashboard from "@/pages/builder-dashboard";
import MessagesPage from "@/pages/messages-enhanced";
import NotificationSettings from "@/pages/notification-settings";
import FileUploadDemo from "@/pages/file-upload-demo";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import CookiePolicy from "@/pages/cookie-policy";
import FAQ from "@/pages/faq";
import BuyerRequests from "@/pages/buyer-requests";
import AppDemo from "@/pages/app-demo";
import { MobileNav } from "@/components/mobile-nav";
import { ScrollToTop } from "@/components/ScrollToTop";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/service/:id" component={ServiceDetail} />
      <Route path="/order-confirmation/:id" component={OrderConfirmation} />
      <Route path="/builder/:id" component={BuilderProfile} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/builders" component={BrowseBuilders} />
      <Route path="/portfolios" component={BrowsePortfolios} />
      <Route path="/adult-builders" component={AdultBuilders} />
      <Route path="/become-builder" component={BuildersLanding} />
      <Route path="/builder-quiz" component={BuilderQuiz} />
      <Route path="/apply" component={Apply} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/getting-started" component={GettingStarted} />
      <Route path="/builder-invite/:token" component={BuilderInvite} />
      <Route path="/builder-onboarding/:token?" component={BuilderOnboarding} />
      <Route path="/chapters-onboarding/:token" component={ChaptersOnboarding} />
      <Route path="/dual-platform-onboarding" component={DualPlatformOnboardingPage} />
      <Route path="/become-client" component={BecomeClient} />
      <Route path="/dashboard" component={ClientDashboard} />
      <Route path="/builder-dashboard" component={BuilderDashboard} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/settings/notifications" component={NotificationSettings} />
      <Route path="/demo/file-upload" component={FileUploadDemo} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/:rest*" component={AdminDashboard} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/faq" component={FAQ} />
      <Route path="/buyer-requests" component={BuyerRequests} />
      <Route path="/demo" component={AppDemo} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  useKeyboardShortcuts();
  usePrivySync();
  
  return (
    <>
      <ScrollToTop />
      <WalletAutoLogin />
      <OnboardingRoleSelector />
      <Toaster />
      <InstallPWAPrompt />
      <NotificationToastListener />
      <KeyboardShortcutsHelp />
      <FAQChatbot />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 mb-16 md:mb-0">
          <Router />
        </main>
        <Footer />
        <MobileNav />
      </div>
    </>
  );
}

function App() {
  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#a855f7',
          logo: 'https://port444.replit.app/icon-512.png',
          showWalletLoginFirst: false,
          walletList: ['metamask', 'coinbase_wallet', 'rainbow'],
        },
        loginMethods: ['email', 'google', 'twitter', 'discord'],
        supportedChains: [
          {
            id: 8453,
            name: 'Base',
            network: 'base',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ['https://mainnet.base.org'],
              },
            },
            blockExplorers: {
              default: {
                name: 'BaseScan',
                url: 'https://basescan.org',
              },
            },
          },
        ],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme({
            accentColor: '#a855f7',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}>
            <ThemeProvider defaultTheme="dark">
              <UIEnhancementsProvider>
                <AdminAuthProvider>
                  <ClientAuthProvider>
                    <BuilderAuthProvider>
                      <TooltipProvider>
                        <AppContent />
                      </TooltipProvider>
                    </BuilderAuthProvider>
                  </ClientAuthProvider>
                </AdminAuthProvider>
              </UIEnhancementsProvider>
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}

export default App;
