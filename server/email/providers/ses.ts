/**
 * AWS SES email provider
 * 
 * Setup:
 * 1. Set up AWS SES in your AWS account
 * 2. Verify email addresses/domains
 * 3. Set AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
 */

import type { EmailProvider, EmailOptions, EmailAddress } from "../types";
import { createHmac } from "crypto";

export class SESEmailProvider implements EmailProvider {
  constructor(
    private region: string,
    private accessKeyId: string,
    private secretAccessKey: string
  ) {
    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error("AWS SES credentials are required");
    }
  }

  async send(options: EmailOptions): Promise<void> {
    const toAddresses = Array.isArray(options.to) ? options.to : [options.to];
    
    const params = {
      Source: this.formatAddress(options.from),
      Destination: {
        ToAddresses: toAddresses.map(a => this.formatAddress(a)),
        ...(options.cc && {
          CcAddresses: (Array.isArray(options.cc) ? options.cc : [options.cc])
            .map(a => this.formatAddress(a))
        }),
        ...(options.bcc && {
          BccAddresses: (Array.isArray(options.bcc) ? options.bcc : [options.bcc])
            .map(a => this.formatAddress(a))
        }),
      },
      Message: {
        Subject: {
          Data: options.subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: options.html,
            Charset: "UTF-8",
          },
          ...(options.text && {
            Text: {
              Data: options.text,
              Charset: "UTF-8",
            }
          }),
        },
      },
      ...(options.replyTo && {
        ReplyToAddresses: [this.formatAddress(options.replyTo)]
      }),
    };

    const endpoint = `https://email.${this.region}.amazonaws.com`;
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.slice(0, 8);

    const canonicalUri = "/";
    const canonicalQuerystring = "";
    const canonicalHeaders = `host:email.${this.region}.amazonaws.com\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "host;x-amz-date";

    const payloadHash = this.sha256(JSON.stringify(params));
    const canonicalRequest = `POST\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${this.region}/ses/aws4_request`;
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${this.sha256(canonicalRequest)}`;

    const signingKey = this.getSignatureKey(this.secretAccessKey, dateStamp, this.region, "ses");
    const signature = this.hmacSha256(stringToSign, signingKey);

    const authorizationHeader = `${algorithm} Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": authorizationHeader,
        "Content-Type": "application/x-amz-json-1.0",
        "X-Amz-Date": amzDate,
        "X-Amz-Target": "SimpleEmailService_v2.SendEmail",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AWS SES error: ${response.status} - ${error}`);
    }
  }

  private formatAddress(address: EmailAddress): string {
    return address.name 
      ? `${address.name} <${address.email}>`
      : address.email;
  }

  private sha256(data: string): string {
    return createHmac("sha256", "").update(data).digest("hex");
  }

  private hmacSha256(data: string, key: Buffer | string): string {
    return createHmac("sha256", key).update(data).digest("hex");
  }

  private getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Buffer {
    const kDate = createHmac("sha256", "AWS4" + key).update(dateStamp).digest();
    const kRegion = createHmac("sha256", kDate).update(regionName).digest();
    const kService = createHmac("sha256", kRegion).update(serviceName).digest();
    const kSigning = createHmac("sha256", kService).update("aws4_request").digest();
    return kSigning;
  }
}
