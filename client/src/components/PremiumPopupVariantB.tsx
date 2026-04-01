import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Zap, Shield, Activity, Target, Gauge, Brain, BarChart3, Lock, TrendingUp, CheckCircle2, ArrowRight, Loader2, Flame, Award } from "lucide-react";
import { toast } from "sonner";

interface VariantBProps {
  onClose: () => void;
}

/**
 * Variant B: Bold Visual Design with Feature Carousel
 * Focus: Excitement, urgency, and dynamic feature showcase
 * Layout: Horizontal split with animated feature highlights
 */
export default function PremiumPopupVariantB({ onClose }: VariantBProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);

  const PRO_FEATURES = [
    { icon: Zap, title: "Unlimited Studio Runs", value: "∞", color: "text-yellow-400" },
    { icon: Shield, title: "Full Broker Data Sync", value: "MT4/MT5", color: "text-blue-400" },
    { icon: Activity, title: "Monte Carlo Engine", value: "1000+", color: "text-purple-400" },
    { icon: Target, title: "Walk-Forward Analysis", value: "Real-time", color: "text-green-400" },
    { icon: Gauge, title: "Advanced Analytics", value: "40+ Metrics", color: "text-orange-400" },
    { icon: Brain, title: "Account Guardian", value: "24/7 Protection", color: "text-pink-400" },
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
          source: "premium_free_month_popup_variant_b",
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
      <div className="relative w-full max-w-3xl bg-background rounded-2xl border border-primary/20 shadow-2xl overflow-hidden animate-in scale-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Left: Feature Showcase */}
          <div className="p-8 md:p-10 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <Flame size={24} className="text-primary animate-pulse" />
                <h2 className="text-2xl font-bold font-['Playfair_Display']">
                  <span className="gold-text">Pro Plan</span>
                </h2>
              </div>

              {/* Feature Carousel */}
              <div className="space-y-6 min-h-[320px]">
                {PRO_FEATURES.map((feature, idx) => {
                  const Icon = feature.icon;
                  const isActive = idx === activeFeatureIdx;

                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveFeatureIdx(idx)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                        isActive
                          ? "bg-primary/20 border border-primary/40 shadow-lg shadow-primary/10"
                          : "bg-secondary/30 border border-border/30 hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 ${isActive ? feature.color : "text-primary"}`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-foreground">{feature.title}</p>
                          <p className={`text-xs font-semibold ${isActive ? feature.color : "text-muted-foreground"}`}>
                            {feature.value}
                          </p>
                        </div>
                      </div>
                      {isActive && (
                        <div className="text-xs text-muted-foreground pl-13 animate-in fade-in slide-in-from-left-2 duration-300">
                          Included in your free month
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-primary/10 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-primary">1,200+</p>
                  <p className="text-xs text-muted-foreground">Active Traders</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-primary">$50M+</p>
                  <p className="text-xs text-muted-foreground">Capital Protected</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-primary">99.9%</p>
                  <p className="text-xs text-muted-foreground">Uptime SLA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="p-8 md:p-10 flex flex-col justify-center bg-gradient-to-b from-background to-primary/[0.02]">
            {submitted ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">You're In!</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Email <span className="font-semibold text-foreground">support@foldforge.app</span> and we'll activate your free month instantly.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-3">
                    Get <span className="gold-text">30 Days Free</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Full Pro access. No credit card. New users only.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Alex Morgan"
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
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 mt-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-base"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Unlock Free Month
                        <ArrowRight size={16} />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center pt-3 leading-relaxed">
                    ✓ No credit card ✓ Cancel anytime ✓ Instant activation
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
