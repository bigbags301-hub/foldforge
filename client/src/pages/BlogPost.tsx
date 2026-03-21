import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link, useRoute } from "wouter";
import { Calendar, User, ArrowLeft, Tag, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const posts = {
  "why-90-percent-of-funded-accounts-fail": {
    title: "Why 90% of Funded Accounts Fail (And How to Be the 10%)",
    date: "March 21, 2026",
    author: "FoldForge Editorial",
    category: "Prop Firm",
    image: "https://images.unsplash.com/photo-1611974717484-7da8c1746b62?auto=format&fit=crop&q=80&w=1200",
    content: `
      <p class="text-lg leading-relaxed mb-6">The prop firm industry is booming. In 2026, there are more $100K, $200K, and even $1M funded accounts available than ever before. Yet, the statistics remain brutal: <strong>over 90% of traders fail their challenges, and of those who pass, less than 5% keep their accounts for more than three months.</strong></p>
      
      <p class="mb-6">Why? It’s not just "bad luck" or "market manipulation." It’s a fundamental failure in <strong>risk management and strategy validation.</strong></p>
      
      <h2 class="text-2xl font-bold mb-4 gold-text">1. The "Modeling Quality" Trap</h2>
      <p class="mb-6">Most traders develop their Expert Advisors (EAs) using generic historical data. They see a "99% modeling quality" backtest and assume they’ve found the Holy Grail.</p>
      <p class="mb-6"><strong>The Reality:</strong> Your broker has different spreads, different swaps, and different slippage than the generic data used in your backtest. A strategy that looks like a vertical line on a backtest can become a slow bleed on a live funded account.</p>
      <p class="mb-8"><strong>The Solution:</strong> You must sync your <strong>actual broker data</strong> into your testing environment. FoldForge’s Broker Data Pipeline allows you to pull real symbol specs and OHLC history directly from your MT4/MT5 platform, ensuring your tests match reality.</p>
      
      <h2 class="text-2xl font-bold mb-4 gold-text">2. Ignoring the "Black Swan" (Monte Carlo Analysis)</h2>
      <p class="mb-6">A backtest shows you what <em>did</em> happen. It doesn’t show you what <em>could</em> have happened. If your strategy relies on a specific sequence of trades to stay above water, you’re gambling, not trading.</p>
      <p class="mb-6"><strong>The Reality:</strong> Market conditions change. Volatility spikes. Spreads widen. If your strategy can’t survive a randomized "stress test," it will eventually hit a sequence of losses that triggers your prop firm’s daily drawdown limit.</p>
      <p class="mb-8"><strong>The Solution:</strong> Run <strong>Monte Carlo simulations</strong>. By randomizing trade sequences and skipping trades, you can see the true statistical probability of hitting a 5% drawdown. If your "Ruination Probability" is higher than 1%, you shouldn't be trading that EA on a funded account.</p>
      
      <h2 class="text-2xl font-bold mb-4 gold-text">3. The Emotional "Revenge Trade"</h2>
      <p class="mb-6">Even with a great EA, human emotion often interferes. A trader sees a drawdown approaching the limit and manually intervenes, or worse, increases lot sizes to "make it back quickly."</p>
      <p class="mb-6"><strong>The Reality:</strong> Prop firms have strict, automated rules. One violation and your account is gone. There is no "oops" or "I'll do better next time."</p>
      <p class="mb-8"><strong>The Solution:</strong> Use an automated <strong>Funded Account Guardian</strong>. A professional risk management tool should monitor your equity in real-time and enforce your drawdown limits at the server level, removing the possibility of emotional errors.</p>
      
      <h2 class="text-2xl font-bold mb-4 gold-text">The 10% Framework</h2>
      <p class="mb-4">If you want to join the elite group of consistently funded traders, your workflow should look like this:</p>
      <ul class="list-disc pl-6 mb-8 space-y-2">
        <li><strong>Validate with Real Data:</strong> Never trust a backtest that doesn't use your broker's exact specs.</li>
        <li><strong>Stress Test Everything:</strong> Use Monte Carlo and Walk-Forward analysis to find the breaking point of your strategy.</li>
        <li><strong>Automate Your Discipline:</strong> Use a tool like the <strong>FoldForge Prop Firm Guardian</strong> to enforce your rules without exception.</li>
      </ul>
      
      <p class="text-xl font-bold mb-8">Stop guessing. Start stress testing.</p>
    `
  }
};

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:slug");
  const post = posts[params?.slug as keyof typeof posts];

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog">
            <Button variant="link" className="text-primary">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container max-w-4xl">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-8 text-muted-foreground hover:text-primary group">
              <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Blog
            </Button>
          </Link>

          <div className="mb-10">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                <Tag size={12} /> {post.category}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-['Playfair_Display'] leading-tight mb-8">
              {post.title}
            </h1>
            <div className="aspect-video rounded-2xl overflow-hidden border border-border mb-10">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-12">
            <div className="prose prose-invert prose-primary max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <div className="lg:w-64 space-y-8">
              <div className="sticky top-32">
                <div className="p-6 glass-card rounded-xl border-primary/20 mb-8">
                  <h3 className="font-bold mb-4">Share this post</h3>
                  <div className="flex gap-3">
                    <Button variant="outline" size="icon" className="rounded-full border-border hover:text-primary"><Twitter size={18} /></Button>
                    <Button variant="outline" size="icon" className="rounded-full border-border hover:text-primary"><Linkedin size={18} /></Button>
                    <Button variant="outline" size="icon" className="rounded-full border-border hover:text-primary"><Facebook size={18} /></Button>
                    <Button variant="outline" size="icon" className="rounded-full border-border hover:text-primary"><Share2 size={18} /></Button>
                  </div>
                </div>

                <Card className="bg-primary/5 border-primary/20 overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">Protect Your Funded Account</h3>
                    <p className="text-sm text-muted-foreground mb-6">Join 1,200+ traders using FoldForge to validate their edge and safeguard their capital.</p>
                    <Link href="/signup">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">Get Started Free</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
