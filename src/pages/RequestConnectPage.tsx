import React from "react"
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow.svg"

const RequestConnectPage = () => (
  <section>
    <div className="flex flex-col absolute right-40">
      <ArrowIcon className="self-end" />
      <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900">
        Please, connect your wallet
      </p>
    </div>
  </section>
)

export default RequestConnectPage
