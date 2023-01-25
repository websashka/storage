import { TonConnectUIProvider } from '@tonconnect/ui-react'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import {QueryClient, QueryClientProvider} from "react-query";
import TonProofService from "./services/TonProofService";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TonConnectUIProvider
        getConnectParameters={() => TonProofService.connectWalletRequest}
        walletsListSource="https://raw.githubusercontent.com/ton-connect/wallets-list/main/wallets.json"
        manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
      >
        <App />
      </TonConnectUIProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
