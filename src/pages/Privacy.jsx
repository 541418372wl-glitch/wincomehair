import { Link } from 'react-router-dom';
import { openConsentPreferences } from '../lib/analytics';

export default function Privacy() {
  return (
    <div className="pt-24">
      <div className="container-site section-gap max-w-3xl">
        <p className="section-label">Legal</p>
        <h1 className="text-display-lg text-navy mb-4">Privacy <span className="text-gold">Policy</span></h1>
        <p className="mb-10 text-sm text-tan">Last updated: 12 August 2026</p>

        <div className="space-y-8 text-tan leading-relaxed text-base">
          <section>
            <h2 className="text-display-sm text-navy mb-3">1. Who Controls Your Data</h2>
            <p>Hangzhou Superwhale Technology Co., Ltd., trading as WINCOME Hair Accessories, is the controller of personal data collected through wincomehair.com. Privacy requests can be sent to <a href="mailto:info@wincomehair.com" className="text-gold underline">info@wincomehair.com</a>.</p>
          </section>

          <section>
            <h2 className="text-display-sm text-navy mb-3">2. Data We Collect</h2>
            <p>When you submit a quote request, we collect the information you provide, which may include your name, company, email address, phone or WhatsApp number, product requirements, quantity, material, target market, timeline, dimensions, and message. Our server also processes limited technical data needed for security and abuse prevention. Rate-limit records contain keyed hashes rather than raw IP addresses, email addresses, or inquiry text.</p>
            <p className="mt-3">If you choose to contact us through WhatsApp, your interaction takes place on WhatsApp and is also governed by WhatsApp/Meta&apos;s terms and privacy practices.</p>
          </section>

          <section>
            <h2 className="text-display-sm text-navy mb-3">3. Why We Use Data</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>To respond to your request, prepare a quote or design mockup, and take steps toward a possible business relationship.</li>
              <li>To operate, secure, troubleshoot, and prevent abuse of the inquiry service based on our legitimate interests.</li>
              <li>To measure site usage and inquiry conversions only when you consent to optional analytics.</li>
              <li>To comply with legal, accounting, or regulatory obligations where applicable.</li>
            </ul>
            <p className="mt-3">We do not sell your personal data or use inquiry details for unrelated third-party advertising.</p>
          </section>

          <section>
            <h2 className="text-display-sm text-navy mb-3">4. Analytics, Cookies & Consent</h2>
            <p>Google Analytics 4 is optional and does not load unless you select <strong>Accept analytics</strong>. If accepted, GA4 may collect pseudonymous usage information such as page views, inquiry conversion events, approximate location, referrer, browser/device information, and a client identifier. We do not send names, email addresses, phone numbers, company names, or inquiry messages to GA4.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-sand/40 text-left text-navy">
                    <th className="border border-bronze/10 p-3">Storage</th>
                    <th className="border border-bronze/10 p-3">Purpose</th>
                    <th className="border border-bronze/10 p-3">Typical duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-bronze/10 p-3"><code>_ga</code>, <code>_ga_*</code></td>
                    <td className="border border-bronze/10 p-3">Distinguish pseudonymous users and preserve session state after analytics consent.</td>
                    <td className="border border-bronze/10 p-3">Up to 2 years, subject to browser limits and GA settings.</td>
                  </tr>
                  <tr>
                    <td className="border border-bronze/10 p-3"><code>wincome_analytics_consent_v1</code></td>
                    <td className="border border-bronze/10 p-3">Local browser storage that remembers your accept/reject choice.</td>
                    <td className="border border-bronze/10 p-3">Until you clear site data or change your choice.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">Advertising storage, advertising user data, and ad personalization remain disabled in our tag configuration. You can withdraw or grant analytics consent at any time; withdrawal disables future analytics and attempts to remove existing GA cookies for this site.</p>
            <button type="button" onClick={openConsentPreferences} className="btn-outline mt-4 px-5 py-3 text-sm">Change Cookie Settings</button>
          </section>

          <section>
            <h2 className="text-display-sm text-navy mb-3">5. Service Providers & International Processing</h2>
            <p>We use Supabase for inquiry database hosting, Resend for email notifications, Vercel for site hosting and runtime logs, and—only after consent—Google Analytics for measurement. Google Fonts is requested from Google to display site typography, which may disclose standard connection data such as IP address and browser headers to Google. Providers may process data in countries outside your own under their contractual and legal transfer mechanisms.</p>
          </section>

          <section>
            <h2 className="text-display-sm text-navy mb-3">6. Retention & Security</h2>
            <p>Inquiry records are generally retained for up to 24 months after our last business interaction, unless a longer period is needed for an active order, legal claim, accounting requirement, or other legal obligation. Short-lived anti-abuse counters expire automatically. We use access controls, server-only database credentials, request-level logging, and other safeguards appropriate to the service; no internet service can guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-display-sm text-navy mb-3">7. Your Choices & Rights</h2>
            <p>Depending on your location, you may have rights to access, correct, delete, restrict, object to, or obtain a copy of your personal data, and to withdraw consent. Email <a href="mailto:info@wincomehair.com" className="text-gold underline">info@wincomehair.com</a> to make a request. You may also complain to your local data protection authority.</p>
          </section>

          <section>
            <h2 className="text-display-sm text-navy mb-3">8. Updates & Contact</h2>
            <p>We may update this policy when our services or legal obligations change and will post the revised date above. Contact: WINCOME Hair Accessories / Hangzhou Superwhale Technology Co., Ltd.; email <a href="mailto:info@wincomehair.com" className="text-gold underline">info@wincomehair.com</a>; WhatsApp +86 189 8984 6141.</p>
          </section>

          <p className="pt-4"><Link to="/terms" className="text-gold underline">View Terms of Service</Link></p>
        </div>
      </div>
    </div>
  );
}
