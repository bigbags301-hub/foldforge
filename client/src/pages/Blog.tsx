import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";

const posts = [
  {
    slug: "why-90-percent-of-funded-accounts-fail",
    title: "Why 90% of Funded Accounts Fail (And How to Be the 10%)",
    excerpt: "The prop firm industry is booming, yet over 90% of traders fail their challenges. Discover the three primary reasons funded accounts are blown and the exact framework the top 10% use to stay funded.",
    date: "March 21, 2026",
    author: "FoldForge Editorial",
    category: "Prop Firm",
    image: "https://images.unsplash.com/photo-1611974717484-7da8c1746b62?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "your-backtests-are-lying-the-broker-data-gap",
    title: "Your Backtests are Lying: The Broker Data Gap",
    excerpt: "Why '99% modeling quality' isn't enough anymore. Learn why your backtests don't match live results and how to sync real broker data for accurate validation.",
    date: "March 18, 2026",
    author: "FoldForge Editorial",
    category: "Data Sync",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "the-ultimate-ea-validation-checklist-for-2026",
    title: "The Ultimate EA Validation Checklist for 2026",
    excerpt: "5 tests every Expert Advisor must pass before you risk a single dollar. From Monte Carlo simulations to Walk-Forward analysis, here is your validation roadmap.",
    date: "March 15, 2026",
    author: "FoldForge Editorial",
    category: "EA Testing",
    image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&q=80&w=800",
  }
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold font-['Playfair_Display'] mb-6">
              The <span className="gold-text">FoldForge</span> Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Institutional-grade insights on EA testing, risk management, and prop firm trading.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.slug} className="bg-card border-border overflow-hidden hover:border-primary/30 transition-all group">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Tag size={12} className="text-primary" /> {post.category}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="link" className="p-0 h-auto text-primary font-semibold group/btn">
                      Read More <ArrowRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-20 glass-card rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto border-primary/20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Get the Edge in Your Inbox</h2>
            <p className="text-muted-foreground mb-8">Join 1,200+ serious traders receiving our weekly deep dives into EA validation and risk management.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
