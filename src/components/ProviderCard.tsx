import React, { useContext } from "react"
import { Statistic } from "@/ui/Statistic"
import { Card } from "@/ui/Card"
import { useQuery } from "react-query"
import app from "@/feathers"
import { AuthContext } from "@/store"
import TonWeb from "tonweb"
import { ReactComponent as TonCoin } from "../assets/icons/ton-coin.svg"
import BN from "bn.js"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import relativeTime from "dayjs/plugin/relativeTime"
import prettyBytes from "pretty-bytes"
dayjs.extend(duration)
dayjs.extend(relativeTime)

const ProviderCard = ({ className }: React.HTMLProps<HTMLDivElement>) => {
  const { provider } = useContext(AuthContext)

  if (!provider) {
    return null
  }

  return (
    <Card className={className}>
      <Statistic
        items={[
          {
            key: "per MB/day",
            value: (
              <>
                {TonWeb.utils.fromNano(new BN(provider.rate))}
                <TonCoin className="inline" />
              </>
            ),
          },
          {
            key: "Max. span between proofs",
            value: dayjs.duration(provider.maxSpan, "seconds").humanize(),
          },
          {
            key: "Min file size",
            value: prettyBytes(provider.minimalFileSize),
          },
          {
            key: "Max file size",
            value: prettyBytes(provider.maximalFileSize),
          },
        ]}
      />
    </Card>
  )
}

export default ProviderCard
