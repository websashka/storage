import { TonConnectButton } from "@tonconnect/ui-react"
import React from "react"
import { Header, Alert } from "shared/ui"

export const AppHeader = () => (
  <Header
    alert={
      <Alert variant="warning">Attention! This is a testnet version</Alert>
    }
  >
    <TonConnectButton className="ml-auto" />
  </Header>
)
