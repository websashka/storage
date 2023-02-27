import React from "react"

export const Layout = ({ children }: React.HTMLProps<HTMLBaseElement>) => (
  <div className="min-h-screen flex flex-col">{children}</div>
)
