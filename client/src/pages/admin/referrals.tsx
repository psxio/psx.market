import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import type { Referral } from "@shared/schema";

export default function AdminReferrals() {
  const { data: referrals, isLoading } = useQuery<Referral[]>({ 
    queryKey: ["/api/admin/referrals"] 
  });

  if (isLoading) {
    return <div>Loading referrals...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Referrals</h2>
          <p className="text-muted-foreground">
            Manage referral program and track rewards
          </p>
        </div>
        <Button data-testid="button-add-referral">
          <Plus className="mr-2 h-4 w-4" />
          Add Referral
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Referrals ({referrals?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referrer</TableHead>
                <TableHead>Referred</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals && referrals.length > 0 ? (
                referrals.map((referral) => (
                  <TableRow key={referral.id} data-testid={`row-referral-${referral.id}`}>
                    <TableCell className="font-mono text-xs">
                      {referral.referrerWallet.slice(0, 6)}...{referral.referrerWallet.slice(-4)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {referral.referredWallet.slice(0, 6)}...{referral.referredWallet.slice(-4)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{referral.referrerType}</Badge>
                    </TableCell>
                    <TableCell>
                      {referral.status === "pending" && (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      {referral.status === "completed" && (
                        <Badge>Completed</Badge>
                      )}
                      {referral.status === "cancelled" && (
                        <Badge variant="destructive">Cancelled</Badge>
                      )}
                    </TableCell>
                    <TableCell>{referral.reward || "TBD"}</TableCell>
                    <TableCell>
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No referrals yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
