import { ClipboardCheckIcon, ClipboardCopyIcon } from "lucide-react"
import React, { useState } from "react"

export interface CopyButtonProps {
  text: string
}

async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text)
  } else {
    return document.execCommand("copy", true, text)
  }
}

export const CopyButton = ({ text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false)

  return (
    <>
      {text}{" "}
      {copied ? (
        <ClipboardCheckIcon className="mr-2 h-4 w-4 inline" />
      ) : (
        <ClipboardCopyIcon
          className="mr-2 h-4 w-4 inline cursor-pointer"
          onClick={async () => {
            await copyTextToClipboard(text)
            setCopied(true)
            setTimeout(() => {
              setCopied(false)
            }, 2000)
          }}
        />
      )}
    </>
  )
}
