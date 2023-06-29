import { useTonWallet } from "@tonconnect/ui-react"
import prettyBytes from "pretty-bytes"
import Table from "rc-table"
import React, { useState } from "react"
import { useQuery } from "react-query"

import { app } from "shared/lib"
import { Button, Label, Loader, Switch } from "shared/ui"

const downloadBase64File = (contentBase64: string, fileName: string) => {
  const linkSource = `data:application/pdf;base64,${contentBase64}`
  const downloadLink = document.createElement("a")
  document.body.appendChild(downloadLink)

  downloadLink.href = linkSource
  downloadLink.target = "_self"
  downloadLink.download = fileName
  downloadLink.click()
}

const useGetBag = (bagId: string) => {
  return useQuery([bagId], async () => {
    return await app.service("torrent").get(bagId)
  })
}

interface FilesTableProps {
  bagId: string
}

interface DownloadFormProps {
  filename: string
  bagId: string
}
const DownloadForm = ({ filename, bagId }: DownloadFormProps) => {
  const [decrypt, setDecrypt] = useState(false)
  const wallet = useTonWallet()
  const onDownload = () => {
    app
      .service("torrent")
      .getFile(null, {
        query: {
          bagId,
          filename,
        },
      })
      .then(async (content) => {
        let base64 = content
        if (decrypt) {
          base64 = await window.ton.send("ton_decryptMessage", {
            message: content,
          })
        }
        await downloadBase64File(base64, filename)
      })
  }

  return (
    <div className="flex items-center space-x-2">
      <Label>Decrypt?</Label>
      <Switch
        onCheckedChange={setDecrypt}
        disabled={wallet?.name !== "OpenMask"}
      />
      <Button onClick={() => onDownload()}>Download</Button>
    </div>
  )
}

export const FilesTable = ({ bagId }: FilesTableProps) => {
  const { data, isLoading } = useGetBag(bagId)

  if (isLoading) {
    return <Loader />
  }

  return (
    <Table
      data={data?.result?.files}
      columns={[
        {
          title: "Name",
          dataIndex: "name",
        },
        {
          title: "Size",
          dataIndex: "size",
          render: (size) => prettyBytes(parseInt(size)),
        },
        {
          title: "",
          dataIndex: "name",
          render: (filename) => {
            return <DownloadForm filename={filename} bagId={bagId} />
          },
        },
      ]}
    />
  )
}
