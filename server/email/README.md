# Email Service for create.psx

Comprehensive email notification system supporting multiple providers with automatic fallback to console logging for development.

## Supported Providers

1. **SendGrid** - Recommended for production
2. **Mailgun** - Alternative production option
3. **AWS SES** - For AWS-integrated deployments
4. **Console** - Development fallback (logs to console)

## Quick Start

The email service automatically detects the provider based on environment variables. If no provider is configured, it defaults to console logging for development.

### No Setup Required for Development

By default, the system uses console logging. You'll see formatted email output in your server logs:

```
📧 Email (Console Mode):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From: create.psx <noreply@create.psx>
To: John Doe <john@example.com>
Subject: Order Update
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your order has been confirmed...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Production Setup

Choose **one** of the following providers:

### Option 1: SendGrid (Recommended)

**Setup:**
1. Create account at https://sendgrid.com
2. Generate API key (Settings → API Keys)
3. Add environment variables:

```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=create.psx
```

**Free Tier:** 100 emails/day

### Option 2: Mailgun

**Setup:**
1. Create account at https://mailgun.com
2. Verify your domain
3. Get API key from Dashboard
4. Add environment variables:

```bash
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.yourdomain.com
MAILGUN_REGION=us  # or "eu"
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=create.psx
```

**Free Tier:** 5,000 emails/month for 3 months

### Option 3: AWS SES

**Setup:**
1. Set up AWS SES in your AWS account
2. Verify email addresses or domains
3. Get AWS credentials
4. Add environment variables:

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=create.psx
```

**Free Tier:** 62,000 emails/month (when sent from EC2)

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SENDGRID_API_KEY` | For SendGrid | SendGrid API key | `SG.xxx...` |
| `MAILGUN_API_KEY` | For Mailgun | Mailgun API key | `key-xxx...` |
| `MAILGUN_DOMAIN` | For Mailgun | Verified domain | `mg.example.com` |
| `MAILGUN_REGION` | Optional | Mailgun region (us/eu) | `us` |
| `AWS_REGION` | For AWS SES | AWS region | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | For AWS SES | AWS access key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | For AWS SES | AWS secret key | `xxx...` |
| `EMAIL_FROM` | Optional | Sender email | `noreply@example.com` |
| `EMAIL_FROM_NAME` | Optional | Sender name | `create.psx` |
| `BASE_URL` | Optional | App base URL | `https://create.psx` |

## Architecture

### File Structure

```
server/email/
├── README.md              # This file
├── types.ts              # TypeScript interfaces
├── service.ts            # Main email service
├── providers/
│   ├── console.ts        # Console logging provider
│   ├── sendgrid.ts       # SendGrid provider
│   ├── mailgun.ts        # Mailgun provider
│   └── ses.ts            # AWS SES provider
└── templates/
    ├── base.ts           # Base email template
    └── notifications.ts  # Notification templates
```

### How It Works

1. **Auto-Detection**: Service checks for provider credentials in environment variables
2. **Singleton Pattern**: One instance shared across the application
3. **Template System**: Branded HTML emails with plain text fallbacks
4. **Error Handling**: Graceful fallback to console logging on errors

## Email Templates

The system includes pre-built templates for common notifications:

### Available Templates

- **Order Updates**: Order status changes, confirmations, completions
- **New Messages**: Chat notifications with message preview
- **Payments**: Payment received confirmations
- **Reviews**: New review notifications
- **Milestones**: Milestone completion and approval

### Template Features

- ✅ **Branded Design**: Purple/cyan gradient matching create.psx theme
- ✅ **Dark Mode**: Optimized for dark backgrounds
- ✅ **Responsive**: Mobile-friendly layouts
- ✅ **Plain Text**: Automatic plain text versions
- ✅ **CTA Buttons**: Action buttons linking to platform
- ✅ **Professional**: Clean, modern design

## Usage Examples

### Basic Email

```typescript
import { getEmailService } from './email/service';

const emailService = getEmailService();

await emailService.send({
  to: { email: 'user@example.com', name: 'John Doe' },
  subject: 'Welcome to create.psx',
  html: '<h1>Welcome!</h1>',
  text: 'Welcome!',
});
```

### Using Templates

```typescript
import { orderUpdateEmail } from './email/templates/notifications';

const { html, text } = orderUpdateEmail({
  recipientName: 'John Doe',
  orderId: '123',
  orderTitle: 'Logo Design',
  status: 'completed',
  builderName: 'Jane Smith',
});

await emailService.send({
  to: { email: 'user@example.com', name: 'John Doe' },
  subject: 'Order Update',
  html,
  text,
});
```

### Multiple Recipients

```typescript
await emailService.send({
  to: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
  ],
  subject: 'Announcement',
  html: '<h1>Important Update</h1>',
});
```

### With CC and BCC

```typescript
await emailService.send({
  to: { email: 'user@example.com' },
  cc: { email: 'manager@example.com' },
  bcc: { email: 'admin@example.com' },
  subject: 'Team Update',
  html: '<p>Content here</p>',
});
```

## Testing

### Test in Development

The console provider is perfect for testing:

1. Start your server
2. Trigger a notification (order update, message, etc.)
3. Check server logs for formatted email output

### Test with Real Provider

Set up environment variables for your chosen provider and test:

```typescript
// In a test script or route
import { getEmailService } from './email/service';

const emailService = getEmailService();

await emailService.send({
  to: { email: 'your-email@example.com' },
  subject: 'Test Email',
  html: '<h1>Test</h1><p>If you receive this, email is working!</p>',
  text: 'Test - If you receive this, email is working!',
});
```

## Integration with Notification System

The email service is integrated with the notification system in `server/notifications.ts`:

- **Client Emails**: Sent to clients who have email addresses
- **Builder Emails**: Currently not sent (builders use wallet-based auth)
- **Preferences**: Respects user notification preferences
- **Types**: Order updates, messages, payments, reviews, milestones

## Limitations

### Current Limitations

- **Builders**: Don't have email addresses in schema (wallet-based auth only)
- **Attachments**: Supported but not currently used
- **Rate Limits**: Dependent on provider's free tier

### Future Enhancements

- [ ] Add optional email field to builders table
- [ ] Support for email attachments in deliverables
- [ ] Email template customization per client tier
- [ ] Email analytics and tracking
- [ ] Scheduled/batch emails
- [ ] Unsubscribe link management

## Troubleshooting

### Emails not sending

1. **Check environment variables** - Make sure provider credentials are set
2. **Check logs** - Look for error messages in server logs
3. **Verify sender email** - Some providers require verified sender addresses
4. **Check spam folder** - Emails might be filtered as spam

### Provider-specific issues

**SendGrid:**
- Verify API key has "Mail Send" permission
- Check sender authentication in SendGrid dashboard

**Mailgun:**
- Verify domain is fully set up with DNS records
- Check region (US vs EU)

**AWS SES:**
- Verify sender email/domain in SES console
- Check if account is in sandbox mode (limits destinations)
- Ensure IAM credentials have SES sending permission

### Getting help

1. Check provider documentation
2. Review server logs for detailed error messages
3. Test with console provider first to verify template/logic

## Security Best Practices

1. **Never commit API keys** - Use environment variables only
2. **Rotate keys regularly** - Follow your provider's security guidelines
3. **Use verified domains** - Improves deliverability and trust
4. **Monitor usage** - Watch for unusual sending patterns
5. **Implement rate limiting** - Prevent abuse and stay within quotas

## Performance

- **Console**: Instant (100ms simulated delay)
- **SendGrid**: ~200-500ms average
- **Mailgun**: ~300-600ms average
- **AWS SES**: ~100-300ms average

All providers send asynchronously - notifications don't block user requests.

## Cost Comparison

| Provider | Free Tier | Paid Pricing |
|----------|-----------|--------------|
| SendGrid | 100/day | $15/mo for 50k |
| Mailgun | 5k/month (3 mo) | $35/mo for 50k |
| AWS SES | 62k/month* | $0.10/1k emails |

*When sent from EC2. Otherwise 1,000 free emails/month.

## License

Part of create.psx platform.
