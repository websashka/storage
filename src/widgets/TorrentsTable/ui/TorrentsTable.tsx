import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"
import dayjs from "dayjs"
import {
  Boxes,
  Globe2,
  MoreHorizontal,
  XOctagonIcon,
  TrendingUp,
} from "lucide-react"
import prettyBytes from "pretty-bytes"
import Table from "rc-table"
import React, { useState } from "react"
import TonWeb from "tonweb"

import { Replication } from "features/Replication"
import { Torrent, useTorrents } from "entities/Torrent"
import { TonCoinIcon } from "shared/_assets"
import { base64ToHex, OP_CODES } from "shared/lib"
import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  CopyButton,
  Loader,
} from "shared/ui"
import { FilesTable } from "./FilesTable"

enum CONTRACT_STATUSES {
  deployed = "deployed",
  confirmed = "confirmed",
  terminated = "terminated",
  closed = "closed",
}

export const TorrentsTable = () => {
  const wallet = useTonWallet()
  const { data, isLoading } = useTorrents(wallet?.account.address)

  const [replicationModalOpen, setReplicationModalOpen] = useState(false)

  const [tonConnectUI] = useTonConnectUI()

  const [currentContext, setCurrentContext] = useState<string | null>(null)
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
      <Replication
        open={replicationModalOpen}
        onOpenChange={(open) => {
          setReplicationModalOpen(open)
        }}
      />
      <Table<Torrent>
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
        data={data?.contracts?.filter((contract: any) =>
          [CONTRACT_STATUSES.deployed, CONTRACT_STATUSES.confirmed].includes(
            contract.status
          )
        )}
        columns={[
          {
            title: "Bag ID",
            dataIndex: "torrent_hash",
            render: (torrent) => <CopyButton text={torrent?.toUpperCase()} />,
          },
          {
            title: "Status",
            dataIndex: "status",
          },
          {
            title: "Last proof",
            dataIndex: "last_proof_time",
            render: (time) => dayjs.unix(time).format("DD/MM/YYYY HH:mm"),
          },
          {
            title: "Balance",
            dataIndex: "balance",
            render: (balance) => {
              console.log(balance)
              return (
                <>
                  {parseFloat(TonWeb.utils.fromNano(balance)).toFixed(2)}
                  <TonCoinIcon className="inline" />
                </>
              )
            },
          },
          {
            title: "Size",
            dataIndex: "file_size",
            render: (size) => prettyBytes(parseInt(size)),
          },
          {
            title: "",
            dataIndex: "",
            render: () => (
              <Button
                variant="ghost"
                onClick={(e) => {
                  const { x, bottom } = e.currentTarget.getBoundingClientRect()
                  ref.current?.dispatchEvent(
                    new MouseEvent("contextmenu", {
                      bubbles: true,
                      clientX: x,
                      clientY: bottom,
                    })
                  )
                }}
                icon={<MoreHorizontal size={15} />}
              />
            ),
          },
        ]}
      />
      <ContextMenu>
        <ContextMenuTrigger ref={ref} />
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => {
              if (currentContext) {
                onTopUp(currentContext)
              }
            }}
            icon={<TrendingUp size={15} />}
          >
            TopUp
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              setReplicationModalOpen(true)
            }}
            icon={<Boxes size={15} />}
          >
            Replication
          </ContextMenuItem>
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
            icon={<Globe2 size={15} />}
          >
            Explorer
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              if (currentContext) {
                onClose(currentContext)
              }
            }}
            icon={<XOctagonIcon size={15} />}
          >
            Close
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}
