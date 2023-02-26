import { cva } from "class-variance-authority"
import React from "react"
import { cn } from "shared/lib"

const alertVariants = cva("p-4 mb-4 text-sm text-center rounded-lg", {
  variants: {
    variant: {
      warning:
        "text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300",
    },
  },
})

export interface AlertProps extends React.HTMLProps<HTMLDivElement> {
  variant?: "warning"
}
export const Alert = ({ children, variant, className }: AlertProps) => (
  <div className={cn(alertVariants({ variant, className }))} role="alert">
    {children}
  </div>
)
