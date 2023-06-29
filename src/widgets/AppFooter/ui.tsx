import React from "react"
import { GithubIcon, TelegramIcon } from "shared/_assets"
import { Footer } from "shared/ui"

export const AppFooter = () => (
  <Footer>
    <div className="sm:flex sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        2023 Base on{" "}
        <a
          target="_blank"
          href="https://ton.org/"
          className="hover:underline"
          rel="noreferrer"
        >
          TON
        </a>
      </span>
      <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
        <a
          target="_blank"
          href="https://github.com/websashka"
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          rel="noreferrer"
        >
          <GithubIcon className="w-5 h-5" />
          <span className="sr-only">GitHub account</span>
        </a>
        <a
          target="_blank"
          href="https://t.me/websashka"
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
          rel="noreferrer"
        >
          <TelegramIcon className="w-5 h-5" />
          <span className="sr-only">GitHub account</span>
        </a>
      </div>
    </div>
  </Footer>
)
