import React from "react"

export interface IUserContext {
  isAuth: boolean
  walletIsReady: boolean
}

export const UserContext = React.createContext<IUserContext>({
  isAuth: false,
  walletIsReady: false,
})
