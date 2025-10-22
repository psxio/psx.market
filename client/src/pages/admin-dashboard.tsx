import { useEffect } from "react";
import { useLocation, Route, Switch } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  FileText, 
  Share2, 
  LayoutDashboard,
  LogOut,
  Shield,
  Mail,
  DollarSign
} from "lucide-react";
import AdminBuilders from "./admin/builders";
import AdminClients from "./admin/clients";
import AdminServices from "./admin/services";
import AdminApplications from "./admin/applications";
import AdminReferrals from "./admin/referrals";
import AdminBuilderInvites from "./admin/builder-invites";
import AdminHome from "./admin/home";
import AdminFinancial from "./admin/financial";
import { NotificationCenter, UndoButton } from "@/components/ui-enhancements";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Builders",
    url: "/admin/builders",
    icon: Users,
  },
  {
    title: "Clients",
    url: "/admin/clients",
    icon: UserPlus,
  },
  {
    title: "Services",
    url: "/admin/services",
    icon: Briefcase,
  },
  {
    title: "Financial",
    url: "/admin/financial",
    icon: DollarSign,
  },
  {
    title: "Applications",
    url: "/admin/applications",
    icon: FileText,
  },
  {
    title: "Builder Invites",
    url: "/admin/builder-invites",
    icon: Mail,
  },
  {
    title: "Referrals",
    url: "/admin/referrals",
    icon: Share2,
  },
];

function AdminSidebar() {
  const [location] = useLocation();
  const { logout, admin } = useAdminAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">PSX Admin</p>
            <p className="text-xs text-muted-foreground">{admin?.name}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <a href={item.url} data-testid={`link-admin-${item.title.toLowerCase()}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} data-testid="button-logout">
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default function AdminDashboard() {
  const { isAuthenticated } = useAdminAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <UndoButton />
            </div>
            <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              create.psx Admin
            </h1>
            <NotificationCenter />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Switch>
              <Route path="/admin" component={AdminHome} />
              <Route path="/admin/builders" component={AdminBuilders} />
              <Route path="/admin/clients" component={AdminClients} />
              <Route path="/admin/services" component={AdminServices} />
              <Route path="/admin/financial" component={AdminFinancial} />
              <Route path="/admin/applications" component={AdminApplications} />
              <Route path="/admin/builder-invites" component={AdminBuilderInvites} />
              <Route path="/admin/referrals" component={AdminReferrals} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
