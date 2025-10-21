import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { ClientAuthProvider } from "@/hooks/use-client-auth";
import Home from "@/pages/home";
import BuilderProfile from "@/pages/builder-profile";
import Marketplace from "@/pages/marketplace";
import CategoryPage from "@/pages/category";
import Apply from "@/pages/apply";
import BecomeClient from "@/pages/become-client";
import ClientDashboard from "@/pages/client-dashboard";
import MessagesPage from "@/pages/messages";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/builder/:id" component={BuilderProfile} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/apply" component={Apply} />
      <Route path="/become-client" component={BecomeClient} />
      <Route path="/dashboard" component={ClientDashboard} />
      <Route path="/messages" component={MessagesPage} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/:rest*" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <AdminAuthProvider>
          <ClientAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ClientAuthProvider>
        </AdminAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
