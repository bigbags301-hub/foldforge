import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Zap, Shield, Activity, Target, Gauge, Brain, BarChart3, Lock, TrendingUp, CheckCircle2, ArrowRight, Loader2, Award } from "lucide-react";
import { toast } from "sonner";

interface VariantAProps {
  onClose: () => void;
}

/**
 * Variant A: Luxury Minimalist Design
 * Focus: Institutional credibility, exclusivity, and premium positioning
 * Layout: Vertical single-column with hero-style messaging
 */
export default function PremiumPopupVariantA({ onClose }: VariantAProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const PRO_FEATURES = [
    { icon: Zap, label: "Unlimited Studio Runs", desc: "Test as many EAs as you need" },
    { icon: Shield, label: "Full Broker Data Sync", desc: "MT4/MT5 integration included" },
    { icon: Activity, label: "Monte Carlo Simulations", desc: "1000+ trade resampling" },
    { icon: Target, label: "Walk-Forward Analysis", desc: "Detect overfitting instantly" },
    { icon: Gauge, label: "Advanced Analytics & Reports", desc: "Institutional-grade metrics" },
    { icon: Brain, label: "Funded Account Guardian", desc: "Real-time drawdown protection" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter both name and email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          source: "premium_free_month_popup_variant_a",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Welcome! Check your email for next steps.");
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Premium signup failed", err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-background rounded-2xl border border-primary/20 shadow-2xl overflow-hidden animate-in scale-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        {/* Header Section */}
        <div className="relative px-8 md:px-12 pt-12 pb-8 bg-gradient-to-b from-primary/8 to-transparent border-b border-primary/10">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0">
              <Award size={28} className="text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold font-['Playfair_Display'] mb-2">
                Unlock <span className="gold-text">Pro Features</span>
              </h2>
              <p className="text-muted-foreground text-sm">
                30 days of unlimited access. No credit card. No strings attached.
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-primary" />
              <span>Trusted by 1,200+ traders</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-primary" />
              <span>$50M+ capital protected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-primary" />
              <span>99.9% uptime SLA</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-0">
          {/* Features Column */}
          <div className="p-8 md:p-10 border-r border-primary/10 bg-gradient-to-b from-primary/[0.02] to-transparent">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
              Your Pro Plan Includes
            </h3>

            <div className="space-y-4">
              {PRO_FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="group">
                    <div className="flex items-start gap-3 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon size={16} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-primary/10 space-y-2 text-xs text-muted-foreground">
              <p>✓ 5 EA License Keys</p>
              <p>✓ Priority Email Support</p>
              <p>✓ Full 30-Day Access</p>
            </div>
          </div>

          {/* Form Column */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            {submitted ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Claim Confirmed!</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Email <span className="font-semibold text-foreground">support@foldforge.app</span> with your name and we'll activate your free month instantly.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Join the elite traders who use FoldForge to validate strategies and protect capital.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-secondary/40 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm disabled:opacity-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-secondary/40 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm disabled:opacity-50"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11 mt-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Claim Your Free Month
                        <ArrowRight size={16} />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center pt-2 leading-relaxed">
                    No credit card required. Cancel anytime. We'll email you setup instructions.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
