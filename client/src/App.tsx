import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import BuilderProfile from "@/pages/builder-profile";
import Marketplace from "@/pages/marketplace";
import CategoryPage from "@/pages/category";
import Apply from "@/pages/apply";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/builder/:id" component={BuilderProfile} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/apply" component={Apply} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
