import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmiConfig';
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
import Home from "@/pages/home";
import BuilderProfile from "@/pages/builder-profile";
import ServiceDetail from "@/pages/service-detail";
import OrderConfirmation from "@/pages/order-confirmation";
import Marketplace from "@/pages/marketplace";
import CategoryPage from "@/pages/category";
import BuildersLanding from "@/pages/builders";
import BuilderQuiz from "@/pages/builder-quiz";
import Apply from "@/pages/apply";
import HowItWorks from "@/pages/how-it-works";
import GettingStarted from "@/pages/getting-started";
import BuilderInvite from "@/pages/builder-invite";
import BuilderOnboarding from "@/pages/builder-onboarding";
import BecomeClient from "@/pages/become-client";
import ClientDashboard from "@/pages/client-dashboard";
import BuilderDashboard from "@/pages/builder-dashboard";
import MessagesPage from "@/pages/messages";
import NotificationSettings from "@/pages/notification-settings";
import FileUploadDemo from "@/pages/file-upload-demo";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import CookiePolicy from "@/pages/cookie-policy";
import FAQ from "@/pages/faq";
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
      <Route path="/builders" component={BuildersLanding} />
      <Route path="/builder-quiz" component={BuilderQuiz} />
      <Route path="/apply" component={Apply} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/getting-started" component={GettingStarted} />
      <Route path="/builder-invite/:token" component={BuilderInvite} />
      <Route path="/builder-onboarding/:token?" component={BuilderOnboarding} />
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
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  useKeyboardShortcuts();
  
  return (
    <>
      <Toaster />
      <InstallPWAPrompt />
      <NotificationToastListener />
      <KeyboardShortcutsHelp />
      <FAQChatbot />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Router />
        </main>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
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
  );
}

export default App;
