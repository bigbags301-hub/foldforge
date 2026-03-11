import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold font-['Playfair_Display'] mb-2"><span className="gold-text">Terms of Service</span></h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 5, 2026</p>
          <div className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Agreement to Terms</h2>
              <p>By accessing or using FoldForge ("the Platform"), operated by Giddings Capital Management LLC ("the Company"), a limited liability company registered in the State of New Mexico, United States, you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. Description of Service</h2>
              <p>FoldForge provides a software-as-a-service platform for Expert Advisor (EA) testing, broker data synchronization, risk management tools, and related trading analytics for MetaTrader 4 and MetaTrader 5 platforms. The Platform is a tool for analysis and testing only and does not provide financial advice, investment recommendations, or trading signals.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. Account Registration</h2>
              <p>You must create an account to access certain features. You agree to provide accurate, current, and complete information during registration and to keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. Subscription and Billing</h2>
              <p>FoldForge offers subscription plans billed on a monthly basis. By subscribing, you authorize the Company to charge your payment method on a recurring basis. You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period. Prices are subject to change with 30 days' notice.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. License Keys</h2>
              <p>License keys issued through the Platform are non-transferable and bound to your account. Each license key has a maximum number of activations as determined by your subscription plan. Sharing, reselling, or distributing license keys is strictly prohibited and may result in immediate revocation.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. Acceptable Use</h2>
              <p>You agree not to: (a) reverse engineer, decompile, or disassemble any part of the Platform; (b) use the Platform for any unlawful purpose; (c) attempt to gain unauthorized access to any systems or networks; (d) interfere with or disrupt the Platform's operation; (e) share your account with third parties; (f) use automated tools to scrape or extract data from the Platform.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Intellectual Property</h2>
              <p>All content, software, algorithms, designs, and trademarks on the Platform are the property of Giddings Capital Management LLC. The Aureus Prime EA and all associated code are proprietary and protected by copyright law. You are granted a limited, non-exclusive license to use the software solely for personal trading purposes.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">8. Disclaimer of Warranties</h2>
              <p>THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. THE COMPANY DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT ANY DEFECTS WILL BE CORRECTED. TRADING RESULTS MAY VARY AND PAST PERFORMANCE IS NOT INDICATIVE OF FUTURE RESULTS.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, GIDDINGS CAPITAL MANAGEMENT LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR TRADING LOSSES, ARISING OUT OF YOUR USE OF THE PLATFORM.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">10. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the State of New Mexico, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts of the State of New Mexico.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">11. Contact</h2>
              <p>For questions about these Terms, contact us at:</p>
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
