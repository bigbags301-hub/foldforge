import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, ArrowRight, Key, Download, BarChart3 } from "lucide-react";

export default function Success() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container max-w-2xl text-center">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-primary" />
            </div>
            <h1 className="text-4xl font-bold font-['Playfair_Display'] mb-4">
              <span className="gold-text">Welcome to FoldForge!</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Your subscription is now active. Your license key has been automatically generated and is ready to use.
            </p>
          </div>

          <div className="glass-card rounded-xl p-8 mb-8 text-left">
            <h2 className="text-lg font-semibold mb-4">Next Steps</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Key size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">1. Get Your License Key</p>
                  <p className="text-sm text-muted-foreground">Go to your Dashboard to find your license key. You'll need it to activate the EA.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Download size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">2. Download the EA</p>
                  <p className="text-sm text-muted-foreground">Download Aureus Prime EA and the Data Pulling EA from the Downloads section.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">3. Start Testing</p>
                  <p className="text-sm text-muted-foreground">Head to the Studio to run your first backtest, Monte Carlo simulation, or stress test.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                Go to Dashboard <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/studio">
              <Button variant="outline" size="lg" className="px-8 border-border">
                Open Studio
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
