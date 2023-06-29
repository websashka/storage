import React from "react"
import { BoxIcon } from "shared/_assets"

export interface HeaderProps extends React.HTMLProps<HTMLBaseElement> {
  alert?: React.ReactNode
}

export const Header = ({ alert, children }: HeaderProps) => {
  return (
    <header>
      <div className="flex py-3 px-6 border-solid border-b border-b-gray-200">
        <h1 className="flex items-center gap-2 self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          <BoxIcon width={20} height={20} />{" "}
          <span className="max-xs:hidden">TON Box</span>
        </h1>
        {children}
      </div>
      {alert}
    </header>
  )
}
