import React, { useContext } from "react"
import RequestConnectPage from "@/pages/RequestConnectPage"
import { AuthContext } from "@/store"

interface RequireAuthProps extends React.HTMLProps<HTMLBaseElement> {
  redirect?: string
}

const RequireAuth = ({ children, redirect }: RequireAuthProps) => {
  const { isAuth } = useContext(AuthContext)

  if (!(isAuth || redirect)) {
    return <RequestConnectPage />
  }

  return <>{children}</>
}

export default RequireAuth
