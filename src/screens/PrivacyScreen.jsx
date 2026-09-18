// src/screens/PrivacyScreen.jsx
// NOT LEGAL ADVICE — same disclaimer as the web version this was ported
// from (drafted with Nigeria's NDPA 2023 in mind). [PLACEHOLDER] fields
// need real legal-entity details, and a lawyer/compliance professional
// should confirm NDPC registration/filing obligations directly.
import LegalDocument from '../components/LegalDocument'

const SECTIONS = [
  { h: '1. Who This Covers', body: `This Privacy Policy explains how [LEGAL ENTITY NAME], operating [PLATFORM NAME] (we, us, our), collects, uses, and protects your personal data when you use our website and apps. We process personal data as a "Data Controller" under Nigeria's Data Protection Act 2023 (NDPA).` },
  { h: '2. What We Collect', body: `Account data: name, email, password (hashed, never stored in plain text). Payment data: handled directly by Paystack — we receive confirmation of successful payment and a reference ID, but never store your full card number. Usage data: what you watch, watch progress, engagement with games/quizzes/leaderboards, device/browser type, IP address. Content you create: captions, quote shares, quiz results, watch party activity. We do not collect more than we need for the Service to function.` },
  { h: '3. How We Use Your Data', body: `To provide and maintain the Service (streaming, resume-watching, recommendations); process subscriptions and payments via Paystack; personalize features like Recap and leaderboards; send service-related communications (billing, security, feature updates); detect fraud and enforce our Terms; and calculate real, non-fabricated figures for the Legacy Fund and Producer Royalty Pool based on actual watch-minutes.` },
  { h: '4. Legal Basis for Processing', body: `We process your data based on: performance of a contract (providing the Service you subscribed to); your consent (for optional features and marketing, which you can withdraw at any time); and our legitimate interests (fraud prevention, service improvement) balanced against your rights.` },
  { h: '5. Who We Share Data With', body: `Paystack (payment processing) — governed by Paystack's own privacy policy for payment data. Bunny.net (video hosting/CDN) — processes streaming requests to deliver video. Supabase (database/authentication infrastructure). We do not sell your personal data to advertisers or third parties. Aggregated, non-identifying watch data may be shared with producers/rights holders solely to calculate Producer Royalty Pool distributions — never your individual identity or viewing history tied to your name.` },
  { h: '6. Public-Facing Information', body: `Some features are inherently public: leaderboard rankings, quiz Challenge Mode scores, and shared captions/quote cards display your chosen display name. They never display your email address, payment information, or full watch history. You control your display name in Account settings.` },
  { h: '7. Data Retention', body: `We retain your account and usage data for as long as your account is active, plus a reasonable period after closure for legal, tax, and fraud-prevention purposes. You can request earlier deletion — see Section 9.` },
  { h: '8. Security', body: `We use industry-standard measures — encrypted connections, hashed passwords, row-level database access controls — to protect your data. No system is perfectly secure, but we take reasonable steps proportionate to the sensitivity of what we hold.` },
  { h: '9. Your Rights', body: `Under the NDPA, you have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data ("right to be forgotten"), subject to legal retention requirements; object to or restrict certain processing; and data portability. To exercise any of these, email [SUPPORT EMAIL]. We'll respond within the timeframe required by law.` },
  { h: '10. Cookies', body: `We use essential cookies to keep you logged in and remember your preferences (e.g. dismissed feature prompts). We do not use third-party advertising trackers.` },
  { h: '11. Children', body: `The Service is not directed at children under 13, and we do not knowingly collect their personal data. If we learn we've inadvertently collected data from a child under 13, we'll delete it.` },
  { h: '12. International Users', body: `If you access the Service from outside Nigeria (e.g. diaspora subscribers), your data is processed in Nigeria and may be transferred to service providers (Paystack, Bunny.net, Supabase) whose infrastructure may be located in other countries, with appropriate safeguards in place.` },
  { h: '13. Changes to This Policy', body: `We may update this Privacy Policy from time to time. Material changes will be communicated via the Service or email before they take effect.` },
  { h: '14. Contact & Complaints', body: `Questions or requests about your data: [SUPPORT EMAIL]. If you believe we've mishandled your data, you also have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC).` },
]

export default function PrivacyScreen({ navigation }) {
  return (
    <LegalDocument
      navigation={navigation}
      title="Privacy"
      goldWord="Policy"
      lastUpdatedNote="Last updated: [DATE] — draft pending legal review"
      sections={SECTIONS}
    />
  )
}
