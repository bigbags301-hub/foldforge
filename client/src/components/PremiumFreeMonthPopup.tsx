import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Zap, Shield, Activity, Target, Gauge, Brain, BarChart3, Lock, TrendingUp, CheckCircle2, Mail, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PremiumFreeMonthPopupProps {
  onClose?: () => void;
}

export default function PremiumFreeMonthPopup({ onClose }: PremiumFreeMonthPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrollTriggered, setScrollTriggered] = useState(false);
  const scrollStartTimeRef = useRef<number>(0);

  const PREMIUM_FEATURES = [
    { icon: Zap, label: "Unlimited Studio Runs" },
    { icon: Shield, label: "20+ Stress Scenarios" },
    { icon: Activity, label: "Monte Carlo Engine" },
    { icon: Target, label: "Walk-Forward Analysis" },
    { icon: Gauge, label: "40+ Performance Metrics" },
    { icon: Brain, label: "AI Code Review" },
    { icon: BarChart3, label: "Advanced Analytics" },
    { icon: Lock, label: "Broker Data Sync" },
    { icon: TrendingUp, label: "White-Label Reports" },
  ];

  useEffect(() => {
    scrollStartTimeRef.current = Date.now();
    
    const handleScroll = () => {
      if (scrollTriggered || isVisible) return;

      const elapsedSeconds = (Date.now() - scrollStartTimeRef.current) / 1000;
      const hasScrolled = window.scrollY > 100;
      const isInTimeWindow = elapsedSeconds >= 5 && elapsedSeconds <= 10;

      if (hasScrolled && isInTimeWindow && !localStorage.getItem("premium_free_month_shown")) {
        setScrollTriggered(true);
        setIsVisible(true);
        localStorage.setItem("premium_free_month_shown", "true");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollTriggered, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please enter both name and email");
      return;
    }

    setLoading(true);
    try {
      // Submit to HubSpot via server API
      const res = await fetch("/api/leads/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          source: "premium_free_month_popup",
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Welcome! Check your email for next steps.");
        setTimeout(() => {
          handleClose();
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

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-background via-background to-primary/5 rounded-2xl border border-primary/20 shadow-2xl overflow-hidden animate-in scale-in duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Features */}
          <div className="p-8 md:p-10 bg-gradient-to-b from-primary/10 to-transparent border-r border-primary/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold font-['Playfair_Display']">
                  <span className="gold-text">Free Month</span>
                </h2>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Premium Access</p>
              </div>
            </div>

            <p className="text-sm text-foreground/90 mb-8 leading-relaxed">
              Get <span className="font-bold text-primary">full access to the Pro plan</span> for an entire month. No credit card required. Just email us to activate.
            </p>

            <div className="space-y-3">
              {PREMIUM_FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground/80">{feature.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-primary/10">
              <p className="text-xs text-muted-foreground leading-relaxed">
                ✓ Full Pro plan features for 30 days<br />
                ✓ No credit card needed<br />
                ✓ Cancel anytime
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            {submitted ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">You're All Set!</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We've received your request. Email <span className="font-semibold text-foreground">support@foldforge.app</span> to activate your free month of premium access.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Claim Your Free Month</h3>
                  <p className="text-sm text-muted-foreground">
                    New users only. Full Pro plan access for 30 days.
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
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm disabled:opacity-50"
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
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm disabled:opacity-50"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11 mt-2 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Claim Free Month
                        <ArrowRight size={16} />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center pt-2">
                    We'll send you setup instructions to <span className="font-semibold">support@foldforge.app</span>
                  </p>
                </form>

                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    <Mail size={12} className="inline mr-1" />
                    No credit card. No hidden fees. Cancel anytime.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
