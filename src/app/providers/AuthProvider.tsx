import { ConnectedWallet, useTonConnectUI } from "@tonconnect/ui-react"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { ProviderContext } from "entities/Provider"
import { UserContext } from "entities/User"
import app from "../feathers"
import TonProofService from "./TonProofService"
import { useLocation, useNavigate } from "react-router-dom"

export interface QueryResponse<R> {
  ok: boolean
  code: number
  result: R
}

export type ProviderParamsResponse = QueryResponse<{
  ["@type"]: "storage.daemon.provider.params"
  accept_new_contracts: boolean
  max_span: number
  maximal_file_size: string
  minimal_file_size: string
  rate_per_mb_day: string
}>

interface AuthProviderProps extends React.HTMLProps<HTMLBaseElement> {}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [tonConnectUI] = useTonConnectUI()
  const [isAuth, setIsAuth] = useState(false)
  const [walletIsReady, setWalletIsReady] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const { data: providerResponse } = useQuery<ProviderParamsResponse>(
    [],
    async () => {
      return await app
        .service("provider")
        .get(import.meta.env.VITE_PROVIDER_ADDRESS)
    }
  )

  const provider = useMemo(() => {
    if (!providerResponse?.result) {
      return null
    }

    return {
      acceptNewContracts: providerResponse?.result?.accept_new_contracts,
      maxSpan: providerResponse?.result.max_span,
      rate: parseInt(providerResponse?.result.rate_per_mb_day),
      maximalFileSize: parseInt(providerResponse?.result.maximal_file_size),
      minimalFileSize: parseInt(providerResponse?.result.minimal_file_size),
    }
  }, [providerResponse])

  useEffect(() => {
    tonConnectUI.connectionRestored.then((state) => {
      setIsAuth(state)
      setWalletIsReady(true)
    })
  }, [])

  const onWalletStatusChange = useCallback(
    async (wallet: ConnectedWallet | null) => {
      if (!wallet) {
        setIsAuth(false)
        TonProofService.reset()
        return
      }

      if (
        wallet.connectItems?.tonProof &&
        "proof" in wallet.connectItems.tonProof
      ) {
        await TonProofService.checkProof(
          wallet.connectItems.tonProof.proof,
          wallet.account
        )
      }

      if (!TonProofService.accessToken) {
        setIsAuth(false)
        await tonConnectUI.disconnect()
        return
      }
      if (wallet && !isAuth && walletIsReady) {
        setIsAuth(true)
      }
    },
    [walletIsReady, isAuth]
  )

  useEffect(() => {
    return tonConnectUI.onStatusChange(onWalletStatusChange)
  }, [onWalletStatusChange])

  return (
    <UserContext.Provider value={{ isAuth, walletIsReady }}>
      <ProviderContext.Provider value={{ provider }}>
        {children}
      </ProviderContext.Provider>
    </UserContext.Provider>
  )
}

export default AuthProvider
