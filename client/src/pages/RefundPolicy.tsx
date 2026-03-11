import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold font-['Playfair_Display'] mb-2"><span className="gold-text">Refund Policy</span></h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 5, 2026</p>
          <div className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7-Day Free Trial</h2>
              <p>All FoldForge subscription plans include a 7-day free trial. During the trial period, you have full access to the features included in your selected plan. You will not be charged during the trial period. If you cancel before the trial ends, you will not be billed.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Refund Eligibility</h2>
              <p>If you are not satisfied with FoldForge, you may request a refund within 14 days of your first paid billing cycle. Refund requests must be submitted via email to <a href="mailto:billing@foldforge.com" className="text-primary hover:underline">billing@foldforge.com</a> with your account email and reason for the request.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Refund Process</h2>
              <p>Approved refunds will be processed within 5-10 business days and returned to the original payment method. Upon refund, your subscription will be immediately cancelled and all associated license keys will be deactivated.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Non-Refundable Items</h2>
              <p>The following are not eligible for refund: (a) subscriptions beyond the 14-day refund window; (b) partial month charges after cancellation; (c) accounts terminated for Terms of Service violations; (d) any custom integration or consulting services.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Cancellation</h2>
              <p>You may cancel your subscription at any time from your dashboard. Cancellation takes effect at the end of your current billing period. You will retain access to all features until the period ends. No prorated refunds are issued for partial billing periods.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Contact</h2>
              <p>For billing inquiries, contact us at:</p>
              <p className="mt-2">Giddings Capital Management LLC<br />1209 Mountain Road Pl NE Ste N<br />Albuquerque, NM 87110 USA</p>
              <p className="mt-2">Email: <a href="mailto:support@foldforge.com" className="text-primary hover:underline">support@foldforge.com</a></p>
              <p>Phone: <a href="tel:+15052301932" className="text-primary hover:underline">(505) 230-1932</a></p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
