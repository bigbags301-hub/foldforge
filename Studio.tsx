import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import {
  Play, Settings, BarChart3, FileText, Layers, Zap,
  TrendingUp, TrendingDown, DollarSign, Percent,
  Clock, CheckCircle2, XCircle, Loader2, AlertTriangle, Square
} from "lucide-react";

const TIMEFRAMES = ["M1","M5","M15","M30","H1","H4","D1","W1","MN1"];
const RUN_TYPES = [
  { value: "backtest", label: "Standard Backtest" },
  { value: "monte_carlo", label: "Monte Carlo Simulation" },
  { value: "walk_forward", label: "Walk-Forward Analysis" },
  { value: "stress_test", label: "Stress Test" },
  { value: "parameter_sweep", label: "Parameter Sweep" },
];

export default function Studio() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAuthenticated) { window.location.href = "/login"; return null; }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-['Playfair_Display'] mb-2">
              <span className="gold-text">EA Testing Studio</span>
            </h1>
            <p className="text-muted-foreground">Configure, run, and analyze Expert Advisor tests with institutional-grade tools.</p>
          </div>
          <Tabs defaultValue="configure" className="space-y-6">
            <TabsList className="bg-secondary/50 border border-border flex-wrap">
              <TabsTrigger value="configure"><Settings size={14} className="mr-1.5" />Configure</TabsTrigger>
              <TabsTrigger value="queue"><Layers size={14} className="mr-1.5" />Run Queue</TabsTrigger>
              <TabsTrigger value="results"><BarChart3 size={14} className="mr-1.5" />Results</TabsTrigger>
              <TabsTrigger value="reference"><Zap size={14} className="mr-1.5" />Reference Data</TabsTrigger>
              <TabsTrigger value="reports"><FileText size={14} className="mr-1.5" />Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="configure"><ConfigureTab /></TabsContent>
            <TabsContent value="queue"><QueueTab /></TabsContent>
            <TabsContent value="results"><ResultsTab /></TabsContent>
            <TabsContent value="reference"><ReferenceTab /></TabsContent>
            <TabsContent value="reports"><ReportsTab /></TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ConfigureTab() {
  const utils = trpc.useUtils();
  const createRun = trpc.studio.createRun.useMutation({
    onSuccess: () => { toast.success("Run submitted to queue!"); utils.studio.getRuns.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const [config, setConfig] = useState({
    eaName: "",
    symbol: "EURUSD",
    timeframe: "H1",
    runType: "backtest",
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    initialBalance: 10000,
    leverage: 100,
    spread: 15,
    monteCarloRuns: 1000,
    walkForwardWindows: 6,
  });

  const [params, setParams] = useState<Array<{ name: string; min: string; max: string; step: string }>>([
    { name: "StopLoss", min: "20", max: "100", step: "10" },
    { name: "TakeProfit", min: "30", max: "150", step: "10" },
  ]);

  const handleSubmit = () => {
    if (!config.eaName) { toast.error("Please enter an EA name"); return; }
    createRun.mutate({
      name: config.eaName,
      symbol: config.symbol,
      timeframe: config.timeframe,
      dataSource: "reference" as const,
      parameters: {
        runType: config.runType,
        startDate: config.startDate,
        endDate: config.endDate,
        initialBalance: config.initialBalance,
        leverage: config.leverage,
        spread: config.spread,
        monteCarloRuns: config.monteCarloRuns,
        walkForwardWindows: config.walkForwardWindows,
        parameterSweep: (config.runType === "parameter_sweep" || config.runType === "stress_test") ? params : undefined,
      },
    });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle>Test Configuration</CardTitle><CardDescription>Set up the basic parameters for your EA test run.</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>EA Name</Label><Input value={config.eaName} onChange={e => setConfig(c => ({ ...c, eaName: e.target.value }))} placeholder="e.g., AureusPrime v2.1" className="bg-input border-border mt-1.5" /></div>
              <div><Label>Run Type</Label>
                <Select value={config.runType} onValueChange={v => setConfig(c => ({ ...c, runType: v }))}>
                  <SelectTrigger className="bg-input border-border mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{RUN_TYPES.map(rt => <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Symbol</Label><Input value={config.symbol} onChange={e => setConfig(c => ({ ...c, symbol: e.target.value }))} className="bg-input border-border mt-1.5" /></div>
              <div><Label>Timeframe</Label>
                <Select value={config.timeframe} onValueChange={v => setConfig(c => ({ ...c, timeframe: v }))}>
                  <SelectTrigger className="bg-input border-border mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{TIMEFRAMES.map(tf => <SelectItem key={tf} value={tf}>{tf}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Start Date</Label><Input type="date" value={config.startDate} onChange={e => setConfig(c => ({ ...c, startDate: e.target.value }))} className="bg-input border-border mt-1.5" /></div>
              <div><Label>End Date</Label><Input type="date" value={config.endDate} onChange={e => setConfig(c => ({ ...c, endDate: e.target.value }))} className="bg-input border-border mt-1.5" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div><Label>Initial Balance ($)</Label><Input type="number" value={config.initialBalance} onChange={e => setConfig(c => ({ ...c, initialBalance: Number(e.target.value) }))} className="bg-input border-border mt-1.5" /></div>
              <div><Label>Leverage (1:X)</Label><Input type="number" value={config.leverage} onChange={e => setConfig(c => ({ ...c, leverage: Number(e.target.value) }))} className="bg-input border-border mt-1.5" /></div>
              <div><Label>Spread (points)</Label><Input type="number" value={config.spread} onChange={e => setConfig(c => ({ ...c, spread: Number(e.target.value) }))} className="bg-input border-border mt-1.5" /></div>
            </div>
            {config.runType === "monte_carlo" && (
              <div><Label>Monte Carlo Iterations</Label>
                <div className="flex items-center gap-4 mt-1.5">
                  <Slider value={[config.monteCarloRuns]} onValueChange={v => setConfig(c => ({ ...c, monteCarloRuns: v[0] }))} min={100} max={10000} step={100} className="flex-1" />
                  <span className="text-sm font-medium w-16 text-right">{config.monteCarloRuns}</span>
                </div>
              </div>
            )}
            {config.runType === "walk_forward" && (
              <div><Label>Walk-Forward Windows</Label><Input type="number" value={config.walkForwardWindows} onChange={e => setConfig(c => ({ ...c, walkForwardWindows: Number(e.target.value) }))} className="bg-input border-border mt-1.5 max-w-32" /></div>
            )}
          </CardContent>
        </Card>

        {(config.runType === "parameter_sweep" || config.runType === "stress_test") && (
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Parameter Sweep</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setParams(p => [...p, { name: "", min: "0", max: "100", step: "10" }])}>Add Parameter</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {params.map((p, i) => (
                  <div key={i} className="grid grid-cols-4 gap-3">
                    <Input placeholder="Name" value={p.name} onChange={e => { const np = [...params]; np[i].name = e.target.value; setParams(np); }} className="bg-input border-border" />
                    <Input placeholder="Min" type="number" value={p.min} onChange={e => { const np = [...params]; np[i].min = e.target.value; setParams(np); }} className="bg-input border-border" />
                    <Input placeholder="Max" type="number" value={p.max} onChange={e => { const np = [...params]; np[i].max = e.target.value; setParams(np); }} className="bg-input border-border" />
                    <Input placeholder="Step" type="number" value={p.step} onChange={e => { const np = [...params]; np[i].step = e.target.value; setParams(np); }} className="bg-input border-border" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle>Run Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">EA</span><span className="font-medium">{config.eaName || "—"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Type</span><span className="font-medium capitalize">{config.runType.replace("_", " ")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Symbol</span><span className="font-medium">{config.symbol}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Timeframe</span><span className="font-medium">{config.timeframe}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Period</span><span className="font-medium">{config.startDate} to {config.endDate}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Balance</span><span className="font-medium">${config.initialBalance.toLocaleString()}</span></div>
            <div className="border-t border-border pt-3 mt-3">
              <Button onClick={handleSubmit} disabled={createRun.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {createRun.isPending ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Play size={16} className="mr-2" />}
                Submit Run
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-sm">Quick Presets</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Conservative Backtest", ea: "AureusPrime", type: "backtest", tf: "H1" },
              { label: "Monte Carlo Stress", ea: "AureusPrime", type: "monte_carlo", tf: "M15" },
              { label: "Walk-Forward Validation", ea: "AureusPrime", type: "walk_forward", tf: "H4" },
              { label: "Full Parameter Sweep", ea: "AureusPrime", type: "parameter_sweep", tf: "H1" },
              { label: "Stress Test (All Conditions)", ea: "AureusPrime", type: "stress_test", tf: "D1" },
            ].map((preset, i) => (
              <button key={i} onClick={() => setConfig(c => ({ ...c, eaName: preset.ea, runType: preset.type, timeframe: preset.tf }))} className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm">
                <span className="font-medium">{preset.label}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">{preset.ea} &middot; {preset.tf}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QueueTab() {
  const utils = trpc.useUtils();
  const { data: runs, isLoading } = trpc.studio.getRuns.useQuery(undefined, { refetchInterval: 3000 });
  const startRun = trpc.studio.startRun.useMutation({
    onSuccess: () => { toast.success("Run started!"); utils.studio.getRuns.invalidate(); },
    onError: (e) => toast.error(e.message),
  });
  const cancelRun = trpc.studio.cancelRun.useMutation({
    onSuccess: () => { toast.success("Run cancelled"); utils.studio.getRuns.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) return <LoadingCard />;
  if (!runs || runs.length === 0) return (
    <Card className="bg-card border-border"><CardContent className="pt-6 text-center">
      <Layers size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Runs Yet</h3>
      <p className="text-muted-foreground">Configure and submit your first test run from the Configure tab.</p>
    </CardContent></Card>
  );

  const statusIcon = (s: string) => {
    if (s === "completed") return <CheckCircle2 size={16} className="text-green-400" />;
    if (s === "running") return <Loader2 size={16} className="text-primary animate-spin" />;
    if (s === "failed") return <XCircle size={16} className="text-destructive" />;
    if (s === "cancelled") return <Square size={16} className="text-muted-foreground" />;
    return <Clock size={16} className="text-yellow-400" />;
  };

  return (
    <div className="space-y-3">
      {runs.map((run: any) => (
        <Card key={run.id} className="bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {statusIcon(run.status)}
                <div>
                  <span className="font-medium">{run.eaName || run.name}</span>
                  <span className="text-sm text-muted-foreground ml-3">{run.symbol} &middot; {run.timeframe}</span>
                </div>
                <Badge className="capitalize bg-secondary text-secondary-foreground">{(run.runType || "backtest").replace("_", " ")}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={run.status === "completed" ? "default" : run.status === "failed" ? "destructive" : "secondary"} className="capitalize">{run.status}</Badge>
                {run.status === "queued" && (
                  <>
                    <Button size="sm" onClick={() => startRun.mutate({ id: run.id })} disabled={startRun.isPending} className="bg-primary text-primary-foreground">
                      {startRun.isPending ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} className="mr-1" />}Start
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => cancelRun.mutate({ id: run.id })} disabled={cancelRun.isPending}>
                      <Square size={14} className="mr-1" />Cancel
                    </Button>
                  </>
                )}
                {run.status === "running" && (
                  <Button size="sm" variant="destructive" onClick={() => cancelRun.mutate({ id: run.id })} disabled={cancelRun.isPending}>
                    <Square size={14} className="mr-1" />Stop
                  </Button>
                )}
                <span className="text-xs text-muted-foreground">{new Date(run.createdAt).toLocaleString()}</span>
              </div>
            </div>
            {run.status === "running" && (
              <div className="mt-3">
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all animate-pulse" style={{ width: "60%" }} />
                </div>
                <span className="text-xs text-muted-foreground mt-1">Processing...</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ResultsTab() {
  const { data: results, isLoading } = trpc.studio.getRuns.useQuery();
  const [selectedRun, setSelectedRun] = useState<number | null>(null);

  if (isLoading) return <LoadingCard />;
  const completed = results?.filter((r: any) => r.status === "completed") ?? [];
  if (completed.length === 0) return (
    <Card className="bg-card border-border"><CardContent className="pt-6 text-center">
      <BarChart3 size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
      <p className="text-muted-foreground">Complete a test run to see results here. Go to Run Queue and click Start on a queued run.</p>
    </CardContent></Card>
  );

  const activeRun = selectedRun !== null ? completed.find((r: any) => r.id === selectedRun) : completed[0];

  return (
    <div className="space-y-6">
      {/* Run Selector */}
      {completed.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {completed.map((r: any) => (
            <button
              key={r.id}
              onClick={() => setSelectedRun(r.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                (activeRun?.id === r.id) ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {r.name || r.eaName} &middot; {r.symbol}
            </button>
          ))}
        </div>
      )}

      {activeRun && <RunResultDetail run={activeRun} />}
    </div>
  );
}

function RunResultDetail({ run }: { run: any }) {
  const metrics = run.metrics || {};
  const results = run.results || {};
  const equityCurve = results.equityCurve || [];
  const drawdownCurve = results.drawdownCurve || [];
  const monthlyReturns = results.monthlyReturns || [];
  const tradeDistribution = results.tradeDistribution || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{run.name || run.eaName}</CardTitle>
              <CardDescription>{run.symbol} &middot; {run.timeframe} &middot; {new Date(run.createdAt).toLocaleDateString()}</CardDescription>
            </div>
            <Badge className="bg-green-500/10 text-green-400">Completed</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={DollarSign} label="Net Profit" value={`$${(metrics.netProfit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} positive={(metrics.netProfit ?? 0) >= 0} />
        <MetricCard icon={Percent} label="Win Rate" value={`${(metrics.winRate ?? 0).toFixed(1)}%`} positive={(metrics.winRate ?? 0) >= 50} />
        <MetricCard icon={TrendingUp} label="Profit Factor" value={(metrics.profitFactor ?? 0).toFixed(2)} positive={(metrics.profitFactor ?? 0) >= 1} />
        <MetricCard icon={TrendingDown} label="Max Drawdown" value={`${(metrics.maxDrawdownPercent ?? 0).toFixed(1)}%`} positive={(metrics.maxDrawdownPercent ?? 0) > -20} />
        <MetricCard icon={BarChart3} label="Sharpe Ratio" value={(metrics.sharpeRatio ?? 0).toFixed(2)} positive={(metrics.sharpeRatio ?? 0) > 1} />
        <MetricCard icon={DollarSign} label="Total Trades" value={String(metrics.totalTrades ?? 0)} />
        <MetricCard icon={TrendingUp} label="Avg Win" value={`$${(metrics.avgWin ?? 0).toFixed(2)}`} positive />
        <MetricCard icon={TrendingDown} label="Avg Loss" value={`$${(metrics.avgLoss ?? 0).toFixed(2)}`} positive={false} />
      </div>

      {/* Equity Curve Chart */}
      {equityCurve.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader><CardTitle>Equity Curve</CardTitle><CardDescription>Account balance progression over {equityCurve.length} trades</CardDescription></CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityCurve}>
                  <defs>
                    <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4a843" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d4a843" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="trade" stroke="#666" tick={{ fill: "#888", fontSize: 11 }} label={{ value: "Trade #", position: "insideBottom", offset: -5, fill: "#888" }} />
                  <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                    formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Equity"]}
                    labelFormatter={(label: number) => `Trade #${label}`}
                  />
                  <ReferenceLine y={10000} stroke="#555" strokeDasharray="3 3" label={{ value: "Initial", fill: "#666", fontSize: 11 }} />
                  <Area type="monotone" dataKey="equity" stroke="#d4a843" fill="url(#equityGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drawdown Chart */}
      {drawdownCurve.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader><CardTitle>Drawdown Curve</CardTitle><CardDescription>Percentage drawdown from equity peak</CardDescription></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={drawdownCurve}>
                  <defs>
                    <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="trade" stroke="#666" tick={{ fill: "#888", fontSize: 11 }} />
                  <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v: number) => `${v.toFixed(0)}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                    formatter={(value: number) => [`${value.toFixed(2)}%`, "Drawdown"]}
                    labelFormatter={(label: number) => `Trade #${label}`}
                  />
                  <Area type="monotone" dataKey="drawdown" stroke="#ef4444" fill="url(#ddGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Returns */}
        {monthlyReturns.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader><CardTitle>Monthly Returns</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyReturns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#666" tick={{ fill: "#888", fontSize: 11 }} />
                    <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 11 }} tickFormatter={(v: number) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                      formatter={(value: number) => [`${value.toFixed(2)}%`, "Return"]}
                    />
                    <ReferenceLine y={0} stroke="#555" />
                    <Bar dataKey="return" fill="#d4a843" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trade Distribution */}
        {tradeDistribution.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader><CardTitle>Trade P/L Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tradeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="range" stroke="#666" tick={{ fill: "#888", fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                    <YAxis stroke="#666" tick={{ fill: "#888", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                      formatter={(value: number) => [value, "Trades"]}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Stats Table */}
      <Card className="bg-card border-border">
        <CardHeader><CardTitle>Detailed Statistics</CardTitle></CardHeader>
        <CardContent>
          <div className	            {[
	              ["Total Trades", metrics.totalTrades],
	              ["Winning Trades", metrics.wins],
	              ["Losing Trades", metrics.losses],
	              ["Win Rate", `${(metrics.winRate ?? 0).toFixed(1)}%`],
	              ["Profit Factor", (metrics.profitFactor ?? 0).toFixed(2)],
	              ["Net Profit", `$${(metrics.netProfit ?? 0).toFixed(2)}`],
	              ["Avg Win", `$${(metrics.avgWin ?? 0).toFixed(2)}`],
	              ["Avg Loss", `$${(metrics.avgLoss ?? 0).toFixed(2)}`],
	              ["Max Drawdown", `${(metrics.maxDrawdownPercent ?? 0).toFixed(2)}%`],
	              ["Sharpe Ratio", (metrics.sharpeRatio ?? 0).toFixed(2)],
	              ["Sortino Ratio", (metrics.sortinoRatio ?? 0).toFixed(2)],
	              ["Calmar Ratio", (metrics.calmarRatio ?? 0).toFixed(2)],
	              ["Recovery Factor", (metrics.recoveryFactor ?? 0).toFixed(2)],
	              ["VaR (95%)", `${(metrics.valueAtRisk95 ?? 0).toFixed(2)}%`],
	              ["VaR (99%)", `${(metrics.valueAtRisk99 ?? 0).toFixed(2)}%`],
	              ["Symbol", run.symbol],
	            ].map(([label, value], i) => (  <div key={i} className="flex justify-between text-sm py-1.5 border-b border-border/30">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReferenceTab() {
  const { data: symbols, isLoading } = trpc.referenceData.getAll.useQuery();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    if (!symbols) return [];
    return symbols.filter((s: any) => {
      const matchSearch = !search || s.symbol.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || s.category === category;
      return matchSearch && matchCat;
    });
  }, [symbols, search, category]);

  const categories = useMemo(() => {
    if (!symbols) return [];
    const cats = Array.from(new Set(symbols.map((s: any) => s.category)));
    return cats.sort();
  }, [symbols]);

  if (isLoading) return <LoadingCard />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input placeholder="Search symbols..." value={search} onChange={e => setSearch(e.target.value)} className="bg-input border-border md:max-w-xs" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-input border-border md:max-w-48"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground self-center">{filtered.length} symbols</div>
      </div>
      <Card className="bg-card border-border">
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 pr-4">Symbol</th>
                <th className="text-left py-2 pr-4">Description</th>
                <th className="text-left py-2 pr-4">Category</th>
                <th className="text-right py-2 pr-4">Digits</th>
                <th className="text-right py-2 pr-4">Pip Value</th>
                <th className="text-right py-2">Spread</th>
              </tr></thead>
              <tbody>
                {filtered.slice(0, 100).map((s: any) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="py-2 pr-4 font-medium text-primary">{s.symbol}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{s.description || "—"}</td>
                    <td className="py-2 pr-4"><Badge variant="secondary" className="capitalize text-xs">{s.category}</Badge></td>
                    <td className="py-2 pr-4 text-right">{s.digits}</td>
                    <td className="py-2 pr-4 text-right">{s.pipValue ?? "—"}</td>
                    <td className="py-2 text-right">{s.spreadTypical ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsTab() {
  const { data: results, isLoading } = trpc.studio.getRuns.useQuery();

  if (isLoading) return <LoadingCard />;
  const completed = results?.filter((r: any) => r.status === "completed") ?? [];
  if (completed.length === 0) return (
    <Card className="bg-card border-border"><CardContent className="pt-6 text-center">
      <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Reports Available</h3>
      <p className="text-muted-foreground">Complete a test run to generate reports.</p>
    </CardContent></Card>
  );

  const exportReport = (run: any) => {
    const m = run.metrics || {};
    const lines = [
      `FoldForge EA Test Report`,
      `========================`,
      `EA: ${run.name || run.eaName}`,
      `Symbol: ${run.symbol}`,
      `Timeframe: ${run.timeframe}`,
      `Date: ${new Date(run.createdAt).toLocaleDateString()}`,
      ``,
      `--- Key Metrics ---`,
      `Net Profit: $${(m.netProfit ?? 0).toFixed(2)}`,
      `Win Rate: ${(m.winRate ?? 0).toFixed(1)}%`,
      `Profit Factor: ${(m.profitFactor ?? 0)	      `Max Drawdown: ${(m.maxDrawdownPercent ?? 0).toFixed(2)}%`,
	      `Sharpe Ratio: ${(m.sharpeRatio ?? 0).toFixed(2)}`,
	      `Sortino Ratio: ${(m.sortinoRatio ?? 0).toFixed(2)}`,
	      `Calmar Ratio: ${(m.calmarRatio ?? 0).toFixed(2)}`,
	      `VaR (95%): ${(m.valueAtRisk95 ?? 0).toFixed(2)}%`,
	      `Total Trades: ${m.totalTrades ?? 0}`,
	      `Avg Win: $${(m.avgWin ?? 0).toFixed(2)}`,
	      `Avg Loss: $${(m.avgLoss ?? 0).toFixed(2)}`,
	      `Recovery Factor: ${(m.recoveryFactor ?? 0).toFixed(2)}`, ``,
      `--- Generated by FoldForge Studio ---`,
      `Giddings Capital Management LLC`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `foldforge-report-${run.symbol}-${run.timeframe}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported!");
  };

  return (
    <div className="space-y-4">
      {completed.map((r: any) => (
        <Card key={r.id} className="bg-card border-border">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{r.name || r.eaName} Report</h3>
                <p className="text-sm text-muted-foreground">{r.symbol} &middot; {r.timeframe} &middot; {new Date(r.createdAt).toLocaleDateString()}</p>
                {r.metrics && (
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Net: <span className={`font-medium ${(r.metrics.netProfit ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}>${(r.metrics.netProfit ?? 0).toFixed(2)}</span></span>
                    <span>Win: <span className="font-medium">{(r.metrics.winRate ?? 0).toFixed(1)}%</span></span>
                    <span>PF: <span className="font-medium">{(r.metrics.profitFactor ?? 0).toFixed(2)}</span></span>
                    <span>DD: <span className="font-medium">{(r.metrics.maxDrawdownPercent ?? 0).toFixed(1)}%</span></span>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => exportReport(r)}>
                <FileText size={14} className="mr-1.5" />Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, positive }: { icon: any; label: string; value: string; positive?: boolean }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className={`text-lg font-bold ${positive === true ? "text-green-400" : positive === false ? "text-red-400" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function LoadingCard() {
  return (
    <Card className="bg-card border-border"><CardContent className="pt-6">
      <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-4 bg-secondary rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />)}</div>
    </CardContent></Card>
  );
}
