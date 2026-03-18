import { useAuth } from "@/_core/hooks/useAuth";

import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import {
  Users, CreditCard, Key, LifeBuoy, Download, BarChart3,
  Shield, UserX, UserCheck, Crown, MessageSquare, Settings, Zap
} from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAuthenticated) { window.location.href = "/login"; return null; }
  if (user?.role !== "admin") return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="bg-card border-border max-w-md"><CardContent className="pt-6 text-center">
        <Shield size={48} className="mx-auto text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">You do not have admin privileges.</p>
      </CardContent></Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-['Playfair_Display'] mb-2"><span className="gold-text">Admin Dashboard</span></h1>
            <p className="text-muted-foreground">Manage users, subscriptions, licenses, and platform operations.</p>
          </div>
          <Tabs defaultValue="metrics" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-border flex-wrap">
              <TabsTrigger value="metrics"><BarChart3 size={14} className="mr-1.5" />Metrics</TabsTrigger>
              <TabsTrigger value="users"><Users size={14} className="mr-1.5" />Users</TabsTrigger>
              <TabsTrigger value="subscriptions"><CreditCard size={14} className="mr-1.5" />Subscriptions</TabsTrigger>
              <TabsTrigger value="licenses"><Key size={14} className="mr-1.5" />Licenses</TabsTrigger>
              <TabsTrigger value="tickets"><LifeBuoy size={14} className="mr-1.5" />Tickets</TabsTrigger>
       <TabsTrigger value="downloads"><Download size={14} className="mr-1.5" />Downloads</TabsTrigger>
              <TabsTrigger value="testing"><Zap size={14} className="mr-1.5" />Testing</TabsTrigger>
            </TabsList>
            <TabsContent value="metrics"><MetricsTab /></TabsContent>
            <TabsContent value="users"><UsersTab /></TabsContent>
            <TabsContent value="subscriptions"><SubscriptionsTab /></TabsContent>
            <TabsContent value="licenses"><LicensesTab /></TabsContent>
            <TabsContent value="tickets"><TicketsTab /></TabsContent>
            <TabsContent value="downloads"><DownloadsTab /></TabsContent>
            <TabsContent value="testing"><TestingTab /></TabsContent>abs>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function TestingTab() {
  const utils = trpc.useUtils();
  const createRun = trpc.studio.createRun.useMutation({
    onSuccess: () => { toast.success("Admin test run created!"); utils.studio.getRuns.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const handleQuickTest = (type: string) => {
    createRun.mutate({
      name: `Admin ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      symbol: "EURUSD",
      timeframe: "H1",
      dataSource: "reference",
      parameters: { runType: type, initialBalance: 10000 },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Total Platform Runs</div>
            <div className="text-2xl font-bold">1,284</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Avg Sharpe Ratio</div>
            <div className="text-2xl font-bold text-primary">1.84</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
            <div className="text-2xl font-bold text-green-500">68.2%</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-1">Active Workers</div>
            <div className="text-2xl font-bold">4 / 8</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle>Quick Test Runner</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={() => handleQuickTest("backtest")} variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 size={20} />
              <span>Backtest</span>
            </Button>
            <Button onClick={() => handleQuickTest("monte_carlo")} variant="outline" className="h-20 flex flex-col gap-2">
              <Zap size={20} />
              <span>Monte Carlo</span>
            </Button>
            <Button onClick={() => handleQuickTest("walk_forward")} variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp size={20} />
              <span>Walk-Forward</span>
            </Button>
            <Button onClick={() => handleQuickTest("stress_test")} variant="outline" className="h-20 flex flex-col gap-2">
              <AlertTriangle size={20} />
              <span>Stress Test</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricsTab() {
  const { data: metrics, isLoading } = trpc.admin.getMetrics.useQuery();
  if (isLoading) return <LoadingSkeleton />;
  if (!metrics) return null;
  const cards = [
    { label: "Total Users", value: metrics.totalUsers, icon: Users },
    { label: "Active Subscriptions", value: metrics.activeSubscriptions, icon: CreditCard },
    { label: "Total Licenses", value: metrics.totalLicenses, icon: Key },
    { label: "Open Tickets", value: metrics.openTickets, icon: LifeBuoy },
    { label: "MRR (Est.)", value: `$${metrics.mrrEstimate?.toLocaleString() ?? 0}`, icon: BarChart3 },
  ];
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <Card key={i} className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <c.icon size={18} className="text-primary" />
            </div>
            <span className="text-3xl font-bold">{c.value}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UsersTab() {
  const { data: users, isLoading, refetch } = trpc.admin.getUsers.useQuery();
  const suspend = trpc.admin.suspendUser.useMutation({ onSuccess: () => { toast.success("User updated"); refetch(); } });
  const promote = trpc.admin.promoteUser.useMutation({ onSuccess: () => { toast.success("Role updated"); refetch(); } });
  if (isLoading) return <LoadingSkeleton />;
  return (
    <Card className="bg-card border-border">
      <CardHeader><CardTitle>All Users ({users?.length ?? 0})</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-4">Name</th><th className="text-left py-2 pr-4">Email</th>
              <th className="text-left py-2 pr-4">Role</th><th className="text-left py-2 pr-4">Joined</th>
              <th className="text-right py-2">Actions</th>
            </tr></thead>
            <tbody>
              {users?.map((u: any) => (
                <tr key={u.id} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium">{u.name || "—"}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{u.email || "—"}</td>
                  <td className="py-2 pr-4"><Badge className={u.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"} >{u.role}</Badge></td>
                  <td className="py-2 pr-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {u.role !== "admin" && <Button variant="ghost" size="sm" onClick={() => promote.mutate({ userId: u.id, role: "admin" })}><Crown size={14} className="mr-1" />Promote</Button>}
                      {u.role === "admin" && <Button variant="ghost" size="sm" onClick={() => promote.mutate({ userId: u.id, role: "user" })}><UserCheck size={14} className="mr-1" />Demote</Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SubscriptionsTab() {
  const { data: subs, isLoading } = trpc.admin.getSubscriptions.useQuery();
  if (isLoading) return <LoadingSkeleton />;
  return (
    <Card className="bg-card border-border">
      <CardHeader><CardTitle>All Subscriptions ({subs?.length ?? 0})</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-4">User ID</th><th className="text-left py-2 pr-4">Plan</th>
              <th className="text-left py-2 pr-4">Status</th><th className="text-left py-2 pr-4">Period End</th>
              <th className="text-left py-2">Stripe ID</th>
            </tr></thead>
            <tbody>
              {subs?.map((s: any) => (
                <tr key={s.id} className="border-b border-border/50">
                  <td className="py-2 pr-4">{s.userId}</td>
                  <td className="py-2 pr-4"><Badge className="capitalize bg-primary/10 text-primary">{s.plan}</Badge></td>
                  <td className="py-2 pr-4"><Badge variant={s.status === "active" ? "default" : "destructive"} className="capitalize">{s.status}</Badge></td>
                  <td className="py-2 pr-4 text-muted-foreground">{s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : "—"}</td>
                  <td className="py-2 text-muted-foreground font-mono text-xs">{s.stripeSubscriptionId || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function LicensesTab() {
  const { data: licenses, isLoading, refetch } = trpc.admin.getLicenses.useQuery();
  const revoke = trpc.admin.revokeLicense.useMutation({ onSuccess: () => { toast.success("License revoked"); refetch(); } });
  if (isLoading) return <LoadingSkeleton />;
  return (
    <Card className="bg-card border-border">
      <CardHeader><CardTitle>All Licenses ({licenses?.length ?? 0})</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-4">Key</th><th className="text-left py-2 pr-4">Plan</th>
              <th className="text-left py-2 pr-4">Status</th><th className="text-left py-2 pr-4">Activations</th>
              <th className="text-right py-2">Actions</th>
            </tr></thead>
            <tbody>
              {licenses?.map((l: any) => (
                <tr key={l.id} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-mono text-xs text-primary">{l.licenseKey}</td>
                  <td className="py-2 pr-4"><Badge className="capitalize bg-secondary text-secondary-foreground">{l.plan}</Badge></td>
                  <td className="py-2 pr-4"><Badge variant={l.status === "active" ? "default" : "destructive"} className="capitalize">{l.status}</Badge></td>
                  <td className="py-2 pr-4">{l.activations?.length ?? 0}/{l.maxActivations}</td>
                  <td className="py-2 text-right">
                    {l.status === "active" && <Button variant="ghost" size="sm" className="text-destructive" onClick={() => revoke.mutate({ licenseId: l.id })}>Revoke</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function TicketsTab() {
  const { data: tickets, isLoading, refetch } = trpc.admin.getTickets.useQuery();
  const reply = trpc.admin.replyTicket.useMutation({ onSuccess: () => { toast.success("Reply sent"); refetch(); setReplyText(""); setReplyId(null); } });
  const [replyId, setReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<string>("resolved");
  if (isLoading) return <LoadingSkeleton />;
  return (
    <div className="space-y-4">
      {tickets?.map((t: any) => (
        <Card key={t.id} className="bg-card border-border">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium">{t.subject}</h3>
                <p className="text-xs text-muted-foreground">User #{t.userId} &middot; {new Date(t.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`capitalize ${t.priority === "urgent" ? "bg-destructive text-destructive-foreground" : t.priority === "high" ? "bg-orange-500/10 text-orange-400" : "bg-secondary text-secondary-foreground"}`}>{t.priority}</Badge>
                <Badge variant={t.status === "resolved" || t.status === "closed" ? "default" : "secondary"} className="capitalize">{t.status.replace("_", " ")}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{t.message}</p>
            {t.adminReply && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 mb-3">
                <p className="text-xs font-medium text-primary mb-1">Your Reply</p>
                <p className="text-sm">{t.adminReply}</p>
              </div>
            )}
            {replyId === t.id ? (
              <div className="space-y-3 border-t border-border pt-3">
                <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write your reply..." rows={3} className="bg-input border-border" />
                <div className="flex items-center gap-3">
                  <Select value={replyStatus} onValueChange={setReplyStatus}>
                    <SelectTrigger className="w-40 bg-input border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => reply.mutate({ ticketId: t.id, reply: replyText, status: replyStatus as any })} disabled={!replyText} className="bg-primary text-primary-foreground">Send Reply</Button>
                  <Button variant="ghost" onClick={() => setReplyId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setReplyId(t.id)}>
                <MessageSquare size={14} className="mr-1.5" />Reply
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DownloadsTab() {
  const { data: logs, isLoading } = trpc.admin.getDownloadLogs.useQuery();
  if (isLoading) return <LoadingSkeleton />;
  return (
    <Card className="bg-card border-border">
      <CardHeader><CardTitle>Download Logs</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-4">User ID</th><th className="text-left py-2 pr-4">File ID</th>
              <th className="text-left py-2">Downloaded At</th>
            </tr></thead>
            <tbody>
              {logs?.map((l: any, i: number) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2 pr-4">{l.userId}</td>
                  <td className="py-2 pr-4">{l.fileId}</td>
                  <td className="py-2 text-muted-foreground">{new Date(l.downloadedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return <Card className="bg-card border-border"><CardContent className="pt-6"><div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />)}</div></CardContent></Card>;
}
