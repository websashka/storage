import React, { useEffect, useState } from "react"
import { useTonConnectUI } from "@tonconnect/ui-react"
import TonProofService from "../services/TonProofService"
import { AuthContext } from "@/store"

interface AuthProviderProps extends React.HTMLProps<HTMLBaseElement> {}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [tonConnectUI] = useTonConnectUI()
  const [isAuth, setIsAuth] = useState(false)

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
    <AuthContext.Provider value={{ isAuth }}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
