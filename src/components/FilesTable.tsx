import React from "react"
import { useQuery } from "react-query"
import app from "../feathers"
import { Button } from "@/ui/Button"
import Table from "rc-table"
import prettyBytes from "pretty-bytes"
import Loader from "@/ui/Loader"

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

const FilesTable = ({ bagId }: FilesTableProps) => {
  const { data, isLoading } = useGetBag(bagId)

  const onDownload = (filename: string) => {
    app
      .service("torrent")
      .getFile(null, {
        query: {
          bagId,
          filename,
        },
      })
      .then(async (base64) => {
        const decryptedBase64 = await window.ton.send("ton_decryptMessage", {
          message: base64,
        })
        await downloadBase64File(decryptedBase64, filename)
      })
  }

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
            return (
              <>
                <Button onClick={() => onDownload(filename)}>Download</Button>
              </>
            )
          },
        },
      ]}
    />
  )
}

export default FilesTable
