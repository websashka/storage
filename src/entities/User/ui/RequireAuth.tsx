import React, { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { UserContext } from "../model"
import { Loader } from "shared/ui"

interface RequireAuthProps extends React.HTMLProps<HTMLBaseElement> {}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuth, walletIsReady } = useContext(UserContext)
  const location = useLocation()

  if (!walletIsReady) {
    return <Loader />
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
