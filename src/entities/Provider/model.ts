import React from "react"

export interface ProviderParams {
  maxSpan: number
  rate: number
  acceptNewContracts: boolean
  maximalFileSize: number
  minimalFileSize: number
}

export interface IProviderContext {
  provider: ProviderParams | null
}
export const ProviderContext = React.createContext<IProviderContext>({
  provider: null,
})
