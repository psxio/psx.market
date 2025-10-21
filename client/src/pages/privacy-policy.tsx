import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function PrivacyPolicy() {
  const headerSection = useScrollReveal();
  const contentSection = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
        <div ref={headerSection.ref as any} className={headerSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last Updated: October 21, 2025
          </p>
        </div>

        <div ref={contentSection.ref as any} className={`space-y-6 ${contentSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Create.psx ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our Web3 marketplace platform.
              </p>
              <p>
                This policy complies with GDPR (General Data Protection Regulation), CCPA (California Consumer Privacy Act), 
                and other applicable privacy laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Wallet Information:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Public wallet addresses (Base blockchain)</li>
                <li>$CREATE and $PSX token balances and transaction history</li>
                <li>USDC payment transactions</li>
                <li>Connected wallet provider information</li>
              </ul>
              
              <p className="mt-4">
                <strong>Account Information:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Username, display name, and profile information</li>
                <li>Email address (optional for notifications)</li>
                <li>Builder portfolio, skills, and service listings</li>
                <li>Client company information (optional)</li>
              </ul>

              <p className="mt-4">
                <strong>Transaction Data:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Order history and service bookings</li>
                <li>Payment amounts and milestone tracking</li>
                <li>Messages between clients and builders</li>
                <li>Reviews, ratings, and dispute records</li>
              </ul>

              <p className="mt-4">
                <strong>Technical Data:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address and browser information</li>
                <li>Device type and operating system</li>
                <li>Usage patterns and analytics</li>
                <li>Cookies and local storage data</li>
              </ul>

              <p className="mt-4">
                <strong>Uploaded Content:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Portfolio images and project media</li>
                <li>Service deliverables and documents</li>
                <li>Message attachments</li>
                <li>Profile and cover images</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>We use collected information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Provide Platform Services:</strong> Enable marketplace functionality, process transactions, and facilitate client-builder interactions</li>
                <li><strong>Token Verification:</strong> Verify $CREATE and $PSX token holdings for access control and tier assignment</li>
                <li><strong>Payment Processing:</strong> Facilitate USDC payments through smart contract escrow</li>
                <li><strong>Communication:</strong> Send notifications about orders, messages, payments, and platform updates</li>
                <li><strong>Security:</strong> Detect fraud, prevent abuse, and protect user accounts</li>
                <li><strong>Analytics:</strong> Improve platform performance, user experience, and feature development</li>
                <li><strong>Legal Compliance:</strong> Comply with legal obligations and enforce our Terms of Service</li>
                <li><strong>Marketing:</strong> Send promotional emails (with your consent, opt-out available)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Information Sharing and Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Public Information:</strong> Builder profiles, services, reviews, and portfolio work are publicly visible 
                on the platform. Wallet addresses may be visible in blockchain transactions.
              </p>
              <p>
                <strong>Between Users:</strong> We share necessary information between clients and builders to facilitate transactions 
                (e.g., project requirements, deliverables, communication).
              </p>
              <p>
                <strong>Service Providers:</strong> We may share data with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cloud storage providers (Replit Object Storage / Google Cloud Storage)</li>
                <li>Email service providers (for notifications)</li>
                <li>Analytics services</li>
                <li>Payment processors and blockchain infrastructure</li>
              </ul>
              <p>
                <strong>Legal Requirements:</strong> We may disclose information when required by law, court order, or government 
                request, or to protect our rights and safety.
              </p>
              <p>
                <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale, user data may be transferred 
                to the acquiring entity.
              </p>
              <p>
                <strong>We Do Not Sell Your Data:</strong> We do not sell personal information to third parties for marketing purposes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Blockchain and Web3 Considerations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Public Blockchain Data:</strong> Transactions on the Base blockchain are public and permanent. 
                Your wallet address and transaction history are publicly visible on blockchain explorers.
              </p>
              <p>
                <strong>Smart Contracts:</strong> Payment escrow uses smart contracts. Once deployed, smart contract code and 
                transactions cannot be altered or deleted.
              </p>
              <p>
                <strong>Wallet Responsibility:</strong> You are solely responsible for your wallet security. We cannot recover 
                lost private keys or reverse unauthorized transactions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Data Storage and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Storage Location:</strong> Data is stored on Replit infrastructure and cloud services (including Google Cloud Storage 
                for file uploads). Blockchain data exists on the Base network.
              </p>
              <p>
                <strong>Security Measures:</strong> We implement industry-standard security including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure session management</li>
                <li>Database access controls</li>
                <li>Regular security audits</li>
              </ul>
              <p>
                <strong>Data Retention:</strong> We retain data as long as your account is active or as needed to provide services. 
                Blockchain transactions are permanent and cannot be deleted.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>GDPR Rights (EU Users):</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> Correct inaccurate information</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data (subject to legal and blockchain limitations)</li>
                <li><strong>Right to Restriction:</strong> Limit how we process your data</li>
                <li><strong>Right to Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Right to Object:</strong> Object to processing for marketing purposes</li>
              </ul>

              <p className="mt-4">
                <strong>CCPA Rights (California Users):</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Right to know what personal information is collected</li>
                <li>Right to delete personal information (subject to limitations)</li>
                <li>Right to opt-out of sale (we don't sell data)</li>
                <li>Right to non-discrimination for exercising privacy rights</li>
              </ul>

              <p className="mt-4">
                <strong>Exercising Rights:</strong> Contact us at privacy@create.psx to exercise your rights. 
                We will respond within 30 days.
              </p>

              <p className="mt-4">
                <strong>Limitations:</strong> Some data cannot be deleted due to blockchain immutability, legal requirements, 
                or legitimate business interests (e.g., dispute resolution, fraud prevention).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We use cookies and similar technologies for authentication, preferences, analytics, and functionality. 
                See our <a href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</a> for details.
              </p>
              <p>
                You can control cookies through browser settings, but disabling them may affect platform functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                create.psx is not intended for users under 18. We do not knowingly collect information from children. 
                If you believe a child has provided us with personal data, contact us immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Your data may be transferred to and processed in countries outside your residence. We ensure adequate 
                safeguards are in place for international transfers in compliance with applicable laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Changes to Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Privacy Policy periodically. Material changes will be announced on the platform. 
                Continued use after changes indicates acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                For privacy-related questions, data requests, or concerns:
              </p>
              <p className="font-semibold">
                Email: privacy@create.psx<br />
                Platform: create.psx<br />
                Data Protection Officer: dpo@create.psx
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
