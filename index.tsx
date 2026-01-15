import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Use Vite environment variable for Privy App ID
const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || "cmk5ir5hx01o8l80cqjrkbnuu";

// Mantle Sepolia network configuration
const mantleSepolia = {
  id: 5003,
  name: 'Mantle Sepolia',
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.mantle.xyz'] },
    public: { http: ['https://rpc.sepolia.mantle.xyz'] }
  },
  nativeCurrency: {
    name: 'Mantle',
    symbol: 'MNT',
    decimals: 18
  },
  blockExplorers: {
    default: { name: 'Mantle Sepolia Explorer', url: 'https://explorer.sepolia.mantle.xyz' }
  },
  testnet: true
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ['email', 'wallet', 'google', 'twitter'],
        appearance: {
          theme: 'light',
          accentColor: '#f97316',
          logo: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png',
          showWalletLoginFirst: true,
        },
        // Configure supported networks including Mantle Sepolia
        supportedChains: [mantleSepolia],
        // Set default chain to Mantle Sepolia
        defaultChain: mantleSepolia,
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);