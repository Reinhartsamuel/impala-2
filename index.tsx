import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Safely get env var or fallback
const privyAppId = (typeof process !== 'undefined' && process.env?.PRIVY_APP_ID) 
  ? process.env.PRIVY_APP_ID 
  : "cmk5ir5hx01o8l80cqjrkbnuu";

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
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);