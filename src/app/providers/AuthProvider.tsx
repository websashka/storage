import { ConnectedWallet, useTonConnectUI } from "@tonconnect/ui-react"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { ProviderContext } from "entities/Provider"
import { UserContext } from "entities/User"
import app from "../../shared/lib/feathers"

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
        app.logout().then(() => {
          setIsAuth(false)
        })
        return
      }

      if (
        wallet.connectItems?.tonProof &&
        "proof" in wallet.connectItems.tonProof
      ) {
        const proof = wallet.connectItems.tonProof.proof
        const account = wallet.account

        await app.authenticate({
          strategy: "tonProof",
          address: account.address,
          network: account.chain,
          proof,
        })
      }

      const accessToken = await app.authentication.getAccessToken()
      if (!accessToken) {
        setIsAuth(false)
        await tonConnectUI.disconnect()
        return
      }
      if (wallet && !isAuth) {
        app.reAuthenticate().then(() => {
          setIsAuth(true)
        })
      }
    },
    [walletIsReady, isAuth]
  )

  useEffect(() => {
    return tonConnectUI.onStatusChange(onWalletStatusChange)
  }, [onWalletStatusChange])

  const logoutWallet = useCallback(async () => {
    if (tonConnectUI.connected) {
      await tonConnectUI.disconnect()
    }
  }, [tonConnectUI.connected])

  useEffect(() => {
    app.on("AuthError", logoutWallet)
    return () => {
      app.off("AuthError", logoutWallet)
    }
  }, [logoutWallet])

  return (
    <UserContext.Provider value={{ isAuth, walletIsReady }}>
      <ProviderContext.Provider value={{ provider }}>
        {children}
      </ProviderContext.Provider>
    </UserContext.Provider>
  )
}

export default AuthProvider
