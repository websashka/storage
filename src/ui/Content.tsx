import React from "react"
import { cn } from "@/lib/utils"

export interface ContentProps extends React.HTMLProps<HTMLBaseElement> {}

const Content = ({ children, className, ...props }: ContentProps) => (
  <main {...props} className={cn(["py-8 px-4 sm:py-16 lg:px-6", className])}>
    {children}
  </main>
)

export default Content
