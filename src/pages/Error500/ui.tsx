import React from "react"
import { ReactComponent as Icon500 } from "shared/assets/images/500.svg"
export const Error500Page = () => (
  <section className="bg-white dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:px-6">
      <div className="mx-auto max-w-screen-sm text-center">
        <Icon500 className="mx-auto" />
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
          Internal Server Error.
        </p>
        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          We are already working to solve the problem.{" "}
        </p>
      </div>
    </div>
  </section>
)
