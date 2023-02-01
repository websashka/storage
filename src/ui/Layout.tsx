import React from "react"

const Layout = ({ children }: React.HTMLProps<HTMLBaseElement>) => (
  <div className="min-h-screen flex flex-col justify-around">{children}</div>
)

export default Layout
