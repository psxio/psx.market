/**
 * Mailgun email provider
 * 
 * Setup:
 * 1. Create account at https://mailgun.com
 * 2. Verify domain
 * 3. Get API key
 * 4. Set MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables
 */

import type { EmailProvider, EmailOptions, EmailAddress } from "../types";

export class MailgunEmailProvider implements EmailProvider {
  private baseUrl: string;

  constructor(
    private apiKey: string,
    private domain: string,
    region: "us" | "eu" = "us"
  ) {
    if (!apiKey || !domain) {
      throw new Error("Mailgun API key and domain are required");
    }
    
    this.baseUrl = region === "eu"
      ? "https://api.eu.mailgun.net/v3"
      : "https://api.mailgun.net/v3";
  }

  async send(options: EmailOptions): Promise<void> {
    const formData = new URLSearchParams();
    
    formData.append("from", this.formatAddress(options.from));
    
    const toAddresses = Array.isArray(options.to) ? options.to : [options.to];
    toAddresses.forEach(to => formData.append("to", this.formatAddress(to)));
    
    if (options.cc) {
      const ccAddresses = Array.isArray(options.cc) ? options.cc : [options.cc];
      ccAddresses.forEach(cc => formData.append("cc", this.formatAddress(cc)));
    }
    
    if (options.bcc) {
      const bccAddresses = Array.isArray(options.bcc) ? options.bcc : [options.bcc];
      bccAddresses.forEach(bcc => formData.append("bcc", this.formatAddress(bcc)));
    }
    
    formData.append("subject", options.subject);
    formData.append("html", options.html);
    
    if (options.text) {
      formData.append("text", options.text);
    }
    
    if (options.replyTo) {
      formData.append("h:Reply-To", this.formatAddress(options.replyTo));
    }

    const response = await fetch(`${this.baseUrl}/${this.domain}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${Buffer.from(`api:${this.apiKey}`).toString("base64")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mailgun error: ${response.status} - ${error}`);
    }
  }

  private formatAddress(address: EmailAddress): string {
    return address.name 
      ? `${address.name} <${address.email}>`
      : address.email;
  }
}
