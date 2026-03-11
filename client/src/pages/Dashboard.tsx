import { useAuth } from "@/_core/hooks/useAuth";

import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import {
  CreditCard, Key, Download, LifeBuoy, Database, Copy,
  Shield, Trash2, Clock, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAuthenticated) { window.location.href = "/login"; return null; }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-['Playfair_Display'] mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name || user?.email || "Trader"}</p>
          </div>
          <Tabs defaultValue="subscription" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-border">
              <TabsTrigger value="subscription"><CreditCard size={14} className="mr-1.5" />Subscription</TabsTrigger>
              <TabsTrigger value="licenses"><Key size={14} className="mr-1.5" />Licenses</TabsTrigger>
              <TabsTrigger value="downloads"><Download size={14} className="mr-1.5" />Downloads</TabsTrigger>
              <TabsTrigger value="broker"><Database size={14} className="mr-1.5" />Broker Data</TabsTrigger>
              <TabsTrigger value="support"><LifeBuoy size={14} className="mr-1.5" />Support</TabsTrigger>
            </TabsList>

            <TabsContent value="subscription"><SubscriptionTab /></TabsContent>
            <TabsContent value="licenses"><LicensesTab /></TabsContent>
            <TabsContent value="downloads"><DownloadsTab /></TabsContent>
            <TabsContent value="broker"><BrokerTab /></TabsContent>
            <TabsContent value="support"><SupportTab /></TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function SubscriptionTab() {
  const { data: sub, isLoading } = trpc.dashboard.getSubscription.useQuery();
  if (isLoading) return <LoadingSkeleton />;
  if (!sub) return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6 text-center">
        <Shield size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
        <p className="text-muted-foreground mb-4">Subscribe to unlock the full FoldForge platform.</p>
        <a href="/pricing"><Button className="bg-primary text-primary-foreground">View Plans</Button></a>
      </CardContent>
    </Card>
  );
  return (
    <Card className="bg-card border-border">
      <CardHeader><CardTitle>Your Subscription</CardTitle></CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><Badge className="bg-primary/10 text-primary capitalize">{sub.plan}</Badge></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant={sub.status === "active" ? "default" : "destructive"} className="capitalize">{sub.status}</Badge></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="font-medium">${sub.plan === "starter" ? 19 : sub.plan === "pro" ? 39 : 79}/mo</span></div>
          </div>
          <div className="space-y-3">
            {sub.currentPeriodEnd && <div className="flex justify-between"><span className="text-muted-foreground">Next Billing</span><span className="font-medium">{new Date(sub.currentPeriodEnd).toLocaleDateString()}</span></div>}
            {sub.cancelAtPeriodEnd && <div className="flex items-center gap-2 text-destructive"><AlertCircle size={16} /><span className="text-sm">Cancels at period end</span></div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LicensesTab() {
  const { data: licenses, isLoading } = trpc.dashboard.getLicenses.useQuery();
  const deactivate = trpc.dashboard.deactivate.useMutation({ onSuccess: () => { toast.success("Activation removed"); } });
  if (isLoading) return <LoadingSkeleton />;
  if (!licenses || licenses.length === 0) return (
    <Card className="bg-card border-border"><CardContent className="pt-6 text-center">
      <Key size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Licenses</h3>
      <p className="text-muted-foreground">Subscribe to receive your license key.</p>
    </CardContent></Card>
  );
  return (
    <div className="space-y-4">
      {licenses.map((lic: any) => (
        <Card key={lic.id} className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <code className="text-lg font-mono font-bold text-primary">{lic.licenseKey}</code>
                  <button onClick={() => { navigator.clipboard.writeText(lic.licenseKey); toast.success("Copied!"); }}><Copy size={16} className="text-muted-foreground hover:text-primary" /></button>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="capitalize bg-primary/10 text-primary">{lic.plan}</Badge>
                  <Badge variant={lic.status === "active" ? "default" : "destructive"} className="capitalize">{lic.status}</Badge>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {lic.activations?.length ?? 0} / {lic.maxActivations} activations
              </div>
            </div>
            {lic.activations && lic.activations.length > 0 && (
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-medium mb-3">Active Devices</h4>
                <div className="space-y-2">
                  {lic.activations.map((act: any) => (
                    <div key={act.id} className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
                      <div>
                        <span className="text-sm font-medium">{act.accountNumber}</span>
                        <span className="text-xs text-muted-foreground ml-2">{act.brokerServer} ({act.platform})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {act.lastHeartbeat && <span className="text-xs text-muted-foreground"><Clock size={12} className="inline mr-1" />{new Date(act.lastHeartbeat).toLocaleString()}</span>}
                        <button onClick={() => deactivate.mutate({ activationId: act.id })} className="text-destructive hover:text-destructive/80"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DownloadsTab() {
  const { data: files, isLoading } = trpc.dashboard.getFiles.useQuery();
  const download = trpc.dashboard.downloadFile.useMutation({
    onSuccess: (data) => { if (data.url) window.open(data.url, "_blank"); },
    onError: (err) => toast.error(err.message),
  });
  if (isLoading) return <LoadingSkeleton />;
  if (!files || files.length === 0) return (
    <Card className="bg-card border-border"><CardContent className="pt-6 text-center">
      <Download size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Downloads Available</h3>
      <p className="text-muted-foreground">Files will appear here when available.</p>
    </CardContent></Card>
  );
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {files.map((f: any) => (
        <Card key={f.id} className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{f.name}</h3>
                <p className="text-xs text-muted-foreground">v{f.version} &middot; {f.category}</p>
              </div>
              <Badge className="capitalize bg-secondary text-secondary-foreground">{f.minPlan}+</Badge>
            </div>
            {f.description && <p className="text-sm text-muted-foreground mb-3">{f.description}</p>}
            <Button
              size="sm"
              disabled={!f.canDownload}
              onClick={() => download.mutate({ fileId: f.id })}
              className={f.canDownload ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}
            >
              <Download size={14} className="mr-1.5" />
              {f.canDownload ? "Download" : "Upgrade to Download"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BrokerTab() {
  const { data: symbols, isLoading } = trpc.dashboard.getBrokerSymbols.useQuery();
  if (isLoading) return <LoadingSkeleton />;
  if (!symbols || symbols.length === 0) return (
    <Card className="bg-card border-border"><CardContent className="pt-6 text-center">
      <Database size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Broker Data</h3>
      <p className="text-muted-foreground mb-4">Install the FoldForge Uploader EA on your MT4/MT5 platform to sync your broker's data.</p>
      <a href="/docs"><Button variant="outline">View Setup Guide</Button></a>
    </CardContent></Card>
  );
  return (
    <Card className="bg-card border-border">
      <CardHeader><CardTitle>Synced Broker Symbols</CardTitle><CardDescription>{symbols.length} symbols from your broker</CardDescription></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-2 pr-4">Symbol</th><th className="text-left py-2 pr-4">Broker</th>
              <th className="text-right py-2 pr-4">Digits</th><th className="text-right py-2 pr-4">Spread</th>
              <th className="text-right py-2 pr-4">Min Lot</th><th className="text-right py-2">Last Sync</th>
            </tr></thead>
            <tbody>
              {symbols.slice(0, 50).map((s: any) => (
                <tr key={s.id} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium">{s.symbol}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{s.broker}</td>
                  <td className="py-2 pr-4 text-right">{s.digits}</td>
                  <td className="py-2 pr-4 text-right">{s.spreadTypical ?? "—"}</td>
                  <td className="py-2 pr-4 text-right">{s.minLot ?? "—"}</td>
                  <td className="py-2 text-right text-muted-foreground">{s.lastSyncAt ? new Date(s.lastSyncAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function SupportTab() {
  const { data: tickets, isLoading, refetch } = trpc.dashboard.getTickets.useQuery();
  const createTicket = trpc.dashboard.createTicket.useMutation({ onSuccess: () => { toast.success("Ticket submitted"); refetch(); setSubject(""); setMessage(""); } });
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<string>("medium");

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader><CardTitle>Submit a Ticket</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="bg-input border-border" />
          <Textarea placeholder="Describe your issue..." value={message} onChange={e => setMessage(e.target.value)} rows={4} className="bg-input border-border" />
          <div className="flex items-center gap-4">
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-40 bg-input border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => createTicket.mutate({ subject, message, priority: priority as any })} disabled={!subject || !message} className="bg-primary text-primary-foreground">Submit Ticket</Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? <LoadingSkeleton /> : tickets && tickets.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader><CardTitle>Your Tickets</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tickets.map((t: any) => (
                <div key={t.id} className="bg-secondary/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{t.subject}</h4>
                    <Badge variant={t.status === "resolved" || t.status === "closed" ? "default" : "secondary"} className="capitalize">{t.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{t.message}</p>
                  {t.adminReply && (
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-xs font-medium text-primary mb-1">Admin Reply</p>
                      <p className="text-sm text-foreground">{t.adminReply}</p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">{new Date(t.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />)}
        </div>
      </CardContent>
    </Card>
  );
}
