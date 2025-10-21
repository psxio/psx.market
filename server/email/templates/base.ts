/**
 * Base email template for create.psx
 * 
 * Provides consistent branding and styling across all emails
 */

export interface EmailTemplateData {
  title: string;
  preheader?: string;
  content: string;
  ctaText?: string;
  ctaUrl?: string;
  footerText?: string;
}

export function baseEmailTemplate(data: EmailTemplateData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${data.title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #0a0a0b;
      color: #e5e5e5;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #0a0a0b;
    }
    .email-header {
      padding: 40px 20px 20px;
      text-align: center;
      background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .email-body {
      padding: 40px 20px;
      background-color: #18181b;
      border-left: 1px solid #27272a;
      border-right: 1px solid #27272a;
    }
    .email-content {
      color: #e5e5e5;
      line-height: 1.6;
      font-size: 16px;
    }
    .email-content p {
      margin: 0 0 16px 0;
    }
    .email-content h2 {
      color: #ffffff;
      font-size: 24px;
      margin: 0 0 20px 0;
      font-weight: 600;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      transition: opacity 0.2s;
    }
    .cta-button:hover {
      opacity: 0.9;
    }
    .email-footer {
      padding: 30px 20px;
      background-color: #18181b;
      border: 1px solid #27272a;
      border-top: none;
      text-align: center;
      color: #71717a;
      font-size: 14px;
    }
    .email-footer a {
      color: #8b5cf6;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background-color: #27272a;
      margin: 30px 0;
    }
    @media only screen and (max-width: 600px) {
      .email-body {
        padding: 30px 15px;
      }
      .email-content h2 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  ${data.preheader ? `
  <div style="display:none;font-size:1px;color:#0a0a0b;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${data.preheader}
  </div>
  ` : ''}
  
  <div class="email-wrapper">
    <div class="email-header">
      <a href="${process.env.BASE_URL || 'https://create.psx'}" class="logo">
        create.psx
      </a>
    </div>
    
    <div class="email-body">
      <div class="email-content">
        <h2>${data.title}</h2>
        ${data.content}
        
        ${data.ctaText && data.ctaUrl ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.ctaUrl}" class="cta-button">${data.ctaText}</a>
        </div>
        ` : ''}
      </div>
    </div>
    
    <div class="email-footer">
      ${data.footerText || `
        <p>You're receiving this email because you're a member of <strong>create.psx</strong></p>
        <p style="margin-top: 10px;">
          <a href="${process.env.BASE_URL || 'https://create.psx'}/settings/notifications">Manage notification preferences</a>
        </p>
      `}
      <div class="divider"></div>
      <p style="margin: 15px 0 0 0; color: #52525b;">
        © ${new Date().getFullYear()} create.psx. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function plainTextTemplate(data: Omit<EmailTemplateData, "content"> & { content: string }): string {
  let text = `${data.title}\n\n${data.content}\n`;
  
  if (data.ctaText && data.ctaUrl) {
    text += `\n${data.ctaText}: ${data.ctaUrl}\n`;
  }
  
  text += `\n---\ncreate.psx - The premium Web3 marketplace\n`;
  text += `Manage preferences: ${process.env.BASE_URL || 'https://create.psx'}/settings/notifications\n`;
  
  return text;
}
