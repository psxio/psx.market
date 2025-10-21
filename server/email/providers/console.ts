/**
 * Console email provider - logs emails to console instead of sending
 * Useful for development and testing
 */

import type { EmailProvider, EmailOptions } from "../types";

export class ConsoleEmailProvider implements EmailProvider {
  async send(options: EmailOptions): Promise<void> {
    console.log("\n📧 Email (Console Mode):");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`From: ${options.from.name || ""} <${options.from.email}>`);
    
    const toAddresses = Array.isArray(options.to) ? options.to : [options.to];
    console.log(`To: ${toAddresses.map(a => `${a.name || ""} <${a.email}>`).join(", ")}`);
    
    if (options.cc) {
      const ccAddresses = Array.isArray(options.cc) ? options.cc : [options.cc];
      console.log(`CC: ${ccAddresses.map(a => `${a.name || ""} <${a.email}>`).join(", ")}`);
    }
    
    console.log(`Subject: ${options.subject}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(options.text || "No plain text version");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
