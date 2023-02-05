import React from "react"
import { TonConnectButton } from "@tonconnect/ui-react"
import Alert from "@/ui/Alert"
import { ReactComponent as BoxIcon } from "../assets/icons/box.svg"

const Header = () => {
  return (
    <header>
      <div className="flex py-3 px-6 border-solid border-b border-b-gray-200">
        <h1 className="flex items-center gap-2 self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          <BoxIcon width={20} height={20} /> TON Box
        </h1>
        <TonConnectButton className="ml-auto" />
      </div>
      <Alert variant="warning">Attention! This is a testnet version</Alert>
    </header>
  )
}

export default Header
