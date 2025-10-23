import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: number;
}

const FAQ_DATABASE = {
  "how do i get started": {
    answer: "To get started on Create.psx, connect your wallet with either $CREATE or $PSX tokens. Browse our marketplace for builders, review their portfolios, and book a service!",
    keywords: ["start", "begin", "getting started", "onboard"],
  },
  "payment methods": {
    answer: "We accept USDC payments on the Base blockchain. All payments are processed securely through our smart contract escrow system.",
    keywords: ["payment", "pay", "usdc", "crypto", "currency"],
  },
  "token requirements": {
    answer: "You need to hold either $CREATE or $PSX tokens to access the marketplace. Different tiers unlock additional benefits and lower platform fees.",
    keywords: ["token", "create", "psx", "requirement", "tier"],
  },
  "how escrow works": {
    answer: "Funds are held in a secure smart contract escrow until project milestones are completed. Clients approve milestone releases, ensuring quality delivery before payment.",
    keywords: ["escrow", "secure", "safe", "protection"],
  },
  "builder verification": {
    answer: "Verified builders have completed our onboarding process, portfolio review, and identity verification. Look for the verified badge on builder profiles.",
    keywords: ["verified", "trust", "authentic", "legitimate"],
  },
  "dispute resolution": {
    answer: "If there's a disagreement, either party can initiate a dispute. Our admin team reviews evidence from both sides and makes a fair decision on fund distribution.",
    keywords: ["dispute", "problem", "issue", "conflict", "refund"],
  },
  "platform fees": {
    answer: "Platform fees are 2.5% of the project total. Higher $PSX tier holders may receive fee discounts. Fees help maintain the platform and support builder verification.",
    keywords: ["fee", "cost", "charge", "price"],
  },
  "how to become builder": {
    answer: "Apply through our builder application form. You'll need a portfolio, relevant experience, and wallet with $CREATE or $PSX tokens. Our team reviews applications within 48 hours.",
    keywords: ["builder", "seller", "become", "apply", "join"],
  },
};

export function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm the Create.psx assistant. How can I help you today?",
      sender: "bot",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");

  const findAnswer = (query: string): string => {
    const lowercaseQuery = query.toLowerCase();

    for (const [key, faq] of Object.entries(FAQ_DATABASE)) {
      if (
        lowercaseQuery.includes(key) ||
        faq.keywords.some((keyword) => lowercaseQuery.includes(keyword))
      ) {
        return faq.answer;
      }
    }

    return "I'm not sure about that. Please contact our support team at support@create.psx or check our detailed FAQ page for more information.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: String(Date.now()),
      text: input,
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const answer = findAnswer(input);
      const botMessage: Message = {
        id: String(Date.now() + 1),
        text: answer,
        sender: "bot",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        data-testid="chatbot-toggle"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 flex flex-col" data-testid="chatbot-window">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <HelpCircle className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm">Create.psx Assistant</CardTitle>
            <Badge variant="outline" className="text-xs mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5" />
              Online
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          data-testid="chatbot-close"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              data-testid={`message-${msg.sender}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-3 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <Badge
              variant="outline"
              className="cursor-pointer hover-elevate"
              onClick={() => handleQuickQuestion("How do I get started?")}
              data-testid="quick-question-start"
            >
              Getting Started
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover-elevate"
              onClick={() => handleQuickQuestion("How does payment work?")}
              data-testid="quick-question-payment"
            >
              Payments
            </Badge>
            <Badge
              variant="outline"
              className="cursor-pointer hover-elevate"
              onClick={() => handleQuickQuestion("Token requirements?")}
              data-testid="quick-question-tokens"
            >
              Tokens
            </Badge>
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a question..."
              className="flex-1"
              data-testid="chatbot-input"
            />
            <Button onClick={handleSend} size="icon" data-testid="chatbot-send">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
