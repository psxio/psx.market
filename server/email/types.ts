/**
 * Email service types and interfaces for create.psx
 * 
 * Supports multiple email providers: SendGrid, Mailgun, AWS SES
 */

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface EmailOptions {
  to: EmailAddress | EmailAddress[];
  from: EmailAddress;
  subject: string;
  html: string;
  text?: string;
  replyTo?: EmailAddress;
  cc?: EmailAddress | EmailAddress[];
  bcc?: EmailAddress | EmailAddress[];
  attachments?: EmailAttachment[];
}

export interface EmailProvider {
  send(options: EmailOptions): Promise<void>;
}

export type EmailProviderType = "sendgrid" | "mailgun" | "ses" | "console";

export interface EmailConfig {
  provider: EmailProviderType;
  from: EmailAddress;
  
  // SendGrid
  sendgridApiKey?: string;
  
  // Mailgun
  mailgunApiKey?: string;
  mailgunDomain?: string;
  mailgunRegion?: "us" | "eu";
  
  // AWS SES
  awsRegion?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
}
