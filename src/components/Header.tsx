import React from "react"
import { TonConnectButton } from "@tonconnect/ui-react"

const Header = () => {
  return (
    <header>
      <div className="flex py-3 px-6 border-solid border-b border-b-gray-200">
        <TonConnectButton className="ml-auto" />
      </div>
    </header>
  )
}

export default Header
