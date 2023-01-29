import React from "react"
import FilesTable from "./FilesTable"
import dayjs from "dayjs"
import TonWeb from "tonweb"
import { OP_CODES } from "@/constants"
import { useQuery } from "react-query"
import app from "../feathers"
import { base64ToHex } from "@/utils/string"
import Table from "rc-table"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/ui/ContextMenu"
import prettyBytes from "pretty-bytes"
import Loader from "@/ui/Loader"
import CopyButton from "@/ui/CopyButton"

const TorrentsTable = () => {
  const { data, isLoading } = useQuery(
    ["torrents"],
    async () => await app.service("torrent").find()
  )
  const onClose = async (address: string) => {
    const addressContract = new TonWeb.Address(address).toString(
      true,
      true,
      true
    )

    const cell = new TonWeb.boc.Cell()
    cell.bits.writeUint(OP_CODES.CLOSE_CONTRACT, 32)
    cell.bits.writeUint(Math.trunc(new Date().getTime() / 1e3), 64)
    const message = await cell.toBoc()
    const txRes = await window.openmask.provider.send("ton_sendTransaction", {
      to: addressContract,
      value: "30000000",
      data: TonWeb.utils.bytesToBase64(message),
      dataType: "boc",
    })
  }

  const ref = React.useRef<HTMLSpanElement>(null)

  const onTopUp = async (address: string) => {
    const addressContract = new TonWeb.Address(address).toString(
      true,
      true,
      true
    )

    const cell = new TonWeb.boc.Cell()
    cell.bits.writeUint(OP_CODES.TOPUP_BALANCE, 32)
    cell.bits.writeUint(Math.trunc(new Date().getTime() / 1e3), 64)
    const message = await cell.toBoc()
    const txRes = await window.openmask.provider.send("ton_sendTransaction", {
      to: addressContract,
      value: "30000000",
      data: TonWeb.utils.bytesToBase64(message),
      dataType: "boc",
    })
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Table
        rowKey="torrent"
        onRow={() => ({
          onContextMenu: (e) => {
            e.preventDefault()

            ref.current?.dispatchEvent(
              new MouseEvent("contextmenu", {
                bubbles: true,
                clientX: e.clientX,
                clientY: e.clientY,
              })
            )
          },
        })}
        expandable={{
          expandedRowRender: (record) => (
            <FilesTable bagId={base64ToHex(record.torrent)} />
          ),
        }}
        data={data?.torrents}
        columns={[
          {
            title: "Bag ID",
            dataIndex: "torrent",
            render: (torrent) => (
              <CopyButton text={base64ToHex(torrent).toUpperCase()} />
            ),
          },
          {
            title: "Created date",
            dataIndex: "created_time",
            render: (time) => dayjs.unix(time).format("DD/MM/YYYY HH:mm"),
          },
          {
            title: "Balance",
            dataIndex: "contract_balance",
            render: (balance) =>
              `${parseFloat(TonWeb.utils.fromNano(balance)).toFixed(2)} TON`,
          },
          {
            title: "Size",
            dataIndex: "file_size",
            render: (size) => prettyBytes(parseInt(size)),
          },
        ]}
      />
      <ContextMenu>
        <ContextMenuTrigger ref={ref} />
        <ContextMenuContent>
          <ContextMenuItem>Close</ContextMenuItem>
          <ContextMenuItem>TopUp</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}

export default TorrentsTable
