import React, { useContext, useEffect } from "react"
import { ArrowIcon } from "shared/assets/icons"
import { UserContext } from "entities/User"
import { useNavigate } from "react-router-dom"

export const RequestConnectPage = () => {
  const { isAuth } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) {
      navigate("/")
    }
  }, [isAuth])

  return (
    <section>
      <div className="flex flex-col items-end">
        <div>
          <ArrowIcon/>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900">
            Please, connect your wallet
          </p>
        </div>
      </div>
    </section>
  )
}
