import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Zap } from "lucide-react";

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Link href="/pricing">
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/40 font-bold gap-2 h-12 px-6 rounded-full border border-primary/20"
        >
          <Zap size={16} className="fill-primary-foreground" />
          Start Free Trial <ArrowRight size={16} />
        </Button>
      </Link>
    </div>
  );
}
