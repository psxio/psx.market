import { Header } from "@/components/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const faqCategories = [
  {
    title: "Getting Started",
    questions: [
      {
        q: "What is Create.psx?",
        a: "Create.psx is an open Web3 marketplace connecting premium builders with clients in the cryptocurrency and memecoin space. The platform is accessible to everyone, but token holders ($CREATE or $PSX) receive exclusive benefits including reduced fees and priority support."
      },
      {
        q: "How do I get started as a client?",
        a: "To become a client: (1) Connect your Base-compatible wallet (optional but recommended for token benefits), (2) Browse the marketplace and find builders that match your needs, (3) Book a service directly through the platform. Token holders ($CREATE or $PSX) automatically receive 60% lower platform fees!"
      },
      {
        q: "How do I become a builder on Create.psx?",
        a: "To become a builder: (1) Visit the 'Apply' page, (2) Complete the multi-step application form including your skills, portfolio, and category-specific information, (3) Wait for admin approval (typically 2-5 business days), (4) Once approved, complete your profile setup and start listing services."
      },
      {
        q: "What are the $CREATE and $PSX tokens and what benefits do they provide?",
        a: "Both $CREATE and $PSX are ERC-20 tokens on the Base blockchain that provide exclusive benefits to holders. Users only need to hold ONE of these tokens to receive perks. Token holder benefits include: 60% lower platform fees (1% instead of 2.5%), priority support, verified token holder badges, and early access to new features. The platform remains fully accessible to non-holders, but token holders save significantly on every transaction."
      },
      {
        q: "What blockchain network does Create.psx use?",
        a: "Create.psx operates on the Base blockchain (both mainnet for production and Sepolia testnet for testing). You'll need a Base-compatible wallet to connect and interact with the platform."
      },
      {
        q: "Can I use the platform without holding tokens?",
        a: "Absolutely! Create.psx is open to everyone - no tokens required to browse, book services, or hire builders. However, holding $CREATE or $PSX tokens unlocks exclusive benefits like 60% lower platform fees, priority support, and verified badges. You can start without tokens and add them later to receive the benefits."
      }
    ]
  },
  {
    title: "Wallet & Tokens",
    questions: [
      {
        q: "Which wallets are supported?",
        a: "Create.psx supports Base-compatible wallets including Coinbase Wallet, MetaMask (with Base network added), and any wallet compatible with the Base Account SDK. Make sure your wallet is connected to the Base network."
      },
      {
        q: "How many tokens do I need to hold to receive benefits?",
        a: "Any amount of $CREATE or $PSX tokens unlocks the holder benefits! As long as you hold at least some tokens (even a small amount), you'll automatically receive the 60% platform fee discount and other perks. You only need to hold ONE of these tokens - not both."
      },
      {
        q: "What happens if my token balance drops to zero?",
        a: "If your token balance drops to zero, you'll lose the holder benefits (reduced fees, priority support, badges) but retain full access to the platform. You'll pay the standard 2.5% platform fee instead of the discounted 1% rate. All existing orders remain valid, and you can continue using the platform normally."
      },
      {
        q: "Do builders need to hold tokens?",
        a: "No, builders do not need to hold $CREATE or $PSX tokens to offer services. Token benefits are optional perks for all users, not requirements. Builders are verified through the application and approval process."
      },
      {
        q: "Can I use a different blockchain network?",
        a: "No, Create.psx exclusively operates on the Base blockchain. All token checks, payments, and smart contract interactions occur on Base (mainnet or Sepolia testnet)."
      },
      {
        q: "Do I need to hold both $CREATE and $PSX tokens?",
        a: "No! You only need to hold the required amount of ONE token - either $CREATE or $PSX. The platform checks both balances and grants access if you meet the requirement for either token. This gives you flexibility in choosing which token to hold."
      },
      {
        q: "What is the $CREATE token contract address?",
        a: "The $CREATE token contract address on Base is: 0x3849cC93e7B71b37885237cd91a215974135cD8D. This is an ERC-20 token that can be held alongside or instead of $PSX for platform access."
      }
    ]
  },
  {
    title: "Payments & Escrow",
    questions: [
      {
        q: "What payment method is accepted?",
        a: "All payments are made in USDC (USD Coin) on the Base blockchain. USDC is a stablecoin pegged 1:1 to the US Dollar, providing price stability for transactions."
      },
      {
        q: "How does the escrow system work?",
        a: "When you book a service, payment is held in a smart contract escrow. Funds are released to the builder upon milestone completion. This protects both parties: clients don't pay until deliverables are received, and builders are guaranteed payment for completed work."
      },
      {
        q: "What are milestones and how are they released?",
        a: "Milestones are payment stages defined when booking a service. For example, a service might have milestones at 25%, 50%, and 100% completion. Clients review deliverables and release funds for each milestone. Builders receive payment as they progress through the project."
      },
      {
        q: "What platform fees does Create.psx charge?",
        a: "Create.psx charges a 2.5% platform fee on completed transactions. However, if you hold $CREATE or $PSX tokens, you receive a 60% discount, paying only 1% instead! This fee covers platform maintenance, escrow services, dispute resolution, and ongoing development. Token holders save significantly on every order."
      },
      {
        q: "How do refunds work?",
        a: "Refunds are processed through the dispute resolution system. If deliverables don't meet agreed specifications, clients can open a dispute. Platform admins review evidence and may authorize full or partial refunds. Note: blockchain transactions cannot be reversed; refunds require builder cooperation or admin intervention."
      },
      {
        q: "Can payments be reversed or canceled after submission?",
        a: "Once submitted to the blockchain, transactions are permanent. However, funds remain in escrow until milestone release. If you need to cancel before work begins, contact the builder to mutually agree on cancellation, then open a dispute for admin-facilitated refund."
      },
      {
        q: "What happens to escrowed funds if a builder doesn't deliver?",
        a: "If a builder fails to deliver, open a dispute through the platform. Admins will review the case and can authorize refunds back to your wallet. Escrow ensures your funds are protected even if a builder disappears or doesn't perform."
      }
    ]
  },
  {
    title: "Services & Orders",
    questions: [
      {
        q: "How do I book a service?",
        a: "Browse the marketplace, find a service that matches your needs, click 'Book Now', select your desired tier/package, define project requirements and milestones, submit payment to escrow, and the builder will begin work."
      },
      {
        q: "Can I customize a service package?",
        a: "Many builders offer multiple tiers (Basic, Standard, Premium) with different deliverables and pricing. For custom requirements beyond listed packages, message the builder before booking to discuss a custom quote."
      },
      {
        q: "How long does it take for builders to deliver?",
        a: "Delivery times vary by service and are displayed on each service listing (e.g., '24 hours', '7 days'). More complex services naturally take longer. Check the estimated delivery time before booking."
      },
      {
        q: "What if I'm not satisfied with the deliverables?",
        a: "If deliverables don't meet specifications: (1) Communicate with the builder through platform messaging, (2) Request revisions (most services include 1-3 revisions), (3) If unresolved, open a dispute for admin review. Don't release milestone payments until you're satisfied."
      },
      {
        q: "Can I cancel an order after booking?",
        a: "Cancellation policies depend on the service and how much work has been completed. Contact the builder immediately if you need to cancel. If work hasn't started, builders often agree to full refunds. For work in progress, partial refunds may be offered based on completion."
      },
      {
        q: "How many revisions are included?",
        a: "Revision counts are specified in each service tier (typically 1-3 revisions). Additional revisions beyond what's included may incur extra fees. Clarify revision expectations with the builder before booking."
      }
    ]
  },
  {
    title: "Communication & Support",
    questions: [
      {
        q: "How do I communicate with builders?",
        a: "create.psx has a built-in real-time messaging system. Once you book a service, a chat thread is automatically created. You can share text messages, files, and project updates. All communication is logged for dispute resolution purposes."
      },
      {
        q: "What if a builder isn't responding to my messages?",
        a: "Builders are expected to maintain reasonable response times (displayed on their profiles). If a builder is unresponsive for 48+ hours after work has started, you can open a dispute. Platform admins will contact the builder and may authorize refunds if they remain unresponsive."
      },
      {
        q: "Can I work with builders outside the platform?",
        a: "We strongly discourage off-platform transactions. Working outside create.psx means losing escrow protection, dispute resolution, and quality guarantees. Builders who solicit off-platform work may be removed from the platform."
      },
      {
        q: "How do I report inappropriate behavior or scams?",
        a: "Report issues through the dispute system or contact platform admins directly. Include screenshots, transaction details, and a description of the problem. We take fraud and misconduct seriously and investigate all reports promptly."
      },
      {
        q: "What are the platform's customer support hours?",
        a: "Platform admins monitor the site daily. Dispute responses typically occur within 24-48 hours. For urgent issues, use the dispute system to escalate. Non-urgent questions can be sent via the contact form or email."
      }
    ]
  },
  {
    title: "Builder-Specific",
    questions: [
      {
        q: "How do I get approved as a builder?",
        a: "After submitting your application, admins review your portfolio, skills, and experience. Approval typically takes 2-5 business days. Factors include: portfolio quality, skill relevance, professional presentation, and category-specific requirements (e.g., social media metrics for KOLs)."
      },
      {
        q: "What categories can builders offer services in?",
        a: "Current categories include: KOLs & Influencers, 3D Content Creators, Marketing & Growth, Script Development, and Volume Services. Each category has specific requirements and showcase fields."
      },
      {
        q: "How do I set my service pricing?",
        a: "You control your pricing completely. Research competitor rates in your category and set competitive prices. You can create multiple tiers (Basic, Standard, Premium) with different deliverables and pricing. Update prices anytime from your Builder Dashboard."
      },
      {
        q: "When do I receive payment after completing work?",
        a: "Payment is released when clients approve milestones. Once released from escrow, funds (minus platform fee) are sent directly to your connected wallet. Releases typically occur immediately after client approval."
      },
      {
        q: "Can I have multiple service listings?",
        a: "Yes! Builders can list multiple services across their expertise areas. For example, a KOL might offer 'Twitter Promotion', 'Twitter Space Hosting', and 'Social Media Strategy' as separate services."
      },
      {
        q: "How do reviews and ratings work?",
        a: "After order completion, clients can leave a rating (1-5 stars) and written review. Reviews are public and appear on your profile. High ratings improve your visibility in marketplace search. You can respond to reviews to address feedback or thank clients."
      },
      {
        q: "What happens if I can't complete an order?",
        a: "If you can't fulfill an order, communicate immediately with the client. Offer alternatives: find another builder to complete the work, provide a partial delivery with partial payment, or mutually agree to cancel with a full refund. Failure to deliver harms your reputation and may result in removal from the platform."
      },
      {
        q: "Can I temporarily pause my services?",
        a: "Yes, you can mark services as 'inactive' from your Builder Dashboard. Inactive services don't appear in marketplace search but remain on your profile. Reactivate them anytime. Use this when you're at capacity or taking a break."
      }
    ]
  },
  {
    title: "Technical & Security",
    questions: [
      {
        q: "Is my wallet secure on create.psx?",
        a: "create.psx never has access to your private keys. Wallet connections use the Base Account SDK, which keeps your keys on your device. We cannot access, move, or freeze your funds. You maintain full control of your wallet."
      },
      {
        q: "What data does create.psx collect?",
        a: "We collect: wallet addresses (public), transaction history, profile information, messages, and uploaded files. See our Privacy Policy for complete details. We comply with GDPR and CCPA regulations."
      },
      {
        q: "Can I delete my account and data?",
        a: "Yes, you can request account deletion. Note that blockchain transactions are permanent and cannot be erased. Off-chain data (profile, messages, files) can be deleted, but some data may be retained for legal compliance and dispute resolution."
      },
      {
        q: "What smart contracts power the escrow system?",
        a: "Our escrow system uses audited smart contracts on the Base blockchain. Contracts hold USDC payments and release them based on milestone completion. Smart contract code is publicly viewable on Base blockchain explorers."
      },
      {
        q: "Are there any transaction limits or restrictions?",
        a: "Service pricing is unlimited, but extremely high-value transactions ($10,000+) may trigger additional verification steps for security. Gas fees on Base are minimal (typically under $0.01 per transaction)."
      }
    ]
  },
  {
    title: "Disputes & Resolution",
    questions: [
      {
        q: "How do I open a dispute?",
        a: "From your order page, click 'Open Dispute'. Provide a clear description of the issue, upload evidence (screenshots, files, messages), and submit. Both parties will be notified, and a platform admin will review the case."
      },
      {
        q: "How long does dispute resolution take?",
        a: "Most disputes are resolved within 3-7 business days. Complex cases may take longer. Admins review evidence from both parties before making decisions. Decisions are binding and final."
      },
      {
        q: "What happens if I win a dispute as a client?",
        a: "If the admin rules in your favor, escrowed funds are refunded to your wallet (minus any gas fees). Partial refunds may be issued if some work was completed satisfactorily."
      },
      {
        q: "What happens if I win a dispute as a builder?",
        a: "If the admin rules in your favor, milestone payments are released to you despite client objections. This protects builders from clients who refuse payment for completed work."
      },
      {
        q: "Can I appeal a dispute decision?",
        a: "Dispute decisions are generally final. However, if you have new evidence not previously submitted, you may request a review. Appeals are granted at admin discretion."
      }
    ]
  }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const headerSection = useScrollReveal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
        <div ref={headerSection.ref as any} className={`mb-8 ${headerSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-6">
            Find answers to common questions about create.psx, the open Web3 marketplace with exclusive token holder benefits.
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search FAQs..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-faq-search"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, qIdx) => (
                      <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-left" data-testid={`accordion-question-${idx}-${qIdx}`}>
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or browse all categories above
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mt-12">
          <CardContent className="py-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <p className="text-sm text-muted-foreground">
              Contact us at <a href="mailto:support@create.psx" className="text-primary hover:underline">support@create.psx</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
