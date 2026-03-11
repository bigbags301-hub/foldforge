import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Download, Zap, Database, Shield, Settings, BarChart3, Key } from "lucide-react";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    content: [
      { q: "What is FoldForge?", a: "FoldForge is a SaaS platform for testing, stress-testing, and optimizing Expert Advisors (EAs) for MetaTrader 4 and MetaTrader 5. It provides institutional-grade analytics, broker data synchronization, and a comprehensive testing studio." },
      { q: "How do I create an account?", a: "Click 'Get Started' on the homepage or navigate to the login page. You can sign up using your email address. All new accounts start with a 7-day free trial." },
      { q: "What subscription plans are available?", a: "FoldForge offers three plans: Starter ($19/mo) for individual traders, Pro ($39/mo) for serious traders needing broker data, and Funded ($79/mo) for prop firm traders and fund managers." },
    ],
  },
  {
    id: "installation",
    title: "EA Installation",
    icon: Download,
    content: [
      { q: "How do I install the Aureus Prime EA?", a: "1. Download the EA file from your Dashboard > Downloads section.\n2. Open MetaTrader and navigate to File > Open Data Folder.\n3. Copy the .ex4/.ex5 file to the MQL4/Experts or MQL5/Experts folder.\n4. Restart MetaTrader.\n5. The EA will appear in the Navigator panel under Expert Advisors." },
      { q: "How do I activate my license?", a: "When you first attach the EA to a chart, it will prompt you for your license key. Enter the FF-XXXX-XXXX-XXXX key from your Dashboard. The EA will verify the key with our servers and bind it to your broker account number." },
      { q: "How many activations do I get?", a: "Starter plan: 1 activation per key. Pro plan: 3 activations per key. Funded plan: unlimited activations. You can deactivate old installations from your Dashboard to free up slots." },
    ],
  },
  {
    id: "studio",
    title: "Testing Studio",
    icon: BarChart3,
    content: [
      { q: "What test types are available?", a: "The Studio supports: Standard Backtest (historical simulation), Monte Carlo Simulation (randomized scenario analysis), Walk-Forward Analysis (out-of-sample validation), Stress Test (extreme market conditions), and Parameter Sweep (optimization across parameter ranges)." },
      { q: "How do I run a test?", a: "1. Go to Studio > Configure.\n2. Enter your EA name and select a symbol and timeframe.\n3. Set the date range, initial balance, leverage, and spread.\n4. Optionally enable parameter sweep for optimization.\n5. Click 'Submit Run' to add it to the queue.\n6. Monitor progress in the Queue tab and view results in the Results tab." },
      { q: "What metrics are calculated?", a: "Each completed run generates: Net Profit, Win Rate, Profit Factor, Maximum Drawdown, Sharpe Ratio, Recovery Factor, Average Win/Loss, Total Trades, and monthly return breakdowns with equity curve visualization." },
    ],
  },
  {
    id: "broker-data",
    title: "Broker Data Sync",
    icon: Database,
    content: [
      { q: "What is the Data Pulling EA?", a: "The Data Pulling EA is a lightweight Expert Advisor that runs on your MetaTrader platform and syncs your broker's specific data (symbol specs, spreads, OHLC history) to FoldForge. This allows you to test with your actual broker conditions." },
      { q: "How do I set up broker data sync?", a: "1. Download the Data Pulling EA from your Dashboard.\n2. Install it on any chart in your MetaTrader platform.\n3. Enter your FoldForge API key in the EA settings.\n4. The EA will automatically sync symbol specifications, spread samples, and price history.\n5. Data appears in your Dashboard > Broker Data tab." },
      { q: "How often does data sync?", a: "The EA sends a heartbeat every 60 seconds and syncs spread samples every 5 minutes. Full symbol spec updates occur daily. OHLC history syncs on first connection and then incrementally." },
    ],
  },
  {
    id: "license-keys",
    title: "License Management",
    icon: Key,
    content: [
      { q: "What is the license key format?", a: "All FoldForge license keys follow the format FF-XXXX-XXXX-XXXX where X is an alphanumeric character. Keys are automatically generated when you subscribe." },
      { q: "Can I transfer a license to another account?", a: "License keys are bound to your FoldForge account and cannot be transferred. However, you can deactivate a key from one broker account and activate it on another." },
      { q: "What happens if my subscription expires?", a: "When your subscription expires, your license keys enter a 3-day grace period. During this time, existing activations continue to work but new activations are blocked. After the grace period, all activations are deactivated." },
    ],
  },
  {
    id: "prop-firms",
    title: "Prop Firm Guardian",
    icon: Shield,
    content: [
      { q: "What is the Prop Firm Guardian?", a: "The Prop Firm Guardian is a feature available on Pro and Funded plans that monitors your EA's behavior against common prop firm rules: daily drawdown limits, maximum drawdown, lot size restrictions, and trading hour requirements." },
      { q: "Which prop firms are supported?", a: "The Guardian includes presets for major prop firms including FTMO, MyForexFunds, The5ers, True Forex Funds, and others. You can also create custom rule sets for any prop firm." },
      { q: "How does it work?", a: "The Guardian runs as a layer on top of your EA testing. It flags any trades or patterns that would violate prop firm rules, giving you confidence before going live with a funded account evaluation." },
    ],
  },
  {
    id: "api",
    title: "API & Integration",
    icon: Settings,
    content: [
      { q: "Does FoldForge have an API?", a: "Yes. Funded plan subscribers get access to the FoldForge REST API for programmatic license verification, broker data access, and studio run management." },
      { q: "License Verification Endpoint", a: "POST /api/license/verify\nBody: { licenseKey: 'FF-XXXX-XXXX-XXXX', accountNumber: '12345' }\nReturns: { valid: true, plan: 'pro', expiresAt: '...' }" },
      { q: "Broker Data Sync Endpoint", a: "POST /api/broker/sync\nHeaders: X-License-Key: FF-XXXX-XXXX-XXXX\nBody: { type: 'symbol_specs' | 'ohlc' | 'spread', data: [...] }\nUsed by the Data Pulling EA to transmit broker data." },
    ],
  },
];

export default function Docs() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-['Playfair_Display'] mb-4"><span className="gold-text">Documentation</span></h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to know about FoldForge, from getting started to advanced API integration.</p>
          </div>
          <Tabs defaultValue="getting-started" className="max-w-4xl mx-auto">
            <TabsList className="bg-secondary/50 border border-border flex-wrap mb-8 h-auto gap-1 p-1">
              {sections.map(s => (
                <TabsTrigger key={s.id} value={s.id} className="text-xs">
                  <s.icon size={12} className="mr-1" />{s.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {sections.map(s => (
              <TabsContent key={s.id} value={s.id}>
                <div className="space-y-4">
                  {s.content.map((item, i) => (
                    <Card key={i} className="bg-card border-border">
                      <CardHeader className="pb-2"><CardTitle className="text-base">{item.q}</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-muted-foreground whitespace-pre-line">{item.a}</p></CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
