import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Shield, Zap, BarChart3, Database, Lock, TrendingUp,
  CheckCircle2, ArrowRight, ChevronDown, ChevronUp, Star,
  Activity, AlertTriangle, Target
} from "lucide-react";
import { useState } from "react";

const STRIPE_LINKS = {
  starter: "https://buy.stripe.com/9B6bJ11ITaEd7TJ6MBb3q02",
  pro: "https://buy.stripe.com/aFa14n3R1cMl6PF2wlb3q01",
  funded: "https://buy.stripe.com/28EaEX73deUtc9Z5Ixb3q03",
};

const PAIN_POINTS = [
  { icon: AlertTriangle, title: "Blown Funded Accounts", desc: "One rogue EA trade wipes your $200K funded account. No risk controls. No alerts. Just a failed challenge." },
  { icon: Target, title: "Untested Strategies", desc: "You deploy EAs with default settings and hope for the best. No stress testing. No edge validation." },
  { icon: Database, title: "Wrong Broker Data", desc: "Your backtest uses generic data while your broker has different spreads, swaps, and margin requirements." },
];

const FEATURES = [
  { icon: Zap, title: "EA Stress Testing Studio", desc: "Run Monte Carlo simulations, parameter sweeps, and walk-forward analysis on any Expert Advisor." },
  { icon: Database, title: "Broker Data Pipeline", desc: "Sync your broker's exact symbol specs, spreads, and OHLC history via our MT4/MT5 uploader EA." },
  { icon: Shield, title: "Funded Account Guardian", desc: "Real-time drawdown monitoring with automatic position sizing to protect your prop firm capital." },
  { icon: BarChart3, title: "172+ Symbol Reference Hub", desc: "Pre-loaded reference data across forex, metals, indices, crypto, commodities, and bonds." },
  { icon: Lock, title: "License-Gated Access", desc: "Hardware-bound license keys with activation limits, grace periods, and instant provisioning." },
  { icon: TrendingUp, title: "Performance Analytics", desc: "Equity curves, Sharpe ratios, profit factors, monthly returns, and exportable PDF reports." },
];

const PLANS = [
  { name: "Starter", price: 19, link: STRIPE_LINKS.starter, features: ["1 EA License", "Reference Data Access", "Basic Studio Runs", "Email Support", "Community Access"], cta: "Start Free Trial" },
  { name: "Pro", price: 39, popular: true, link: STRIPE_LINKS.pro, features: ["5 EA Licenses", "Broker Data Sync", "Unlimited Studio Runs", "Priority Support", "Advanced Analytics", "Funded Account Guardian"], cta: "Go Pro" },
  { name: "Funded", price: 79, link: STRIPE_LINKS.funded, features: ["25 EA Licenses", "Full Broker Pipeline", "White-Label Reports", "Dedicated Support", "API Access", "Custom Integrations", "Prop Firm Dashboard"], cta: "Go Funded" },
];

const FAQS = [
  { q: "What is FoldForge?", a: "FoldForge is an institutional-grade SaaS platform for MetaTrader traders. It provides EA stress testing, broker data synchronization, and risk management tools designed to protect funded trading accounts." },
  { q: "Does FoldForge work with MT4 and MT5?", a: "Yes. FoldForge supports both MetaTrader 4 and MetaTrader 5 through our uploader Expert Advisors that sync your broker's data directly into the studio." },
  { q: "How does the broker data pipeline work?", a: "Install our lightweight data-pulling EA on your MT4/MT5 platform. It automatically syncs your broker's symbol specifications, spread samples, and OHLC history to your FoldForge account." },
  { q: "Can I cancel my subscription anytime?", a: "Absolutely. You can cancel at any time from your dashboard. Your access continues until the end of your current billing period. See our refund policy for details." },
  { q: "What is the Funded Account Guardian?", a: "The Funded Account Guardian monitors your prop firm account in real-time, enforcing drawdown limits and position sizing rules to prevent catastrophic losses that could fail your funded challenge." },
  { q: "Is my trading data secure?", a: "Yes. All data is encrypted in transit and at rest. We never share your trading data with third parties. Your broker credentials never touch our servers — only the data-pulling EA communicates with your platform." },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.82_0.12_85/0.08),transparent_60%)]" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Activity size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">Institutional-Grade EA Testing Platform</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-['Playfair_Display'] leading-tight mb-6">
              Stop <span className="gold-text">Guessing</span>.<br />
              Start <span className="gold-text">Stress Testing</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              FoldForge is the professional EA testing studio and risk management platform that protects your funded accounts, validates your edge, and uses your broker's real data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link href="/studio">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                    Open Studio <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">
                    Get Started Free <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              )}
              <Link href="/docs">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base border-border hover:bg-secondary">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">The Problems We <span className="gold-text">Solve</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Every day, traders lose funded accounts because they skip the most critical step: proper EA validation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="glass-card rounded-xl p-6">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <p.icon size={22} className="text-destructive" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Your Complete <span className="gold-text">Trading Arsenal</span></h2>
            <p className="text-muted-foreground">Everything you need to test, validate, and deploy Expert Advisors with confidence.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prop Firm Guardian */}
      <section className="py-20 border-t border-border/50 bg-primary/[0.03]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mb-6">
                <Shield size={14} className="text-primary" />
                <span className="text-xs font-medium text-primary">Funded Account Protection</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-6">The <span className="gold-text">Prop Firm Guardian</span></h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">Never blow a funded account again. The Prop Firm Guardian monitors your account in real-time, enforcing the exact drawdown limits and risk parameters set by your prop firm.</p>
              <div className="space-y-3">
                {["Real-time drawdown monitoring", "Automatic lot-size enforcement", "Daily loss limit protection", "Instant alerts on rule violations", "Compatible with all major prop firms"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-primary shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Account Balance</span><span className="text-lg font-bold text-foreground">$200,000.00</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Daily Drawdown Limit</span><span className="text-sm font-medium text-primary">5% ($10,000)</span></div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: "23%" }} /></div>
                <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Current Drawdown: 1.15%</span><span className="text-green-400">Safe Zone</span></div>
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Max Drawdown Limit</span><span className="text-sm font-medium text-primary">10% ($20,000)</span></div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mt-2"><div className="h-full bg-green-500 rounded-full" style={{ width: "12%" }} /></div>
                </div>
                <div className="border-t border-border pt-4 mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400 font-medium">Guardian Active — All Rules Passing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 border-t border-border/50" id="pricing">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Simple, Transparent <span className="gold-text">Pricing</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Choose the plan that fits your trading operation. All plans include a 7-day free trial.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <div key={i} className={`rounded-xl p-6 border ${plan.popular ? "border-primary bg-primary/5 relative" : "border-border glass-card"}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Most Popular</div>}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-bold gold-text">${plan.price}</span><span className="text-muted-foreground text-sm">/month</span></div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2.5"><CheckCircle2 size={16} className="text-primary shrink-0" /><span className="text-sm text-foreground">{f}</span></div>
                  ))}
                </div>
                <a href={plan.link} target="_blank" rel="noopener noreferrer">
                  <Button className={`w-full ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>{plan.cta}</Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-t border-border/50 bg-primary/[0.03]">
        <div className="container">
          <div className="text-center mb-14"><h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Trusted by <span className="gold-text">Serious Traders</span></h2></div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Marcus R.", role: "Prop Firm Trader", quote: "FoldForge saved my $100K FTMO account. The Guardian caught a drawdown spike I would have missed." },
              { name: "Sarah K.", role: "EA Developer", quote: "The stress testing studio is exactly what I needed. Monte Carlo runs on my broker's actual data — game changer." },
              { name: "David L.", role: "Fund Manager", quote: "We use FoldForge to validate every EA before deploying to client accounts. The reference data hub is invaluable." },
            ].map((t, i) => (
              <div key={i} className="glass-card rounded-xl p-6">
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-primary fill-primary" />)}</div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed italic">"{t.quote}"</p>
                <div><p className="text-sm font-semibold">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-border/50">
        <div className="container max-w-3xl">
          <div className="text-center mb-14"><h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Frequently Asked <span className="gold-text">Questions</span></h2></div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-muted-foreground shrink-0" /> : <ChevronDown size={18} className="text-muted-foreground shrink-0" />}
                </button>
                {openFaq === i && <div className="px-5 pb-5"><p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border/50 bg-primary/[0.03]">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-4">Ready to <span className="gold-text">Protect Your Edge</span>?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">Join traders who trust FoldForge to validate their strategies and safeguard their funded accounts.</p>
          {isAuthenticated ? (
            <Link href="/studio"><Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">Open Studio <ArrowRight size={18} className="ml-2" /></Button></Link>
          ) : (
            <Link href="/signup"><Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 text-base font-semibold">Start Your Free Trial <ArrowRight size={18} className="ml-2" /></Button></Link>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
