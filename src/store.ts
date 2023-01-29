import React from "react"
import { ProviderParams } from "@/types/Provider"

interface IAuthContext {
  isAuth: boolean
  provider: ProviderParams | null
}
export const AuthContext = React.createContext<IAuthContext>({
  isAuth: false,
  provider: null,
})
