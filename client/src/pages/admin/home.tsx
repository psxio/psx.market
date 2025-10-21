import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Briefcase, FileText, Share2, TrendingUp } from "lucide-react";

export default function AdminHome() {
  const { data: builders } = useQuery<any[]>({ queryKey: ["/api/admin/builders"] });
  const { data: clients } = useQuery<any[]>({ queryKey: ["/api/admin/clients"] });
  const { data: services } = useQuery<any[]>({ queryKey: ["/api/admin/services"] });
  const { data: applications } = useQuery<any[]>({ queryKey: ["/api/admin/applications"] });
  const { data: referrals } = useQuery<any[]>({ queryKey: ["/api/admin/referrals"] });

  const stats = [
    {
      title: "Total Builders",
      value: builders?.length || 0,
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Clients",
      value: clients?.length || 0,
      icon: UserPlus,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      title: "Active Services",
      value: services?.length || 0,
      icon: Briefcase,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Pending Applications",
      value: applications?.filter((a: any) => a.status === "pending").length || 0,
      icon: FileText,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Active Referrals",
      value: referrals?.filter((r: any) => r.status === "pending").length || 0,
      icon: Share2,
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "Total Revenue",
      value: "$0",
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Welcome to the create.psx admin dashboard
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/\s/g, '-')}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
