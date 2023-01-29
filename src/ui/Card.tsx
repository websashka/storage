import React from "react"
import { cn } from "@/lib/utils"

const Card = ({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn([
      "bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700",
      className,
    ])}
  >
    <div className="border-t border-gray-200 dark:border-gray-600">
      <div className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800">
        {children}
      </div>
    </div>
  </div>
)

export { Card }
