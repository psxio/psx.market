import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function CookiePolicy() {
  const headerSection = useScrollReveal();
  const contentSection = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
        <div ref={headerSection.ref as any} className={headerSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last Updated: October 21, 2025
          </p>
        </div>

        <div ref={contentSection.ref as any} className={`space-y-6 ${contentSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
          <Card>
            <CardHeader>
              <CardTitle>1. What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Cookies are small text files stored on your device when you visit websites. They help websites remember your 
                preferences, maintain sessions, and improve your experience. create.psx uses cookies and similar technologies 
                to provide and improve our platform.
              </p>
              <p>
                This Cookie Policy explains what cookies we use, why we use them, and how you can control them.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Essential Cookies (Required)</strong>
              </p>
              <p>
                These cookies are necessary for the platform to function and cannot be disabled:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Session Cookies:</strong> Maintain your authenticated session when logged in</li>
                <li><strong>Security Cookies:</strong> Prevent unauthorized access and protect against attacks</li>
                <li><strong>Wallet Connection:</strong> Remember your connected Web3 wallet preferences</li>
                <li><strong>CSRF Tokens:</strong> Protect forms from cross-site request forgery</li>
              </ul>

              <p className="mt-4">
                <strong>Functional Cookies (Optional)</strong>
              </p>
              <p>
                These cookies enhance your experience and remember your preferences:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Theme Preferences:</strong> Remember your light/dark mode selection</li>
                <li><strong>Language Settings:</strong> Store your preferred language</li>
                <li><strong>UI Preferences:</strong> Remember expanded/collapsed sections and view settings</li>
                <li><strong>Notification Settings:</strong> Store your notification preferences</li>
              </ul>

              <p className="mt-4">
                <strong>Analytics Cookies (Optional)</strong>
              </p>
              <p>
                These help us understand how users interact with the platform:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Usage Analytics:</strong> Track page views, clicks, and navigation patterns</li>
                <li><strong>Performance Monitoring:</strong> Measure page load times and errors</li>
                <li><strong>Feature Usage:</strong> Understand which features are most used</li>
                <li><strong>A/B Testing:</strong> Test different versions of features</li>
              </ul>

              <p className="mt-4">
                <strong>Marketing Cookies (Optional)</strong>
              </p>
              <p>
                These cookies help us show relevant content and promotions:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Referral Tracking:</strong> Track referral sources and affiliate links</li>
                <li><strong>Campaign Attribution:</strong> Measure marketing campaign effectiveness</li>
                <li><strong>Retargeting:</strong> Show relevant ads on other platforms (if enabled)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Local Storage and Web3 Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                In addition to cookies, we use browser local storage and session storage for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Wallet Provider Preferences:</strong> Remember your connected wallet type (Base Account SDK)</li>
                <li><strong>Network Selection:</strong> Store Base mainnet/Sepolia preference</li>
                <li><strong>Cached Data:</strong> Improve performance by caching API responses</li>
                <li><strong>Theme Data:</strong> Store dark mode preference</li>
                <li><strong>Draft Content:</strong> Save message drafts and form data locally</li>
              </ul>
              <p className="mt-4">
                <strong>Note:</strong> Local storage data remains on your device until you clear browser data. 
                It is not transmitted to our servers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Third-Party Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Some third-party services we use may set their own cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Base Blockchain:</strong> Wallet connection and transaction signing</li>
                <li><strong>Google Fonts:</strong> Font loading optimization</li>
                <li><strong>CDN Providers:</strong> Content delivery and performance</li>
                <li><strong>Analytics Platforms:</strong> Usage statistics (if enabled)</li>
              </ul>
              <p className="mt-4">
                These third parties have their own privacy policies governing their use of cookies.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Cookie Lifespan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Session Cookies:</strong> Deleted when you close your browser
              </p>
              <p>
                <strong>Persistent Cookies:</strong> Remain for a specified period:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Authentication session: 24 hours</li>
                <li>Theme preferences: 1 year</li>
                <li>Analytics cookies: 90 days</li>
                <li>Marketing cookies: 30 days</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. How to Control Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong>Browser Settings:</strong>
              </p>
              <p>
                Most browsers allow you to control cookies through settings:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chrome: Settings → Privacy and Security → Cookies</li>
                <li>Firefox: Options → Privacy & Security → Cookies</li>
                <li>Safari: Preferences → Privacy → Cookies</li>
                <li>Edge: Settings → Privacy → Cookies</li>
              </ul>

              <p className="mt-4">
                <strong>Platform Preferences:</strong>
              </p>
              <p>
                You can manage non-essential cookies through your notification settings:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Navigate to Settings → Notifications</li>
                <li>Toggle analytics and marketing preferences</li>
                <li>Changes take effect immediately</li>
              </ul>

              <p className="mt-4">
                <strong>Impact of Disabling Cookies:</strong>
              </p>
              <p>
                Disabling cookies may affect platform functionality:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You may not be able to stay logged in</li>
                <li>Theme and preference settings won't be saved</li>
                <li>Some features may not work properly</li>
                <li>Wallet connection may require re-authentication</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Do Not Track (DNT)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We respect browser "Do Not Track" signals. When DNT is enabled, we:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Disable non-essential analytics cookies</li>
                <li>Limit data collection to essential functionality</li>
                <li>Do not use marketing or retargeting cookies</li>
              </ul>
              <p className="mt-4">
                Note: Essential cookies required for platform functionality will still be used.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Updates to Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Cookie Policy periodically to reflect changes in our practices or for legal reasons. 
                We'll notify you of material changes by posting an announcement on the platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. More Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                For more information about cookies and how to control them, visit:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">allaboutcookies.org</a></li>
                <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">youronlinechoices.com</a></li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                For questions about our use of cookies:
              </p>
              <p className="font-semibold">
                Email: privacy@create.psx<br />
                Platform: create.psx
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
