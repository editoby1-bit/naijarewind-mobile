// src/screens/TermsScreen.jsx
// NOT LEGAL ADVICE — same disclaimer as the web version this was ported
// from. [PLACEHOLDER] fields need real legal-entity details, and a lawyer
// should review before this is treated as final.
import LegalDocument from '../components/LegalDocument'

const SECTIONS = [
  { h: '1. Who We Are', body: `[PLATFORM NAME] ("we", "us", "our") is a subscription video streaming service operated by [LEGAL ENTITY NAME], a company registered in Nigeria under RC [REGISTRATION NUMBER], with its registered office at [REGISTERED ADDRESS]. These Terms of Service govern your access to and use of the [PLATFORM NAME] website, apps, and related services (together, the "Service").` },
  { h: '2. Acceptance of Terms', body: `By creating an account, subscribing, or otherwise using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the Service. We may update these Terms from time to time; continued use after changes take effect means you accept the revised Terms.` },
  { h: '3. Eligibility', body: `You must be at least 18 years old, or the age of majority in your jurisdiction, to create an account and subscribe. The Service is not directed at children, and we do not knowingly collect personal data from anyone under 13.` },
  { h: '4. Your Account', body: `You're responsible for keeping your login credentials confidential and for all activity under your account. Notify us immediately at [SUPPORT EMAIL] if you suspect unauthorized use. We may suspend or terminate accounts that violate these Terms, share credentials beyond your subscription's device limits, or are used fraudulently.` },
  { h: '5. Subscriptions, Billing & Cancellation', body: `Subscriptions are billed in advance on a recurring basis (monthly, unless stated otherwise) via Paystack. By subscribing, you authorize us to charge your chosen payment method each billing cycle until you cancel. You can cancel anytime from your Account page; cancellation takes effect at the end of your current billing period, and you retain access until then. Except where required by Nigerian consumer protection law or explicitly stated otherwise, payments are non-refundable once a billing cycle has started. Promo codes and discounts are subject to their own stated terms and may not be combined unless explicitly permitted.` },
  { h: '6. Content & Intellectual Property', body: `All films, images, trademarks, and other content made available through the Service are owned by us or licensed to us by the relevant rights holders (producers, distributors, and the actors/estates we've partnered with) and are protected by copyright and other intellectual property laws. Your subscription grants you a limited, non-exclusive, non-transferable license to stream content for personal, non-commercial viewing. You may not download (except where an "offline" feature is explicitly provided), redistribute, publicly perform, sell, or otherwise exploit content outside the Service.` },
  { h: '7. User-Generated & Interactive Features', body: `Certain features (Caption This Scene, Quote sharing, quiz/trivia results, leaderboard display names, watch parties, and similar) let you create or share content, or display a public name/score to other users. You retain ownership of anything original you create, but grant us a license to display it within the Service. Don't submit anything unlawful, harassing, or infringing. We may remove user-generated content at our discretion. Leaderboards and public profiles show your display name only — never your email or payment details.` },
  { h: '8. Legacy Fund & Producer Royalty Pool', body: `[PLATFORM NAME] operates a Legacy Fund, directing a share of subscription revenue toward the welfare of veteran Nigerian actors, and a Producer Royalty Pool, distributing a share of revenue to rights holders based on real watch-minutes. Details of how these programs work, and any figures we report about them, reflect real, verified data — we do not publish estimated or fabricated figures. Participation, eligibility, and payout mechanics for actors and producers are governed by separate agreements with those parties, not by these Terms.` },
  { h: '9. Acceptable Use', body: `You agree not to: circumvent DRM or geographic/device restrictions; scrape, reverse-engineer, or automate access to the Service; use the Service to infringe others' rights; upload malicious code; or use another person's account without permission.` },
  { h: '10. Termination', body: `We may suspend or terminate your access to the Service, with or without notice, for violation of these Terms, non-payment, or suspected fraudulent or abusive activity. You may stop using the Service and cancel your subscription at any time.` },
  { h: '11. Disclaimers & Limitation of Liability', body: `The Service is provided "as is" without warranties of any kind, express or implied. We do not guarantee uninterrupted or error-free service. To the fullest extent permitted by Nigerian law, [LEGAL ENTITY NAME] will not be liable for indirect, incidental, or consequential damages arising from your use of the Service.` },
  { h: '12. Governing Law', body: `These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes will be subject to the exclusive jurisdiction of the courts of [STATE/JURISDICTION].` },
  { h: '13. Contact', body: `Questions about these Terms? Reach us at [SUPPORT EMAIL].` },
]

export default function TermsScreen({ navigation }) {
  return (
    <LegalDocument
      navigation={navigation}
      title="Terms of"
      goldWord="Service"
      lastUpdatedNote="Last updated: [DATE] — draft pending legal review"
      sections={SECTIONS}
    />
  )
}
