import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Share2,
  Twitter,
  Linkedin,
  Copy,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Shield,
  Target,
  Brain,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

interface PropFirm {
  name: string;
  maxFunding: string;
  profitSplit: string;
  evaluation: string;
  features: string[];
  viralFactor: string;
  bestFor: string;
  icon: React.ReactNode;
}

const propFirms: PropFirm[] = [
  {
    name: "Apex Trader Funding",
    maxFunding: "$300,000",
    profitSplit: "90%",
    evaluation: "1-Phase",
    features: [
      "R|Trader platform support",
      "AI-driven drawdown alerts",
      "14-day average funding time",
    ],
    viralFactor: "1-Day Funding promotions are legendary",
    bestFor: "Traders seeking fast funding with AI-powered risk management",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    name: "FTMO",
    maxFunding: "$200,000",
    profitSplit: "80-90%",
    evaluation: "2-Phase",
    features: [
      "Blockchain payout verification",
      "1:100 leverage",
      "Premium analytics app with emotional bias scoring",
    ],
    viralFactor: "Instant, verified crypto payouts with blockchain transparency",
    bestFor: "Serious traders who value stability and institutional reputation",
    icon: <Shield className="w-6 h-6" />,
  },
  {
    name: "The Funded Trader",
    maxFunding: "$600,000",
    profitSplit: "Up to 85%",
    evaluation: "Multiple",
    features: [
      "No time limits on challenges",
      "Crypto/forex/indices support",
      "Aggressive scaling rules",
    ],
    viralFactor: "Manage over $1M in capital by year-end with scaling",
    bestFor: "Traders wanting the biggest account possible with unlimited time",
    icon: <Target className="w-6 h-6" />,
  },
  {
    name: "Topstep",
    maxFunding: "$150,000",
    profitSplit: "80%",
    evaluation: "1-Step",
    features: [
      "VR trading simulations",
      "Virtual trading floor practice",
      "VR coaching with top commodity traders",
    ],
    viralFactor: "Step into a virtual trading floor to practice under pressure",
    bestFor: "Futures traders specializing in E-mini S&P and Nasdaq",
    icon: <Brain className="w-6 h-6" />,
  },
  {
    name: "FundedNext",
    maxFunding: "$200,000",
    profitSplit: "Up to 95%",
    evaluation: "Instant/2-Phase",
    features: [
      "95% profit splits (highest in industry)",
      "Instant funding model available",
      "Start earning from day one",
    ],
    viralFactor: "Getting paid while still in the Challenge phase",
    bestFor: "Traders seeking maximum profit splits and instant funding",
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    name: "The5ers",
    maxFunding: "$4M (Scaled)",
    profitSplit: "50-100%",
    evaluation: "Instant",
    features: [
      "Unique scaling plan (doubles every 10% target)",
      "100% profit splits for Master level",
      "Low entry barrier",
    ],
    viralFactor: "Scale from small account to $4M with 100% profit splits",
    bestFor: "Traders seeking hyper-growth and maximum scaling potential",
    icon: <BarChart3 className="w-6 h-6" />,
  },
  {
    name: "Earn2Trade",
    maxFunding: "$400,000",
    profitSplit: "80%",
    evaluation: "Gauntlet Mini",
    features: [
      "AI pattern recognition in evaluation",
      "AI-powered educational dashboard",
      "Detailed trade failure analysis",
    ],
    viralFactor: "AI tells you exactly why you failed each trade",
    bestFor: "Traders seeking AI-powered education and pattern recognition",
    icon: <Award className="w-6 h-6" />,
  },
];

export default function Blog() {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title =
      "The 7 Best Funded Accounts for 2026: How to Manage $600K Without Risking a Single Penny";
    const text = `Check out the definitive guide to the best funded trading accounts for 2026. ${url}`;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        "_blank"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      {/* Featured Image */}
      <div className="w-full h-96 md:h-[500px] overflow-hidden bg-secondary/20">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663078266506/c9gxcuVLdgbmPnwHb2fzow/foldforge-blog-hero-3vJcdR7qkipBzQQUBXadDY.webp"
          alt="FoldForge Blog - The 7 Best Funded Accounts for 2026"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="font-bold text-lg hover:text-primary transition-colors">
              FoldForge
            </a>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopyUrl}>
              {copiedUrl ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container max-w-4xl mx-auto px-4 py-16 md:py-24">
        <div className="space-y-6 mb-12">
          <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-sm font-semibold text-primary">
            📊 2026 Prop Firm Guide
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            The 7 Best Funded Accounts for 2026: How to Manage{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              $600K Without Risking a Single Penny
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            The trading landscape has shifted. In 2026, you no longer need a massive personal bank
            account to trade institutional-sized lots. We've audited over 50 prop firms to bring
            you the definitive list of the 7 best funded accounts currently dominating the market.
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground pb-8 border-b border-border/40">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">By</span>
            <span>FoldForge Research Team</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Updated</span>
            <span>April 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">Read Time</span>
            <span>12 minutes</span>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="container max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="text-3xl font-bold text-primary mb-2">$600K</div>
            <p className="text-sm text-muted-foreground">
              Maximum funding available from top firms
            </p>
          </Card>
          <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <p className="text-sm text-muted-foreground">
              Highest profit split in the industry
            </p>
          </Card>
          <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="text-3xl font-bold text-primary mb-2">14 Days</div>
            <p className="text-sm text-muted-foreground">
              Fastest average funding time
            </p>
          </Card>
        </div>
      </section>

      {/* Intro Section */}
      <section className="container max-w-4xl mx-auto px-4 py-12 space-y-6">
        <h2 className="text-3xl font-bold">The Era of "Free" Capital is Here</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Proprietary trading firms have evolved into high-tech capital providers, offering traders
          up to <span className="font-semibold text-foreground">$600,000 in funded capital</span>{" "}
          with profit splits reaching a staggering <span className="font-semibold text-foreground">95%</span>.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          But with hundreds of firms popping up, which ones actually pay? Which ones have the most
          "trader-friendly" rules? And more importantly, which ones integrate best with the{" "}
          <span className="font-semibold text-foreground">FoldForge Studio</span> for strategy
          validation?
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We've audited over 50 prop firms for 2026. Here is the definitive list of the{" "}
          <span className="font-semibold text-foreground">7 Best Funded Accounts</span> that are
          currently dominating the market.
        </p>
      </section>

      {/* Prop Firms Grid */}
      <section className="container max-w-4xl mx-auto px-4 py-16 space-y-12">
        {propFirms.map((firm, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-border/40">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                {firm.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="text-2xl font-bold">{firm.name}</h3>
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                    #{index + 1}
                  </span>
                </div>
                <p className="text-muted-foreground">{firm.bestFor}</p>
              </div>
            </div>

            {/* Firm Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Max Funding
                </p>
                <p className="text-lg font-bold text-primary">{firm.maxFunding}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Profit Split
                </p>
                <p className="text-lg font-bold text-primary">{firm.profitSplit}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Evaluation
                </p>
                <p className="text-lg font-bold text-primary">{firm.evaluation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Viral Factor
                </p>
                <p className="text-sm font-semibold text-foreground">{firm.viralFactor}</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2 pl-4 border-l-2 border-primary/30">
              {firm.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="container max-w-4xl mx-auto px-4 py-16">
        <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                How to Guarantee Your Funding in 2026
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Passing a challenge is only half the battle. Staying funded is the real challenge.
                Data shows that <span className="font-semibold text-foreground">85% of traders lose their funded accounts within the first 30 days</span> due to emotional
                trading and lack of risk management.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">The FoldForge Advantage</h3>
              <p className="text-muted-foreground">
                Before you risk your challenge fee, run your strategy through the{" "}
                <span className="font-semibold text-foreground">FoldForge Studio</span>:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Monte Carlo Engine</p>
                    <p className="text-sm text-muted-foreground">
                      See if your strategy survives 1,000 "bad luck" scenarios
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Walk-Forward Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Ensure your EA isn't just "curve-fitted" to old data
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Funded Guardian</p>
                    <p className="text-sm text-muted-foreground">
                      Real-time drawdown protection designed specifically for prop firm rules
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Link href="/premium-offer">
                <Button size="lg" className="w-full md:w-auto">
                  Claim Your Free Month of Pro Now
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-3">
                For a limited time, new users can get a full free month of FoldForge Pro. No
                credit card required.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Disclaimer */}
      <section className="container max-w-4xl mx-auto px-4 py-12">
        <p className="text-sm text-muted-foreground text-center italic">
          Disclaimer: Trading involves significant risk. Prop firm challenges require discipline
          and a proven strategy. Always use validated risk management tools.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/30 mt-16">
        <div className="container max-w-4xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 FoldForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
