import React from "react"
import { cn } from "shared/lib"

export interface ContentProps extends React.HTMLProps<HTMLBaseElement> {}

export const Content = ({ children, className, ...props }: ContentProps) => (
  <main
    {...props}
    className={cn(["flex-1 py-8 px-4 sm:py-16 lg:px-6", className])}
  >
    {children}
  </main>
)
