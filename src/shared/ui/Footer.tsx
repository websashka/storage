import React from "react"

export const Footer = ({ children }: React.HTMLProps<HTMLBaseElement>) => (
  <footer className="p-4 bg-white sm:p-6 dark:bg-gray-900">
    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    {children}
  </footer>
)
