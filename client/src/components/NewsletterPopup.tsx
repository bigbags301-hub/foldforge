import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem("newsletter_popup_shown")) {
        setIsVisible(true);
        localStorage.setItem("newsletter_popup_shown", "true");
      }
    }, 15000); // Show after 15 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog_newsletter_popup" }),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => setIsVisible(false), 3000);
      }
    } catch (err) {
      console.error("Newsletter signup failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 w-full max-w-sm animate-in slide-in-from-left-4 duration-500">
      <div className="relative glass-card rounded-2xl p-6 border-primary/30 shadow-2xl bg-background/95 backdrop-blur-xl">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Join the Elite 10%</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Weekly Institutional Insights</p>
          </div>
        </div>
        
        {submitted ? (
          <div className="flex items-center gap-2 text-green-500 text-sm font-bold py-2">
            <CheckCircle2 size={18} /> Welcome to the fold!
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Get our weekly deep-dives on EA validation and prop firm risk management. No fluff, just math.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input 
                type="email" 
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-secondary/30 border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors text-xs"
              />
              <Button 
                type="submit" 
                disabled={loading}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              >
                {loading ? "..." : <ArrowRight size={16} />}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
