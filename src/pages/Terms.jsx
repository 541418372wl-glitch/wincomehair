import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="pt-24">
      <div className="container-site section-gap max-w-3xl">
        <p className="section-label">Legal</p>
        <h1 className="text-[34px] leading-[1.1] sm:text-display-lg text-navy mb-10">Terms of <span className="text-gold">Service</span></h1>
        <div className="space-y-8 text-tan leading-relaxed text-base">
          <section>
            <h2 className="text-display-sm text-navy mb-3">1. Quotes & Orders</h2>
            <p>All quotes provided by WINCOME Hair Accessories are indicative and valid for 30 days unless stated otherwise. Final pricing, MOQ, lead time and specifications are confirmed in writing before production begins. Quoted prices are in USD, EXW (Hangzhou, China) unless otherwise agreed.</p>
          </section>
          <section>
            <h2 className="text-display-sm text-navy mb-3">2. Samples & Tooling</h2>
            <p>Sample fees, where applicable, are typically credited against your first production order. Tooling (mold) costs are quoted separately and remain the property of WINCOME unless a tooling buyout is agreed in writing.</p>
          </section>
          <section>
            <h2 className="text-display-sm text-navy mb-3">3. Intellectual Property</h2>
            <p>Custom designs, logos and artwork provided by clients are used solely to manufacture the client's products and are not reproduced for other customers. WINCOME's catalog designs, website content and branding may not be reproduced without permission.</p>
          </section>
          <section>
            <h2 className="text-display-sm text-navy mb-3">4. Quality & Claims</h2>
            <p>Products are manufactured to the quality standards agreed in the order confirmation and subject to our documented QC process. Claims must be raised within 30 days of receipt with supporting evidence (photos/video).</p>
          </section>
          <section>
            <h2 className="text-display-sm text-navy mb-3">5. Liability</h2>
            <p>To the maximum extent permitted by law, WINCOME's total liability under any order is limited to the value of the affected goods.</p>
          </section>
          <section>
            <h2 className="text-display-sm text-navy mb-3">6. Governing Law</h2>
            <p>These terms are governed by the laws of the People's Republic of China. Disputes are subject to the jurisdiction of the courts of Hangzhou, China.</p>
          </section>
          <p className="pt-4"><Link to="/privacy" className="text-gold underline">View Privacy Policy</Link></p>
        </div>
      </div>
    </div>
  );
}
