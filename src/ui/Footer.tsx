import React from "react"
import { ReactComponent as GithubIcon } from "../assets/icons/github.svg"
import { ReactComponent as TelegramIcon } from "../assets/icons/telegram.svg"

const Footer = () => (
  <footer className="p-4 bg-white sm:p-6 dark:bg-gray-900">
    <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <div className="sm:flex sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        2023 Base on{" "}
        <a target="_blank" href="https://ton.org/" className="hover:underline">
          TON
        </a>
      </span>
      <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
        <a
          target="_blank"
          href="https://github.com/websashka"
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <GithubIcon className="w-5 h-5" />
          <span className="sr-only">GitHub account</span>
        </a>
        <a
          target="_blank"
          href="https://t.me/websashka"
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <TelegramIcon className="w-5 h-5" />
          <span className="sr-only">GitHub account</span>
        </a>
      </div>
    </div>
  </footer>
)

export default Footer
