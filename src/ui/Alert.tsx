import React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva("p-4 mb-4 text-sm text-center rounded-lg", {
  variants: {
    variant: {
      warning:
        "text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300",
    },
  },
})

interface AlertProps extends React.HTMLProps<HTMLDivElement> {
  variant?: "warning"
}
const Alert = ({ children, variant, className }: AlertProps) => (
  <div className={cn(alertVariants({ variant, className }))} role="alert">
    {children}
  </div>
)

export default Alert
