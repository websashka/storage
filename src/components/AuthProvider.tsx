import React, { useEffect, useMemo, useState } from "react"
import { useTonConnectUI } from "@tonconnect/ui-react"
import TonProofService from "../services/TonProofService"
import { AuthContext } from "@/store"
import { useQuery } from "react-query"
import app from "@/feathers"
import { ProviderParamsResponse } from "@/types/Provider"

interface AuthProviderProps extends React.HTMLProps<HTMLBaseElement> {}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [tonConnectUI] = useTonConnectUI()
  const [isAuth, setIsAuth] = useState(false)

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

  useEffect(
    () =>
      tonConnectUI.onStatusChange(async (wallet) => {
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

        if (wallet) {
          setIsAuth(true)
        }
      }),
    []
  )

  return (
    <AuthContext.Provider value={{ isAuth, provider }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
