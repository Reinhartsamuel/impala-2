# Privy Social Login & Mantle Sepolia Network Setup

## Overview

This project integrates Privy for social login and wallet authentication, configured to use the Mantle Sepolia testnet as the default network.

## Environment Variables

### Required Environment Variable
- `VITE_PRIVY_APP_ID`: Your Privy application ID

### Setting Up Environment Variables

1. Create or update your `.env` file in the project root:
   ```
   VITE_PRIVY_APP_ID=your_privy_app_id_here
   ```

2. The application will fall back to a default test ID if `VITE_PRIVY_APP_ID` is not set.

## Configuration Details

### Privy Provider Configuration
The Privy provider is configured in `index.tsx` with the following settings:

- **Login Methods**: Email, Wallet, Google, and Twitter
- **Default Network**: Mantle Sepolia (Chain ID: 5003)
- **Appearance**: Light theme with orange accent color (#f97316)
- **Wallet Login**: Set to show wallet login first

### Mantle Sepolia Network Configuration
The Mantle Sepolia network is configured with:

- **Chain ID**: 5003
- **RPC URL**: `https://rpc.sepolia.mantle.xyz`
- **Native Currency**: MNT (Mantle) with 18 decimals
- **Block Explorer**: `https://explorer.sepolia.mantle.xyz`
- **Network Type**: Testnet

## How It Works

### 1. Authentication Flow
- Users are first presented with a login screen when they open the app
- The "Connect with Privy" button triggers the Privy authentication modal
- Users can login with email, Google, Twitter, or wallet
- Once authenticated, the app checks if the user has completed onboarding

### 2. Environment Variable Loading
- Vite automatically exposes environment variables prefixed with `VITE_` to the client
- The Privy App ID is accessed via `import.meta.env.VITE_PRIVY_APP_ID`
- TypeScript support is enabled via `vite/client` types in `tsconfig.json`

### 3. Network Configuration
- Mantle Sepolia is set as the only supported chain in Privy configuration
- This ensures users can only connect to the Mantle Sepolia network
- Wallet connections will automatically use the Mantle Sepolia RPC

### 4. User Flow
1. **Login Screen**: Users see a welcome screen with "Connect with Privy" button
2. **Authentication**: Privy modal opens for social login or wallet connection
3. **Onboarding**: After login, new users complete the risk profile questionnaire
4. **Dashboard**: Authenticated and onboarded users access the main dashboard

### 5. Fallback Behavior
- If `VITE_PRIVY_APP_ID` is not set, the app uses a default test ID
- This allows the application to run without configuration for testing

## Development Notes

### TypeScript Configuration
The `tsconfig.json` includes `vite/client` types to support `import.meta.env` TypeScript definitions.

### Vite Configuration
The `vite.config.ts` loads environment variables from `.env` files in the project root.

### Testing
1. Set your `VITE_PRIVY_APP_ID` in the `.env` file
2. Run `npm run dev` to start the development server
3. Open the app in your browser - you should see the login screen first
4. Click "Connect with Privy" to test authentication
5. The application will use Mantle Sepolia for all wallet connections

## Troubleshooting

### Common Issues

1. **"Property 'env' does not exist on type 'ImportMeta'`**
   - Ensure `vite/client` is included in the `types` array in `tsconfig.json`

2. **Login screen not appearing first**
   - Check the authentication logic in `App.tsx`
   - Verify that `usePrivy()` hook is properly initialized

3. **Wallet not connecting to Mantle Sepolia**
   - Verify the network configuration in `index.tsx`
   - Check that Mantle Sepolia is added to your wallet's network list

4. **Environment variable not loading**
   - Ensure the variable is prefixed with `VITE_`
   - Restart the development server after changing `.env` files

5. **Privy modal not opening**
   - Verify your Privy App ID is correct
   - Check browser console for any authentication errors

## Security Notes

- Never commit `.env` files to version control
- Use different Privy App IDs for development and production
- The fallback test ID should only be used for local development