/**
 * Email service for create.psx
 * 
 * Supports multiple providers: SendGrid, Mailgun, AWS SES
 * Falls back to console logging if no provider is configured
 */

import type { EmailProvider, EmailOptions, EmailConfig, EmailProviderType } from "./types";
import { ConsoleEmailProvider } from "./providers/console";
import { SendGridEmailProvider } from "./providers/sendgrid";
import { MailgunEmailProvider } from "./providers/mailgun";
import { SESEmailProvider } from "./providers/ses";

export class EmailService {
  private provider: EmailProvider;
  private defaultFrom: { email: string; name?: string };

  constructor(config?: Partial<EmailConfig>) {
    const providerType = this.getProviderType(config);
    this.provider = this.createProvider(providerType, config);
    
    this.defaultFrom = config?.from || {
      email: process.env.EMAIL_FROM || "noreply@create.psx",
      name: process.env.EMAIL_FROM_NAME || "create.psx",
    };

    console.log(`📧 Email service initialized with provider: ${providerType}`);
  }

  async send(options: Omit<EmailOptions, "from"> & { from?: EmailOptions["from"] }): Promise<void> {
    const emailOptions: EmailOptions = {
      ...options,
      from: options.from || this.defaultFrom,
    };

    try {
      await this.provider.send(emailOptions);
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }

  private getProviderType(config?: Partial<EmailConfig>): EmailProviderType {
    if (config?.provider) {
      return config.provider;
    }

    // Auto-detect based on environment variables
    if (process.env.SENDGRID_API_KEY) {
      return "sendgrid";
    }
    
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
      return "mailgun";
    }
    
    if (process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      return "ses";
    }

    // Default to console for development
    return "console";
  }

  private createProvider(type: EmailProviderType, config?: Partial<EmailConfig>): EmailProvider {
    switch (type) {
      case "sendgrid":
        return new SendGridEmailProvider(
          config?.sendgridApiKey || process.env.SENDGRID_API_KEY || ""
        );

      case "mailgun":
        return new MailgunEmailProvider(
          config?.mailgunApiKey || process.env.MAILGUN_API_KEY || "",
          config?.mailgunDomain || process.env.MAILGUN_DOMAIN || "",
          (config?.mailgunRegion || process.env.MAILGUN_REGION || "us") as "us" | "eu"
        );

      case "ses":
        return new SESEmailProvider(
          config?.awsRegion || process.env.AWS_REGION || "",
          config?.awsAccessKeyId || process.env.AWS_ACCESS_KEY_ID || "",
          config?.awsSecretAccessKey || process.env.AWS_SECRET_ACCESS_KEY || ""
        );

      case "console":
      default:
        return new ConsoleEmailProvider();
    }
  }
}

// Singleton instance
let emailServiceInstance: EmailService | null = null;

export function getEmailService(): EmailService {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService();
  }
  return emailServiceInstance;
}
