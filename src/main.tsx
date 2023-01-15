import { TonConnectUIProvider } from '@tonconnect/ui-react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {Buffer} from "buffer";


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TonConnectUIProvider
      manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
      walletsListSource="https://raw.githubusercontent.com/ton-connect/wallets-list/feature/openmask/wallets.json"
    >
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>,
)
