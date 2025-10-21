/**
 * SendGrid email provider
 * 
 * Setup:
 * 1. Create account at https://sendgrid.com
 * 2. Generate API key
 * 3. Set SENDGRID_API_KEY environment variable
 */

import type { EmailProvider, EmailOptions, EmailAddress } from "../types";

export class SendGridEmailProvider implements EmailProvider {
  constructor(private apiKey: string) {
    if (!apiKey) {
      throw new Error("SendGrid API key is required");
    }
  }

  async send(options: EmailOptions): Promise<void> {
    const toAddresses = Array.isArray(options.to) ? options.to : [options.to];
    
    const personalizations = [{
      to: toAddresses.map(this.formatAddress),
      ...(options.cc && {
        cc: (Array.isArray(options.cc) ? options.cc : [options.cc]).map(this.formatAddress)
      }),
      ...(options.bcc && {
        bcc: (Array.isArray(options.bcc) ? options.bcc : [options.bcc]).map(this.formatAddress)
      }),
    }];

    const payload = {
      personalizations,
      from: this.formatAddress(options.from),
      subject: options.subject,
      content: [
        ...(options.text ? [{ type: "text/plain", value: options.text }] : []),
        { type: "text/html", value: options.html },
      ],
      ...(options.replyTo && { reply_to: this.formatAddress(options.replyTo) }),
      ...(options.attachments && {
        attachments: options.attachments.map(att => ({
          content: Buffer.isBuffer(att.content) 
            ? att.content.toString("base64") 
            : Buffer.from(att.content).toString("base64"),
          filename: att.filename,
          type: att.contentType || "application/octet-stream",
        }))
      }),
    };

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid error: ${response.status} - ${error}`);
    }
  }

  private formatAddress(address: EmailAddress) {
    return {
      email: address.email,
      ...(address.name && { name: address.name }),
    };
  }
}
