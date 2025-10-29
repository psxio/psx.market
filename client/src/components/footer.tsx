import { Link } from "wouter";
import { Github, Twitter, MessageCircle } from "lucide-react";
import psxLogo from "@assets/ezgif.com-webp-maker_1761694278873.webp";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src={psxLogo} 
                alt="PSX" 
                className="h-16 w-auto object-contain brightness-110"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              The premier Web3 marketplace connecting elite builders with crypto projects. Token holders save 60% on fees!
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com/createpsx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/createpsx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://discord.gg/createpsx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-discord"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/marketplace"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-marketplace"
                >
                  Browse Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/builders"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-builders"
                >
                  Find Builders
                </Link>
              </li>
              <li>
                <Link 
                  href="/apply"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-apply"
                >
                  Become a Builder
                </Link>
              </li>
              <li>
                <Link 
                  href="/become-client"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-become-client"
                >
                  Hire Builders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/how-it-works"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-how-it-works"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  href="/getting-started"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-getting-started"
                >
                  Getting Started
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-faq"
                >
                  Help & FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/builder-quiz"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-builder-quiz"
                >
                  Builder Quiz
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-admin"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/terms-of-service"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-terms"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookie-policy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-cookies"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/adult-builders"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
                  data-testid="link-footer-adult"
                >
                  Adult Content (18+)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; {currentYear} PSX. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground">
                We do not tolerate racist, discriminatory, or illegal content. Adult services for legitimate Web3 projects only.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="text-primary font-semibold">$Create</span> and{" "}
              <span className="text-primary font-semibold">$PSX</span> on Base
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
