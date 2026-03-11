import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Mail, Phone, MapPin, MessageSquare, BookOpen, Clock, ArrowRight } from "lucide-react";

export default function Support() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container max-w-5xl">
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-4">
              How Can We <span className="gold-text">Help</span>?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our support team is here to help you get the most out of FoldForge. Reach out anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Info */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl font-bold font-['Playfair_Display']">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Email Support</p>
                    <a href="mailto:support@foldforge.com" className="text-sm text-primary hover:underline">support@foldforge.com</a>
                    <p className="text-xs text-muted-foreground mt-1">We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Phone Support</p>
                    <a href="tel:+15052301932" className="text-sm text-primary hover:underline">(505) 230-1932</a>
                    <p className="text-xs text-muted-foreground mt-1">Monday - Friday, 9 AM - 5 PM MST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Mailing Address</p>
                    <p className="text-sm text-muted-foreground">Giddings Capital Management LLC</p>
                    <p className="text-sm text-muted-foreground">1209 Mountain Road Pl NE Ste N</p>
                    <p className="text-sm text-muted-foreground">Albuquerque, NM 87110 USA</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM MST</p>
                    <p className="text-sm text-muted-foreground">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-bold font-['Playfair_Display']">Submit a Support Ticket</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    For the fastest response, submit a ticket through your dashboard. Our team will review and respond within 24 hours.
                  </p>
                  {isAuthenticated ? (
                    <Link href="/dashboard">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <MessageSquare size={16} className="mr-2" /> Open Dashboard & Submit Ticket
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Sign In to Submit Ticket <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl font-bold font-['Playfair_Display']">Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check our comprehensive documentation for setup guides, API references, and troubleshooting tips.
                  </p>
                  <Link href="/docs">
                    <Button variant="outline" className="border-border">
                      <BookOpen size={16} className="mr-2" /> View Documentation
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-semibold text-foreground mb-3">Common Topics</h3>
                  <div className="space-y-2">
                    {[
                      "How to install the MT4/MT5 uploader EA",
                      "Activating your license key",
                      "Connecting broker data to the studio",
                      "Understanding stress test results",
                      "Subscription and billing questions",
                      "Refund requests",
                    ].map((topic, i) => (
                      <Link key={i} href="/docs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                        <ArrowRight size={12} className="shrink-0" />
                        {topic}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
