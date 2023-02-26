import React, { useContext, useEffect } from "react"
import { ReactComponent as ArrowIcon } from "shared/assets/icons/arrow.svg"
import { UserContext } from "../../entities/User"
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
      <div className="flex flex-col absolute">
        <ArrowIcon className="self-end" />
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900">
          Please, connect your wallet
        </p>
      </div>
    </section>
  )
}
