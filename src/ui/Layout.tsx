import React from "react"

const Layout = ({ children }: React.HTMLProps<HTMLBaseElement>) => (
  <div className="min-h-screen flex flex-col">{children}</div>
)

export default Layout
