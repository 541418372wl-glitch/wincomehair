import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="pt-24">
      <div className="container-site section-gap max-w-3xl">
        <p className="section-label">Legal</p>
        <h1 className="text-display-lg text-navy mb-10">Privacy <span className="text-gold">Policy</span></h1>
        <div className="space-y-8 text-tan leading-relaxed text-base">
          <section>
            <h2 className="text-display-sm text-navy mb-3">1. What We Collect</h2>
            <p>When you submit an inquiry through our quote form or contact us via WhatsApp or email, we collect the information you provide: your name, company, email address, phone/WhatsApp number, and the details of your product inquiry (product type, quantity, material, message).</p>
          </section>
          <section>
            <h2 className="text-display-sm text-navy mb-3">2. How We Use Your Data</h2>
            <p>We use your information solely to respond to your inquiry, prepare quotes and design mockups, and provide customer service related to your request. We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </section>
          <section>
            <h2 className="text-display-sm text-navy mb-3">3. Storage & Processors</h2>
            <p>Inquiry data is stored in our secure cloud database (Supabase) and email notifications are processed through Resend. Analytics data (anonymous page views) is processed by Vercel Analytics. These providers act as data processors under our instructions.</p>
          </section>
          <section>
            <h2 className="text-display-sm text-navy mb-3">4. Data Retention</h2>
            <p>We retain inquiry records as long as needed to manage our business relationship with you. You may request deletion of your data at any time by contacting info@wincomehair.com.</p>
          </section>
          <section>
            <h2 className="text-display-sm text-navy mb-3">5. Your Rights</h2>
            <p>Depending on your jurisdiction (including GDPR for EEA/UK residents), you may have the right to access, correct, delete, or export your personal data, and to object to processing. To exercise any right, contact us at info@wincomehair.com.</p>
          </section>
          <section>
            <h2 className="text-display-sm text-navy mb-3">6. Contact</h2>
            <p>WINCOME Hair Accessories — Hangzhou Superwhale Technology Co., Ltd. Email: <a href="mailto:info@wincomehair.com" className="text-gold underline">info@wincomehair.com</a>. WhatsApp: +86 189 8984 6141.</p>
          </section>
          <p className="pt-4"><Link to="/terms" className="text-gold underline">View Terms of Service</Link></p>
        </div>
      </div>
    </div>
  );
}
