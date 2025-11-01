# Privy Integration Guide

## Overview
port444 now integrates **Privy** authentication alongside RainbowKit to provide multiple sign-in options including Google, Twitter, Discord, Email, and embedded wallets for users without existing wallet connections.

## What is Privy?
Privy is a Web3 authentication provider that enables seamless onboarding for both crypto-native users and Web2 users transitioning to Web3. It provides:
- **Social logins**: Google, Twitter, Discord, Email
- **Embedded wallets**: Automatically creates wallets for users who don't have one
- **Unified authentication**: Works alongside existing wallet connections (RainbowKit)

## Installation
The following packages are already installed:
```bash
npm install @privy-io/react-auth
```

## Configuration

### Environment Variables
Required environment variable stored in Replit Secrets:
- `VITE_PRIVY_APP_ID`: Your Privy application ID from [dashboard.privy.io](https://dashboard.privy.io)

### App.tsx Setup
The `PrivyProvider` wraps the entire application and is configured with:
- **Login methods**: Email, Google, Twitter, Discord, Wallet
- **Theme**: Dark mode with purple accent (#a855f7) matching port444 branding
- **Supported chains**: Base mainnet (8453)

```tsx
<PrivyProvider
  appId={privyAppId}
  config={{
    appearance: {
      theme: 'dark',
      accentColor: '#a855f7',
      logo: 'https://port444.replit.app/icon-512.png',
    },
    loginMethods: ['email', 'google', 'twitter', 'discord', 'wallet'],
    supportedChains: [{ id: 8453, name: 'Base', ... }],
  }}
>
  {/* Rest of app */}
</PrivyProvider>
```

## Usage

### Custom Login Component
A reusable `<PrivyLoginButton />` component is available at `client/src/components/privy-login-button.tsx`:

```tsx
import { PrivyLoginButton } from '@/components/privy-login-button';

export function MyPage() {
  return <PrivyLoginButton />;
}
```

The button displays:
- **Loading state** when Privy is initializing
- **Sign In button** when user is not authenticated
- **User info + Logout** when authenticated (shows email or truncated wallet address)

### Using Privy Hooks
```tsx
import { usePrivy } from '@privy-io/react-auth';

function MyComponent() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  
  if (!ready) return <div>Loading...</div>;
  
  if (authenticated) {
    return (
      <div>
        <p>Email: {user?.email?.address}</p>
        <p>Wallet: {user?.wallet?.address}</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
  
  return <button onClick={login}>Login</button>;
}
```

## Integration with RainbowKit
Privy and RainbowKit work together seamlessly:
- **RainbowKit**: Handles wallet connections (MetaMask, Coinbase Wallet, WalletConnect, etc.)
- **Privy**: Provides social authentication and embedded wallets
- Users can authenticate with either system, and both provide access to wallet functionality via wagmi hooks

## Embedded Wallets
When users sign in with email, Google, Twitter, or Discord without an existing wallet:
1. Privy automatically creates an **embedded wallet** for them
2. The wallet is accessible via `user.wallet.address`
3. Users can interact with smart contracts immediately without installing MetaMask
4. The embedded wallet is secured by Privy's infrastructure

## Use Cases on port444

### 1. Builder Onboarding
Builders can sign up with Google/Twitter instead of requiring a wallet:
```tsx
// In builder-onboarding.tsx
const { authenticated, user, login } = usePrivy();

if (!authenticated) {
  return <button onClick={login}>Sign Up with Google/Twitter</button>;
}
```

### 2. Client Registration
Clients without wallets can still:
- Browse services
- Message builders
- Create escrow orders (using embedded wallet)

### 3. Token Benefits
Since Privy provides wallet addresses (embedded or connected):
- Check $CREATE and $PSX token balances
- Apply fee discounts automatically
- Access token-gated features

## Security Notes
- Privy App ID is safe to expose in frontend code
- All authentication flows are handled by Privy's secure infrastructure
- Embedded wallets are non-custodial and can be exported by users
- Private keys never touch port444 servers

## Testing
1. Navigate to any page with the `<PrivyLoginButton />`
2. Click "Sign In"
3. Choose login method (Google, Twitter, Discord, Email)
4. Complete OAuth/email verification flow
5. Verify `user.wallet.address` is available via wagmi hooks

## Resources
- **Privy Dashboard**: [dashboard.privy.io](https://dashboard.privy.io)
- **Privy Docs**: [docs.privy.io](https://docs.privy.io)
- **GitHub Demo**: [github.com/privy-io/wagmi-demo](https://github.com/privy-io/wagmi-demo)

## Next Steps
- [ ] Add Privy login to builder onboarding flow
- [ ] Add Privy login to client registration flow
- [ ] Test Google sign-in flow end-to-end
- [ ] Test embedded wallet creation
- [ ] Link Privy authentication to port444 builder/client accounts
