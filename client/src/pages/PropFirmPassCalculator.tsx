import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { trackCTAClick, trackCalculatorUsage, trackFormSubmission } from "@/lib/analytics";

type Inputs = {
  winRate: number;      // %
  rr: number;           // reward : risk
  risk: number;         // % of starting balance per trade
  tradesPerDay: number;
  target: number;       // % profit target
  maxLoss: number;      // % max total loss from starting balance
  dailyLoss: number;    // % max daily loss from start-of-day balance
  days: number;         // trading days allowed
};

type Result = {
  pass: number; failDaily: number; failMax: number; timeout: number;
  medianDays: number | null; expectancyR: number; paths: number[][];
};

const RUNS = 5000;

// Seeded PRNG so the same inputs always give the same answer.
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function simulate(i: Inputs): Result {
  const rnd = mulberry32(20261108);
  const p = i.winRate / 100;
  let pass = 0, failDaily = 0, failMax = 0, timeout = 0;
  const passDays: number[] = [];
  const paths: number[][] = [];
  for (let r = 0; r < RUNS; r++) {
    let eq = 0; // % P&L vs starting balance
    let outcome: "pass" | "daily" | "max" | "timeout" = "timeout";
    const path = [0];
    for (let d = 1; d <= i.days && outcome === "timeout"; d++) {
      const dayStart = eq;
      for (let k = 0; k < i.tradesPerDay; k++) {
        eq += rnd() < p ? i.risk * i.rr : -i.risk;
        if (eq <= -i.maxLoss) { outcome = "max"; break; }
        if (dayStart - eq >= i.dailyLoss) { outcome = "daily"; break; }
        if (eq >= i.target) { outcome = "pass"; passDays.push(d); break; }
      }
      path.push(eq);
    }
    if (outcome === "pass") pass++;
    else if (outcome === "daily") failDaily++;
    else if (outcome === "max") failMax++;
    else timeout++;
    if (r < 40) paths.push(path);
  }
  passDays.sort((a, b) => a - b);
  return {
    pass: pass / RUNS, failDaily: failDaily / RUNS, failMax: failMax / RUNS, timeout: timeout / RUNS,
    medianDays: passDays.length ? passDays[Math.floor(passDays.length / 2)] : null,
    expectancyR: p * i.rr - (1 - p),
    paths,
  };
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

function Field({ label, hint, value, onChange, min, max, step, suffix }: {
  label: string; hint?: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; suffix?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-sm font-bold text-primary tabular-nums">{value}{suffix}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-[oklch(0.82_0.12_85)]"
        aria-label={label}
      />
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </label>
  );
}

function PathsChart({ paths, target, maxLoss, days }: { paths: number[][]; target: number; maxLoss: number; days: number }) {
  const W = 600, H = 260, P = 28;
  const lo = -maxLoss * 1.1, hi = target * 1.1;
  const x = (d: number) => P + (d / days) * (W - 2 * P);
  const y = (v: number) => H - P - ((v - lo) / (hi - lo)) * (H - 2 * P);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="40 simulated challenge equity paths">
      <line x1={P} x2={W - P} y1={y(target)} y2={y(target)} stroke="rgb(34 197 94 / .6)" strokeDasharray="5 5" />
      <text x={W - P} y={y(target) - 6} textAnchor="end" fontSize="11" fill="rgb(34 197 94)">Target +{target}%</text>
      <line x1={P} x2={W - P} y1={y(-maxLoss)} y2={y(-maxLoss)} stroke="rgb(239 68 68 / .6)" strokeDasharray="5 5" />
      <text x={W - P} y={y(-maxLoss) + 14} textAnchor="end" fontSize="11" fill="rgb(239 68 68)">Max loss −{maxLoss}%</text>
      <line x1={P} x2={W - P} y1={y(0)} y2={y(0)} stroke="currentColor" strokeOpacity=".15" />
      {paths.map((p, i) => {
        const end = p[p.length - 1];
        const color = end >= target ? "rgb(34 197 94)" : end <= -maxLoss || p.length - 1 < days ? "rgb(239 68 68)" : "rgb(148 163 184)";
        return (
          <polyline key={i} fill="none" stroke={color} strokeOpacity=".55" strokeWidth="1.2"
            points={p.map((v, d) => `${x(d).toFixed(1)},${y(Math.max(lo, Math.min(hi, v))).toFixed(1)}`).join(" ")} />
        );
      })}
    </svg>
  );
}

export default function PropFirmPassCalculator() {
  const [inp, setInp] = useState<Inputs>({
    winRate: 50, rr: 1.5, risk: 1, tradesPerDay: 2, target: 10, maxLoss: 10, dailyLoss: 5, days: 30,
  });
  const [tracked, setTracked] = useState(false);
  const set = (k: keyof Inputs) => (v: number) => {
    setInp(s => ({ ...s, [k]: v }));
    if (!tracked) { setTracked(true); trackCalculatorUsage(inp.winRate, inp.risk); }
  };
  const res = useMemo(() => simulate(inp), [inp]);

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState<"idle" | "sending" | "done" | "error">("idle");
  const sendResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent("sending");
    try {
      const r = await fetch("/api/leads/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: `pass_calculator:${(res.pass * 100).toFixed(0)}pct` }),
      });
      setSent(r.ok ? "done" : "error");
      trackFormSubmission("pass_calculator", r.ok, ["email"]);
    } catch {
      setSent("error");
    }
  };

  const verdict =
    res.expectancyR <= 0
      ? "This setup loses money on average, so more trades only make failure more likely."
      : res.pass >= 0.6
        ? "Good odds on paper. The real risk is that your EA's actual trades are streakier than a coin flip."
        : res.failDaily + res.failMax > res.pass
          ? "You are more likely to blow the challenge than pass it. Risk per trade is usually the lever to pull first."
          : "Positive edge, but too slow or too fragile for the time you have. Try adjusting risk or trades per day.";

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Prop Firm Challenge Pass Probability Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Giddings Capital Management LLC" },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Prop Firm Challenge Pass Probability Calculator (Free Monte Carlo)"
        description="Free calculator: enter your win rate, reward-to-risk and risk per trade to see your odds of passing a prop firm challenge, from 5,000 Monte Carlo simulations."
        canonical="https://foldforge.app/prop-firm-pass-calculator"
        schema={schema}
      />
      <Navbar />

      <section className="pt-32 pb-12">
        <div className="container max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] leading-tight mb-4">
            What are your odds of passing the challenge?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Set your strategy and the firm's rules. We run 5,000 simulated challenges and count how many pass, how many hit the daily limit, and how many hit max loss. Free, no sign-up.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container max-w-5xl grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10">
          <div className="glass-card rounded-2xl p-6 border border-border/50 space-y-6 h-fit">
            <h2 className="text-lg font-bold">Your strategy</h2>
            <Field label="Win rate" value={inp.winRate} onChange={set("winRate")} min={20} max={85} step={1} suffix="%" />
            <Field label="Reward to risk" hint="Average win divided by average loss." value={inp.rr} onChange={set("rr")} min={0.3} max={5} step={0.1} suffix=" : 1" />
            <Field label="Risk per trade" hint="Percent of the starting balance lost on a losing trade." value={inp.risk} onChange={set("risk")} min={0.1} max={5} step={0.1} suffix="%" />
            <Field label="Trades per day" value={inp.tradesPerDay} onChange={set("tradesPerDay")} min={1} max={15} step={1} />
            <h2 className="text-lg font-bold pt-2">Challenge rules</h2>
            <Field label="Profit target" value={inp.target} onChange={set("target")} min={2} max={20} step={1} suffix="%" />
            <Field label="Max total loss" value={inp.maxLoss} onChange={set("maxLoss")} min={3} max={15} step={1} suffix="%" />
            <Field label="Max daily loss" value={inp.dailyLoss} onChange={set("dailyLoss")} min={1} max={10} step={0.5} suffix="%" />
            <Field label="Trading days allowed" value={inp.days} onChange={set("days")} min={5} max={90} step={1} />
            <p className="text-xs text-muted-foreground">Defaults match a common two-step phase 1. Check your firm's current rules.</p>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-primary/30">
              <p className="text-sm text-muted-foreground mb-1">Chance of passing</p>
              <p className="text-6xl font-bold gold-text tabular-nums mb-4" aria-live="polite">{pct(res.pass)}</p>
              <div className="flex h-3 w-full rounded-full overflow-hidden mb-3" aria-hidden="true">
                <div style={{ width: pct(res.pass) }} className="bg-green-500" />
                <div style={{ width: pct(res.failDaily) }} className="bg-orange-500" />
                <div style={{ width: pct(res.failMax) }} className="bg-red-500" />
                <div style={{ width: pct(res.timeout) }} className="bg-slate-500" />
              </div>
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div><dt className="text-muted-foreground flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />Passed</dt><dd className="font-bold tabular-nums">{pct(res.pass)}</dd></div>
                <div><dt className="text-muted-foreground flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" />Daily limit hit</dt><dd className="font-bold tabular-nums">{pct(res.failDaily)}</dd></div>
                <div><dt className="text-muted-foreground flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" />Max loss hit</dt><dd className="font-bold tabular-nums">{pct(res.failMax)}</dd></div>
                <div><dt className="text-muted-foreground flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-500" />Ran out of time</dt><dd className="font-bold tabular-nums">{pct(res.timeout)}</dd></div>
              </dl>
              <div className="grid grid-cols-2 gap-3 text-sm mt-4 pt-4 border-t border-border/50">
                <div><p className="text-muted-foreground">Expectancy per trade</p><p className="font-bold tabular-nums">{res.expectancyR >= 0 ? "+" : ""}{res.expectancyR.toFixed(2)}R</p></div>
                <div><p className="text-muted-foreground">Median days to pass</p><p className="font-bold tabular-nums">{res.medianDays ?? "—"}</p></div>
              </div>
              <p className="text-sm mt-4">{verdict}</p>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-border/50">
              <p className="text-sm text-muted-foreground mb-2 px-2">40 of the 5,000 simulated challenges</p>
              <PathsChart paths={res.paths} target={inp.target} maxLoss={inp.maxLoss} days={inp.days} />
            </div>

            <div className="rounded-2xl p-6 border border-primary/40 bg-primary/5">
              <h2 className="text-xl font-bold mb-2">This calculator assumes every trade is independent.</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Real expert advisors aren't. Losses cluster, spreads widen at news, and one parameter change can double the drawdown. FoldForge runs the same Monte Carlo on your EA's actual trades, with your broker's real spreads, so you see the odds for the strategy you'll really trade.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/pricing" onClick={() => trackCTAClick("Test my real EA", "pass_calculator")}>
                  <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                    Test my real EA free for 7 days <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground mt-3">$0 today. Cancel before day 7 and you pay nothing.</p>
            </div>

            <form onSubmit={sendResult} className="glass-card rounded-2xl p-6 border border-border/50">
              {sent === "done" ? (
                <p className="flex items-center gap-2 text-sm"><CheckCircle2 size={18} className="text-green-500" /> Saved. We'll send you our prop firm risk checklist and follow up about your result.</p>
              ) : (
                <>
                  <label htmlFor="pc-email" className="text-sm font-semibold block mb-1">Not ready to test your EA yet?</label>
                  <p className="text-xs text-muted-foreground mb-3">Get our prop firm risk checklist and a note on how to improve this result.</p>
                  <div className="flex gap-2">
                    <input id="pc-email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="flex-1 min-w-0 h-11 rounded-lg bg-background border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                    <Button type="submit" disabled={sent === "sending"} className="h-11">
                      <Mail size={16} className="mr-2" />{sent === "sending" ? "Sending" : "Send it"}
                    </Button>
                  </div>
                  {sent === "error" && <p className="text-xs text-red-500 mt-2">That didn't go through. Check the address and try again.</p>}
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-border/50">
        <div className="container max-w-3xl space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-bold font-['Playfair_Display'] text-foreground">How the pass probability is calculated</h2>
          <p>Each simulated challenge starts at 0% and plays out day by day. Every trade wins with your win rate, making your risk times your reward-to-risk ratio, or loses your risk. A challenge fails the moment equity falls to the max total loss, or falls by the daily limit from where that day started. It passes the moment equity reaches the target. If neither happens within the allowed days, it runs out of time.</p>
          <p>Risk is measured against the starting balance, which is how most firms set their loss limits. The simulation uses a fixed random seed, so the same inputs always give the same answer.</p>
          <h2 className="text-2xl font-bold font-['Playfair_Display'] text-foreground">Why win rate alone tells you almost nothing</h2>
          <p>A 65% win rate with a 0.5 reward-to-risk ratio loses money. A 40% win rate at 2:1 makes money. What decides a challenge is expectancy per trade and how deep the losing streaks run relative to the daily limit, which is why lowering risk per trade often raises the pass rate even though it slows you down.</p>
          <p className="text-xs">For education only. Results are simulations based on the inputs you choose, not a prediction of your trading. Trading on margin carries a high level of risk.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
