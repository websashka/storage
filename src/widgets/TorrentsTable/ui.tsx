import { useTonConnectUI } from "@tonconnect/ui-react"
import dayjs from "dayjs"
import prettyBytes from "pretty-bytes"
import Table from "rc-table"
import React, { useState } from "react"
import { useQuery } from "react-query"
import TonWeb from "tonweb"

import app from "app/feathers"
import { FilesTable } from "widgets/FilesTable"
import { ReactComponent as TonCoin } from "shared/assets/icons/ton-coin.svg"
import { OP_CODES } from "shared/constants"
import { base64ToHex } from "shared/lib"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  CopyButton,
  Loader,
} from "shared/ui"
export const TorrentsTable = () => {
  const { data, isLoading } = useQuery(
    ["torrents"],
    async () => await app.service("torrent").find()
  )

  const [tonConnectUI] = useTonConnectUI()

  const [currentContext, setCurrentContext] = useState(null)
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
    try {
      await tonConnectUI.sendTransaction({
        validUntil:
          Date.now() + parseInt(import.meta.env.VITE_APPROVE_TIME) ||
          5 * 60 * 1000,
        messages: [
          {
            address: addressContract,
            payload: TonWeb.utils.bytesToBase64(message),
            amount: "30000000",
          },
        ],
      })
    } catch (e) {
      console.error(e)
    }
  }

  const ref = React.useRef<HTMLSpanElement>(null)

  const onTopUp = async (address: string) => {
    const addressContract = new TonWeb.Address(address).toString(
      true,
      true,
      true
    )
    try {
      await tonConnectUI.sendTransaction({
        validUntil:
          Date.now() + parseInt(import.meta.env.VITE_APPROVE_TIME) ||
          5 * 60 * 1000,
        messages: [
          {
            address: addressContract,
            amount: "30000000",
          },
        ],
      })
    } catch (e) {
      console.error(e)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Table
        rowKey="torrent"
        onRow={(record) => ({
          onContextMenu: (e) => {
            e.preventDefault()
            setCurrentContext(record.address)
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
            dataIndex: "client_balance",
            render: (balance) => (
              <>
                {parseFloat(TonWeb.utils.fromNano(balance)).toFixed(2)}
                <TonCoin className="inline" />
              </>
            ),
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
          <ContextMenuItem
            onClick={() => {
              window
                .open(
                  `${
                    import.meta.env.VITE_EXPLORER_URL
                  }/address/${currentContext}`,
                  "_blank"
                )
                ?.focus()
            }}
          >
            Explorer
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              if (currentContext) {
                onClose(currentContext)
              }
            }}
          >
            Close
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              if (currentContext) {
                onTopUp(currentContext)
              }
            }}
          >
            TopUp
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}
