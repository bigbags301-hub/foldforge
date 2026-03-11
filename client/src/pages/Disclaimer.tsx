import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold font-['Playfair_Display'] mb-2"><span className="gold-text">Risk Disclaimer</span></h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: March 5, 2026</p>
          <div className="prose prose-invert max-w-none space-y-6 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">General Risk Warning</h2>
              <p>Trading foreign exchange (forex), contracts for difference (CFDs), and other leveraged financial instruments involves a high level of risk and may not be suitable for all investors. You could sustain a loss of some or all of your invested capital. You should not invest money that you cannot afford to lose.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">No Financial Advice</h2>
              <p>FoldForge, operated by Giddings Capital Management LLC, is a software platform for EA testing and analysis. Nothing on this platform constitutes financial advice, investment advice, trading advice, or any other sort of advice. You should conduct your own research and consult with a qualified financial advisor before making any trading decisions.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Past Performance</h2>
              <p>Past performance of any trading system, methodology, or Expert Advisor is not necessarily indicative of future results. Backtested results are hypothetical and do not represent actual trading. There are numerous factors related to markets in general that cannot be fully accounted for in backtesting.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Expert Advisors</h2>
              <p>Expert Advisors (EAs) provided through or tested on the FoldForge platform are automated trading tools. While they are designed to follow specific trading rules, they cannot guarantee profits. Market conditions can change rapidly, and no EA can account for all possible scenarios. You are solely responsible for any trading decisions made using EAs.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Prop Firm Trading</h2>
              <p>If you use FoldForge tools in connection with proprietary trading firm (prop firm) evaluations or funded accounts, you acknowledge that: (a) prop firm rules and conditions vary; (b) FoldForge does not guarantee compliance with any specific prop firm's rules; (c) you are responsible for understanding and adhering to your prop firm's terms; (d) losses incurred during prop firm evaluations are your responsibility.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Leverage Risk</h2>
              <p>Trading with leverage amplifies both potential profits and potential losses. The high degree of leverage available in forex markets can work against you as well as for you. You should carefully consider your financial situation and risk tolerance before using leverage.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Limitation of Liability</h2>
              <p>Giddings Capital Management LLC, its officers, directors, employees, and agents shall not be liable for any losses, damages, or claims arising from: (a) your use of the Platform; (b) trading decisions made based on Platform data; (c) EA performance in live or demo trading; (d) broker data inaccuracies; (e) system downtime or technical failures.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Contact</h2>
              <p>For questions about this disclaimer, contact us at:</p>
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
