import { TonConnectUIProvider } from "@tonconnect/ui-react"
import React from "react"
import ReactDOM from "react-dom/client"
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"

import App from "./App"
import { QueryClient, QueryClientProvider } from "react-query"
import TonProofService from "./services/TonProofService"

import "./index.css"
import AuthProvider from "./components/AuthProvider"

const queryClient = new QueryClient()

Sentry.init({
  enabled: import.meta.env.PROD,
  dsn: import.meta.env.VITE_SENTRY_DNS_URL,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <TonConnectUIProvider
      getConnectParameters={() => TonProofService.connectWalletRequest}
      walletsListSource="https://raw.githubusercontent.com/ton-connect/wallets-list/main/wallets.json"
      manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
)
