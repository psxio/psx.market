import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function TermsOfService() {
  const headerSection = useScrollReveal();
  const contentSection = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
        <div ref={headerSection.ref as any} className={headerSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last Updated: October 21, 2025
          </p>
        </div>

        <div ref={contentSection.ref as any} className={`space-y-6 ${contentSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                By accessing and using Create.psx (the "Platform"), you accept and agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, please do not use our Platform.
              </p>
              <p>
                Create.psx is an open Web3 marketplace connecting premium builders with clients in the cryptocurrency and memecoin space. 
                Token holders ($CREATE or $PSX) receive exclusive benefits including reduced platform fees and priority support.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Token Holder Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Token Benefits:</strong> Holding either $CREATE or $PSX tokens in your connected Base blockchain wallet provides exclusive benefits including reduced platform fees (1% vs 2.5% standard), priority support, and verified badges. Users only need to hold ONE of these tokens to receive benefits. Benefit structures may change at the platform's discretion.
              </p>
              <p>
                <strong>Wallet Connection:</strong> You must connect a compatible Web3 wallet (Base network) to access platform features. 
                You are solely responsible for maintaining the security of your wallet and private keys.
              </p>
              <p>
                <strong>Network Requirements:</strong> All transactions occur on the Base blockchain (mainnet or Sepolia testnet for testing). 
                You are responsible for any network fees associated with blockchain transactions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Roles and Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Builders:</strong> Service providers who list their offerings on the platform must:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Complete the builder application process and receive approval</li>
                <li>Provide accurate information about their services, skills, and portfolio</li>
                <li>Deliver services as described and within agreed timelines</li>
                <li>Maintain professional communication with clients</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
              <p className="mt-4">
                <strong>Clients:</strong> Users who book services must:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Connect a wallet to book services (token holdings optional but provide benefits)</li>
                <li>Provide clear project requirements and expectations</li>
                <li>Release milestone payments when deliverables are satisfactory</li>
                <li>Communicate professionally and respectfully</li>
                <li>Use the platform's dispute resolution process if issues arise</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Payment Method:</strong> All payments are made in USDC (USD Coin) on the Base blockchain using smart contract-based escrow.
              </p>
              <p>
                <strong>Escrow System:</strong> Payments are held in smart contract escrow and released based on milestone completion. 
                The platform cannot reverse blockchain transactions once executed.
              </p>
              <p>
                <strong>Platform Fees:</strong> create.psx charges a service fee on completed transactions. Current fee structure:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Standard platform fee: 2.5% of transaction value</li>
                <li>Token holder discounted fee: 1% of transaction value (60% savings for $CREATE or $PSX holders)</li>
                <li>Fees may vary based on client tier or promotional programs</li>
                <li>Fees are subject to change with 30 days notice</li>
              </ul>
              <p>
                <strong>Refunds:</strong> Refunds are processed through the platform's dispute resolution system. Blockchain transactions 
                cannot be reversed; refunds require builder cooperation or dispute arbitration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Platform IP:</strong> The Create.psx platform, including its code, design, branding, and content, is owned by 
                Create.psx and protected by intellectual property laws.
              </p>
              <p>
                <strong>User Content:</strong> Builders retain ownership of their portfolio work, service descriptions, and deliverables. 
                By posting content, you grant Create.psx a license to display and promote your work on the platform.
              </p>
              <p>
                <strong>Work Product:</strong> Ownership of deliverables is governed by individual service agreements between builders and clients. 
                Unless otherwise specified, clients receive full rights to deliverables upon final payment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Prohibited Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Users are prohibited from:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Using the platform for illegal activities or fraud</li>
                <li>Circumventing token-gating or payment systems</li>
                <li>Harassing, threatening, or abusing other users</li>
                <li>Posting false, misleading, or defamatory content</li>
                <li>Attempting to manipulate reviews or ratings</li>
                <li>Scraping or unauthorized data collection</li>
                <li>Violating intellectual property rights</li>
                <li>Creating fake accounts or impersonating others</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Platform Mediation:</strong> Disputes between clients and builders should first be resolved through the platform's 
                built-in dispute resolution system.
              </p>
              <p>
                <strong>Admin Arbitration:</strong> Platform administrators may review disputes and make binding decisions on payment releases or refunds.
              </p>
              <p>
                <strong>Legal Action:</strong> These Terms are governed by the laws of [Jurisdiction]. Any legal disputes will be resolved 
                through binding arbitration in [Jurisdiction].
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Disclaimers and Limitations of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Platform "AS IS":</strong> The platform is provided "as is" without warranties of any kind. We do not guarantee 
                uninterrupted access, error-free operation, or security from unauthorized access.
              </p>
              <p>
                <strong>Third-Party Services:</strong> We are not responsible for third-party services including blockchain networks, 
                wallet providers, or payment processors.
              </p>
              <p>
                <strong>User Transactions:</strong> create.psx is a marketplace platform facilitating connections. We are not a party to 
                transactions between builders and clients and are not liable for service quality, delivery, or disputes.
              </p>
              <p>
                <strong>Cryptocurrency Risks:</strong> You acknowledge and accept risks associated with cryptocurrency including price volatility, 
                regulatory changes, and smart contract vulnerabilities.
              </p>
              <p>
                <strong>Limitation of Liability:</strong> To the maximum extent permitted by law, create.psx's liability is limited to 
                the amount of fees paid by you in the 12 months preceding the claim.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, 
                or pose risks to the platform or other users. Termination may result in loss of access to your account, 
                pending transactions, and platform features.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may modify these Terms at any time. Material changes will be announced on the platform with 30 days notice. 
                Continued use of the platform after changes constitutes acceptance of the updated Terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="font-semibold">
                Email: legal@create.psx<br />
                Platform: create.psx
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
