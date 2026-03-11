import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold font-['Playfair_Display'] mb-2"><span className="gold-text">Privacy Policy</span></h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 5, 2026</p>
          <div className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly: name, email address, and payment information when you create an account or subscribe. We also collect usage data including IP addresses, browser type, pages visited, and feature usage through standard analytics tools.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. Trading Data</h2>
              <p>When you use the broker data sync feature, our uploader EA transmits symbol specifications, spread samples, and OHLC price history from your MetaTrader platform to our servers. We do not collect your broker login credentials, account passwords, or personal financial information. Your trading data is stored securely and is only accessible to your account.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <p>We use your information to: (a) provide and maintain the Platform; (b) process payments and manage subscriptions; (c) send service-related communications; (d) improve the Platform and develop new features; (e) comply with legal obligations. We do not sell your personal information to third parties.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. Data Storage and Security</h2>
              <p>Your data is stored on secure servers with encryption at rest and in transit. We implement industry-standard security measures including TLS encryption, access controls, and regular security audits. However, no method of transmission over the Internet is 100% secure.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. Third-Party Services</h2>
              <p>We use the following third-party services: Stripe for payment processing, analytics services for usage tracking, and cloud hosting providers for infrastructure. Each third-party service has its own privacy policy governing their use of your data.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. Data Retention</h2>
              <p>We retain your account data for as long as your account is active. Upon account deletion, we will delete your personal data within 30 days, except where we are required by law to retain certain information. Anonymized usage data may be retained indefinitely for analytics purposes.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Your Rights</h2>
              <p>You have the right to: (a) access your personal data; (b) correct inaccurate data; (c) request deletion of your data; (d) export your data in a portable format; (e) opt out of marketing communications. To exercise these rights, contact us at <a href="mailto:privacy@foldforge.com" className="text-primary hover:underline">privacy@foldforge.com</a>.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">8. Contact</h2>
              <p>For privacy-related inquiries, contact us at:</p>
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
