import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"
import { TonConnectUIProvider } from "@tonconnect/ui-react"
import React from "react"
import ReactDOM from "react-dom/client"

import { QueryClient, QueryClientProvider } from "react-query"
import TonProofService from "./providers/TonProofService"

import "./index.css"
import { RouterProvider } from "react-router-dom"
import { router } from "../pages"

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
      manifestUrl={import.meta.env.VITE_MANIFEST_URL}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </TonConnectUIProvider>
  </React.StrictMode>
)
